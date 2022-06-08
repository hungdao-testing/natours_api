import { ReviewModel as model } from '@models/review.model'
import { IRequest, IResponse, INextFunc } from '../../typing/app.type'
import * as factory from './handlerFactory.controller'

export const setTourUserIds = (
  req: IRequest,
  res: IResponse,
  next: INextFunc,
) => {
  if (!req.body.tour) req.body.tour = req.params.tourId
  if (!req.body.user) req.body.user = req.user!.id
  next()
}

export const getAllReviews = factory.getAll(model, {
  foreignField: 'tour',
  paramField: 'tourId',
})

export const getReview = factory.getOne(model)

export const createReview = factory.createOne(model)

export const updateReview = factory.updateOne(model)

export const deleteReview = factory.deleteOne(model)
