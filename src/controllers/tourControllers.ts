import { NextFunction, Request, Response } from 'express'
import { ITour, TourModel as model } from '../models/tourModel'
import APIFeatures from '../utils/apiFeatures'
import AppError from '../utils/appError'
import { catchAsync } from '../utils/catchAsync'
import * as factory from './handlerFactory'

export const aliasTopTour = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
  next()
}

export const getAllTours = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const features = new APIFeatures(model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()
    const tours = await features.query

    //SEND REQ
    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: {
        tours,
      },
    })
  },
)

export const getTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await model.findById(req.params.id).populate('reviews')
    if (!tour) {
      return next(new AppError('No tour found with the passing ID', 404))
    }

    res.status(200).json({
      status: 'success',
      data: { tour },
    })
  },
)

export const createTour = factory.createOne<ITour>(model)

export const updateTour = factory.updateOne<ITour>(model)

export const deleteTour = factory.deleteOne<ITour>(model)

export const getTourStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const stats = await model.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: '$difficulty', //group by field.
          numRatings: { $sum: '$ratingsQuantity' },
          numTours: { $sum: 1 }, //tips: add `1` to each document going through pipe and accumulating them.
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 }, // 1 means ascending.
      },
    ])
    res.status(200).json({
      status: 'success',
      data: stats,
    })
  },
)

export const getMonthlyPlan = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const year = req.params.year ? parseInt(req.params.year) : 1
    const plan = await model.aggregate([
      {
        $unwind: '$startDates', //$unwind is used to deconstruct an array
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numToursStart: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: {
          month: '$_id',
        },
      },
      {
        $project: { _id: 0 }, // field name = 0 inside the `project` state, means this field not shown up, and `1` is shown up
      },
      {
        $sort: {
          numToursStart: -1,
        },
      },
      { $limit: 12 },
    ])

    res.status(200).json({
      status: 'success',
      data: plan,
    })
  },
)
