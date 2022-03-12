import { IUser, UserModel as model } from '../models/userModel'
import {
  ICustomRequestExpress,
  ICustomResponseExpress,
  ICustomNextFunction,
} from '../typing/app.type'
import AppError from '../utils/appError'
import { catchAsync } from '../utils/catchAsync'
import * as factory from './handlerFactory'

const filterObj = (
  obj: { [key: string]: unknown },
  ...allowedFields: string[]
) => {
  const newObj: typeof obj = {}
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}

export const getAllUsers = factory.getAll<IUser>(model)

export const getMe = (
  req: ICustomRequestExpress,
  res: ICustomResponseExpress,
  next: ICustomNextFunction,
) => {
  req.params.id = req.user?.id
  next()
}

// users update theif info by themselves
export const updateMe = catchAsync(
  async (
    req: ICustomRequestExpress,
    res: ICustomResponseExpress,
    next: ICustomNextFunction,
  ) => {
    // 1. Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          'This route is not for password update, please use /updateMyPassword',
          400,
        ),
      )
    }

    // 2. Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email')

    // 3. Update user document
    const updatedUser = await model.findByIdAndUpdate(
      req.user!.id,
      filteredBody,
      { new: true, runValidators: true },
    )

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    })
  },
)

export const deleteMe = catchAsync(
  async (
    req: ICustomRequestExpress,
    res: ICustomResponseExpress,
    next: ICustomNextFunction,
  ) => {
    await model.findByIdAndUpdate(req.user!.id, { active: false })

    res.status(204).json({
      status: 'success',
      data: null,
    })
  },
)

export const createUser = (
  req: ICustomRequestExpress,
  res: ICustomResponseExpress,
  next: ICustomNextFunction,
) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined! Please use /signup instead',
  })
}
export const getUser = factory.getOne<IUser>(model)

// DO not update password with this!!!
export const updateUser = factory.updateOne<IUser>(model)

export const deleteUser = factory.deleteOne<IUser>(model)
