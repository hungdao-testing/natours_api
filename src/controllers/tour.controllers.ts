import {
  IRequest,
  IResponse,
  INextFunc,
} from '../typing/app.type'
import { TourModel as model, TourModel } from '@models/tour.model'
import { catchAsync } from '@utils/catchAsync'
import * as factory from './handlerFactory.controller'
import AppError from '@utils/appError'
import multer from 'multer'
import path from 'path'
import sharp from 'sharp'

const multerStorage = multer.memoryStorage()

const multerFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: Function,
) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new AppError('Not an image, please upload image only', 400), false)
  }
}

const upload = multer({ storage: multerStorage, fileFilter: multerFilter })
export const uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
])

export const resizeTourImages = catchAsync(
  async (
    req: IRequest,
    res: IResponse,
    next: INextFunc,
  ) => {
    let files = req.files as { [fieldname: string]: Express.Multer.File[] }

    if (!files.images || !files.imageCover) return next()

    console.log('Files inside tourController: ', files)

    // 1) Cover image
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`

    await sharp(files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(
        path.join(
          __dirname,
          '../..',
          `public/img/tours/${req.body.imageCover}`,
        ),
      )

    // 2) Images
    req.body.images = []

    await Promise.all(
      files.images.map(async (file, i) => {
        const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`

        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(path.join(__dirname, '../..', `public/img/tours/${filename}`))

        req.body.images.push(filename)
      }),
    )

    next()
  },
)

export const aliasTopTour = async (
  req: IRequest,
  res: IResponse,
  next: INextFunc,
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
    req: IRequest,
    res: IResponse,
    next: INextFunc,
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
    req: IRequest,
    res: IResponse,
    next: INextFunc,
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
    req: IRequest,
    res: IResponse,
    next: INextFunc,
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
      startLocation: {
        $geoWithin: {
          $centerSphere: [[parseFloat(lng), parseFloat(lat)], radius],
        },
      },
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
    req: IRequest,
    res: IResponse,
    next: INextFunc,
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
      results: distances.length,
      data: {
        data: distances,
      },
    })
  },
)
