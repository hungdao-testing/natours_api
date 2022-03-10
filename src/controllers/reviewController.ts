import { NextFunction, Request, Response } from 'express'
import { ReviewModel } from '../models/reviewModel'
import { ICustomRequestExpress } from '../typing/types'
import { catchAsync } from '../utils/catchAsync'

export const createReview = catchAsync(
  async (req: ICustomRequestExpress, res: Response, next: NextFunction) => {
    if (!req.body.tour) req.body.tour = req.params.tourId
    if (!req.body.user) req.body.user = req.user!.id

    const newReview = await ReviewModel.create(req.body)

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
    const reviews = await ReviewModel.find(filter)

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: { reviews },
    })
  },
)
