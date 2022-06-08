import { parseTours, parseUsers, parseReviews } from './parseFile'

import express from 'express'
import {
  INextFunc,
  IRequest,
  IResponse,
} from '../../typing/app.type'
import { TourModel } from '@models/tour.model'
import { catchAsync } from '@utils/catchAsync'
import { ReviewModel } from '@models/review.model'
import { UserModel } from '@models/user.model'

const router = express.Router()

// Import data
const importData = catchAsync(async function (
  req: IRequest,
  res: IResponse,
  next: INextFunc,
) {
  try {
    await Promise.all([
      TourModel.create(parseTours),
      ReviewModel.create(parseReviews),
      UserModel.create(parseUsers, { validateBeforeSave: false }),
    ])

    res.status(200).json({
      status: 'Fixture is created successfully',
    })
  } catch (error) {
    console.log('Could not import data because of: ', error)
  }
})

// Delete data
const deleteData = catchAsync(async function (
  req: IRequest,
  res: IResponse,
  next: INextFunc,
) {
  try {
    await Promise.all([
      TourModel.deleteMany(),
      ReviewModel.deleteMany(),
      UserModel.deleteMany(),
    ])

    res.status(204).json({
      status: 'Fixture is deleted successfully',
    })
  } catch (error) {
    console.log('Could not delete data because of: ', error)
  }
})

router.route('/create-fixture').post(importData)
router.route('/delete-fixture').delete(deleteData)

export default router
