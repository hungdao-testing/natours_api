import { CookieOptions, NextFunction, Request, Response } from 'express'
import { IUser, UserModel } from '../models/user.model'
import { catchAsync } from '../utils/catchAsync'
import jwt, { JwtPayload } from 'jsonwebtoken'
import AppError from '../utils/appError'
import { sendEmail } from '../utils/email'
import {
  ICustomRequestExpress,
  ICustomResponseExpress,
  UserRoles,
} from '../../typing/app.type'
import crypto from 'crypto'

const verifyToken = (token: string, secret: string): Promise<JwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, payload) => {
      if (err) return reject(err)
      return resolve(payload as JwtPayload)
    })
  })
}

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN!,
  })
}

export const createSendToken = (
  user: IUser,
  statusCode: number,
  res: Response,
) => {
  const token = signToken(user._id)

  const cookieOptions: CookieOptions = {
    expires: new Date(
      Date.now() +
        parseInt(process.env.JWT_COOKIE_EXPIRES_IN!) * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  }

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true

  res.cookie('jwt', token, cookieOptions)

  //Pick-up selected fields from the IUser and show to output
  const currentUser: Partial<IUser> = {
    name: user.name,
    email: user.email,
    role: user.role,
    active: user.active,
    _id: user._id,
  }

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      currentUser,
    },
  })
}

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await UserModel.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt,
      role: req.body.role,
    })

    createSendToken(newUser, 201, res)
  },
)

export const login = catchAsync(
  async (
    req: ICustomRequestExpress,
    res: ICustomResponseExpress,
    next: NextFunction,
  ) => {
    const { email, password } = req.body

    // 1) Check email or password is existed in request body
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400))
    }

    // 2) Check user is existed && password is correct on DB
    const user = await UserModel.findOne({ email }).select('+password')

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401))
    }

    // 3) send token
    createSendToken(user, 200, res)
  },
)

export const protect = catchAsync(
  async (
    req: ICustomRequestExpress,
    res: ICustomResponseExpress,
    next: NextFunction,
  ) => {
    // 1. Getting token and check of it's existed
    let token: string = ''
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return next(
        new AppError('You are not logged in! Please login to get access', 401),
      )
    }
    // 2. Verification the token
    const decoded = await verifyToken(token, process.env.JWT_SECRET!)

    // 3. Check if user still exists (make sure no one changes the user under back-end after system generates token previously)
    const currentUser = await UserModel.findById(decoded['id'])
    if (!currentUser) {
      return next(
        new AppError(
          'The user belongs to this token is no longer existed',
          401,
        ),
      )
    }

    // 4. Check if user changed password after the token was issued
    if (currentUser.changePasswordAfter(decoded.iat!.toString())) {
      return next(
        new AppError(
          'User is recently changed password, please login again!',
          401,
        ),
      )
    }

    //Grant access to the next route
    req.user = currentUser

    next()
  },
)

type TSpreadUser = keyof typeof UserRoles
export const restrictTo = (...roles: Array<TSpreadUser>) => {
  return catchAsync(
    async (req: ICustomRequestExpress, res: Response, next: NextFunction) => {
      const reqRole = req.user?.role.toUpperCase() as TSpreadUser

      if (!roles.includes(reqRole)) {
        return next(
          new AppError(
            'You do not have permission to perform this action',
            403,
          ),
        )
      }
      next()
    },
  )
}

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1. Get user based on the email in request body
    const user = await UserModel.findOne({ email: req.body.email })
    if (!user) {
      return next(new AppError('There is no user with email', 404))
    }

    // 2. Generate random token
    const resetToken = user.createPasswordResetToken()
    await user.save({ validateBeforeSave: false })

    // 3. Send token (plain version) to user's email
    const resetURL = `${req.protocol}://${req.get(
      'host',
    )}/api/v1/users/resetPassword/${resetToken}`

    const message = `Forgot your password? Submit a PATCH request witho your new password and passwordConfirm to: ${resetURL}.\n If you didnot forget your password, please ignore this email`

    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 mins)',
        message,
      })

      res.status(200).json({
        status: 'success',
        messsage: "Token is sent to user's email!",
      })
    } catch (error) {
      user.passwordResetToken = undefined
      user.passwordResetExpires = undefined
      await user.save({ validateBeforeSave: false })

      return next(
        new AppError('There was an error sending email, try again later', 500),
      )
    }
  },
)

export const resetPassword = catchAsync(
  async (req: ICustomRequestExpress, res: Response, next: NextFunction) => {
    // 1. Get user based token: get token (sent via email in plain text), then encrypted => compare to the saved one on DB

    const hasedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex')

    const user = await UserModel.findOne({
      passwordResetToken: hasedToken,
      passwordResetExpires: { $gt: Date.now() }, // check if the passwordResetExpire has expired yet ? ( < now() means expired)
    })

    // 2. If the token has expired, and there is a user, set new password
    if (!user) {
      return next(new AppError('Token is invalid or expired', 400))
    }

    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined

    await user.save()

    // 3. Update changePasswordAt property for user

    // 4. Log the user in => send JWT
    createSendToken(user, 200, res)
  },
)

export const updatePassword = catchAsync(
  async (req: ICustomRequestExpress, res: Response, next: NextFunction) => {
    // 1. Get user from collection
    const user = await UserModel.findById(req.user!._id).select('+password')

    // 2. check if POSTed current password is correct
    let currentUser: IUser
    if (!user) {
      return next(new AppError('Please check your user information again', 401))
    } else {
      currentUser = user
    }

    if (
      !(await currentUser.correctPassword(
        req.body.passwordCurrent,
        currentUser.password,
      ))
    ) {
      return next(new AppError('Your current password is wrong.', 401))
    }

    // 3. if so, update password.
    currentUser.password = req.body.password
    currentUser.passwordConfirm = req.body.passwordConfirm
    await currentUser.save()

    //4. Log user in, send JWT
    createSendToken(currentUser, 200, res)
  },
)
