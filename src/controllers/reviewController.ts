import { IReview, ReviewModel as model } from '../models/reviewModel'
import {
  ICustomRequestExpress,
  ICustomResponseExpress,
  ICustomNextFunction,
} from '../typing/app.type'
import * as factory from './handlerFactory'

export const setTourUserIds = (
  req: ICustomRequestExpress,
  res: ICustomResponseExpress,
  next: ICustomNextFunction,
) => {
  if (!req.body.tour) req.body.tour = req.params.tourId
  if (!req.body.user) req.body.user = req.user!.id
  next()
}

export const getAllReviews = factory.getAll<IReview>(model)

export const getReview = factory.getOne<IReview>(model)

export const createReview = factory.createOne<IReview>(model)

export const updateReview = factory.updateOne<IReview>(model)

export const deleteReview = factory.deleteOne<IReview>(model)
