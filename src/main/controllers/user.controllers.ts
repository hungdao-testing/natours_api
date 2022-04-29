import { UserModel as model } from '../models/user.model'
import {
  ICustomRequestExpress,
  ICustomResponseExpress,
  ICustomNextFunction,
} from '../../typing/app.type'
import AppError from '../utils/appError'
import { catchAsync } from '../utils/catchAsync'
import * as factory from './handlerFactory.controller'
import multer from 'multer'
import path from 'path'
import sharp from 'sharp'

// const multerStorage = multer.diskStorage({
//   destination: (req: ICustomRequestExpress, file: Express.Multer.File, cb) => {
//     cb(null, path.join(__dirname, '../..', 'public/img/users'))
//   },
//   filename: (req: ICustomRequestExpress, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `user-${req.user?.id}-${Date.now()}.${ext}`)
//   }
// })

const multerStorage = multer.memoryStorage()

const multerFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: Function,
) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new AppError('Not an image, please upload image only', 400), false)
  }
}

const upload = multer({ storage: multerStorage, fileFilter: multerFilter })

export const uploadUserPhoto = upload.single('photo')

export const resizeUserPhoto = (
  req: ICustomRequestExpress,
  res: ICustomResponseExpress,
  next: ICustomNextFunction,
) => {
  if (!req.file) return next()
  req.file.filename = `user-${req.user?.id}-${Date.now()}.jpeg`

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(
      path.join(__dirname, '../..', `public/img/users/${req.file.filename}`),
    )

  next()
}

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

export const getAllUsers = factory.getAll(model)

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
    if (req.file) filteredBody.photo = req.file.filename

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
export const getUser = factory.getOne(model)

// DO not update password with this!!!
export const updateUser = factory.updateOne(model)

export const deleteUser = factory.deleteOne(model)
