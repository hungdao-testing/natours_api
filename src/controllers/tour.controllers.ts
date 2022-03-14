import {
  ICustomRequestExpress,
  ICustomResponseExpress,
  ICustomNextFunction,
} from '../typing/app.type'
import { ITour, TourModel as model } from '../models/tour.model'
import { catchAsync } from '../utils/catchAsync'
import * as factory from './handlerFactory.controller'

export const aliasTopTour = async (
  req: ICustomRequestExpress,
  res: ICustomResponseExpress,
  next: ICustomNextFunction,
) => {
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
  next()
}

export const getAllTours = factory.getAll(model)

export const getTour = factory.getOne(model, { path: 'reviews' })

export const createTour = factory.createOne(model)

export const updateTour = factory.updateOne(model)

export const deleteTour = factory.deleteOne(model)

export const getTourStats = catchAsync(
  async (
    req: ICustomRequestExpress,
    res: ICustomResponseExpress,
    next: ICustomNextFunction,
  ) => {
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
  async (
    req: ICustomRequestExpress,
    res: ICustomResponseExpress,
    next: ICustomNextFunction,
  ) => {
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
