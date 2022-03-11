import { Model } from 'mongoose'
import {
  ICustomRequestExpress,
  ICustomResponseExpress,
  ICustomNextFunction,
} from '../typing/app.type'
import AppError from '../utils/appError'
import { catchAsync } from '../utils/catchAsync'

export function deleteOne<T>(model: Model<T>) {
  return catchAsync(
    async (
      req: ICustomRequestExpress,
      res: ICustomResponseExpress,
      next: ICustomNextFunction,
    ) => {
      const doc = await model.findByIdAndDelete(req.params.id)

      if (!doc) {
        return next(
          new AppError(
            `No ${model.collection.collectionName} found with that ID`,
            404,
          ),
        )
      }

      res.status(204).json({
        status: 'success',
        doc,
      })
    },
  )
}

export function updateOne<T>(model: Model<T>) {
  return catchAsync(
    async (
      req: ICustomRequestExpress,
      res: ICustomResponseExpress,
      next: ICustomNextFunction,
    ) => {
      const collectionName = model.collection.collectionName
      const doc = await model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      })
      if (!doc) {
        return next(
          new AppError(`No ${collectionName} found with the passing ID`, 404),
        )
      }
      res.status(200).json({
        status: 'success',
        data: doc,
      })
    },
  )
}

export function createOne<T>(model: Model<T>) {
  return catchAsync(
    async (
      req: ICustomRequestExpress,
      res: ICustomResponseExpress,
      next: ICustomNextFunction,
    ) => {
      const doc = await model.create(req.body)
      res.status(201).json({
        status: 'success',
        data: {
          doc,
        },
      })
    },
  )
}
