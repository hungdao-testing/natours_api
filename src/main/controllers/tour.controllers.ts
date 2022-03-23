import {
  ICustomRequestExpress,
  ICustomResponseExpress,
  ICustomNextFunction,
} from '../../typing/app.type'
import { TourModel as model, TourModel } from '../models/tour.model'
import { catchAsync } from '../utils/catchAsync'
import * as factory from './handlerFactory.controller'
import AppError from '../utils/appError'

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

export const getToursWithin = catchAsync(
  async (
    req: ICustomRequestExpress,
    res: ICustomResponseExpress,
    next: ICustomNextFunction,
  ) => {
    const { distance, latlng, unit } = req.params
    const [lat, lng] = latlng.split(',')

    const radius =
      unit === 'mi'
        ? parseFloat(distance) / 3963.2
        : parseFloat(distance) / 6738.1

    if (!lat || !lng) {
      next(
        new AppError(
          'Please provide lattitude and longtitude in the format `lat,lng`',
          400,
        ),
      )
    }

    const tours = await TourModel.find({
      startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    })

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        data: tours,
      },
    })
  },
)

export const getDistances = catchAsync(
  async (
    req: ICustomRequestExpress,
    res: ICustomResponseExpress,
    next: ICustomNextFunction,
  ) => {
    const { latlng, unit } = req.params
    const [lat, lng] = latlng.split(',')

    const multiplier = unit === 'mi' ? 0.000621371 : 0.001

    if (!lat || !lng) {
      next(
        new AppError(
          'Please provide lattitude and longtitude in the format `lat,lng`',
          400,
        ),
      )
    }

    const distances = await TourModel.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          distanceField: 'distance',
          distanceMultiplier: multiplier, // 0.00{d} (2 numbers: 0.001 and 0.000621371 to convert meter to km and miles)
        },
      },
      {
        $project: {
          distance: 1,
          name: 1,
        },
      },
    ])

    res.status(200).json({
      status: 'success',

      data: {
        data: distances,
      },
    })
  },
)
