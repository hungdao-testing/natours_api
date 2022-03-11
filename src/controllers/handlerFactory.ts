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
        data: doc,
      })
    },
  )
}
