import { NextFunction, Request, Response } from 'express'
import { IReview, ReviewModel as model } from '../models/reviewModel'
import { ICustomRequestExpress } from '../typing/app.type'
import { catchAsync } from '../utils/catchAsync'
import * as factory from './handlerFactory'

export const createReview = catchAsync(
  async (req: ICustomRequestExpress, res: Response, next: NextFunction) => {
    if (!req.body.tour) req.body.tour = req.params.tourId
    if (!req.body.user) req.body.user = req.user!.id

    const newReview = await model.create(req.body)

    res.status(201).json({
      status: 'success',
      data: {
        review: newReview,
      },
    })
  },
)

export const getAllReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let filter = {}
    if (req.params.tourId) filter = { tour: req.params.tourId }
    const reviews = await model.find(filter)

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: { reviews },
    })
  },
)

export const deleteReview = factory.deleteOne<IReview>(model)
