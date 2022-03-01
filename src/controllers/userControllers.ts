import { NextFunction, Request, Response } from 'express'
import { UserModel } from '../models/userModel'
import { ICustomRequestExpress } from '../typing/types'
import AppError from '../utils/appError'
import { catchAsync } from '../utils/catchAsync'

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

export const getAllUsers = catchAsync(
  async (req: ICustomRequestExpress, res: Response) => {
    const users = await UserModel.find()
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    })
  },
)

// users update theif info by themselves
export const updateMe = catchAsync(
  async (req: ICustomRequestExpress, res: Response, next: NextFunction) => {
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
    const updatedUser = await UserModel.findByIdAndUpdate(
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
  async (req: ICustomRequestExpress, res: Response, next: NextFunction) => {
    await UserModel.findByIdAndUpdate(req.user!.id, { active: false })

    res.status(204).json({
      status: 'success',
      data: null,
    })
  },
)

export const getUser = (
  req: ICustomRequestExpress,
  res: Response,
  next: NextFunction,
) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  })
}
export const createUser = (
  req: ICustomRequestExpress,
  res: Response,
  next: NextFunction,
) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  })
}
export const updateUser = (
  req: ICustomRequestExpress,
  res: Response,
  next: NextFunction,
) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  })
}
export const deleteUser = (
  req: ICustomRequestExpress,
  res: Response,
  next: NextFunction,
) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  })
}
