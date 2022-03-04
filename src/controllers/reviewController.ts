import { NextFunction, Request, Response } from 'express'
import { ReviewModel } from '../models/reviewModel'
import { catchAsync } from '../utils/catchAsync'

export const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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
    const reviews = await ReviewModel.find()

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: { reviews },
    })
  },
)
