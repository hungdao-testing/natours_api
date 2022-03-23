import { parseTours, parseUsers, parseReviews } from './parseFile'
import { TourModel } from '../../main/models/tour.model'
import { ReviewModel } from '../../main/models/review.model'
import { UserModel } from '../../main/models/user.model'
import express from 'express'
import { catchAsync } from '../../main/utils/catchAsync'
import {
  ICustomNextFunction,
  ICustomRequestExpress,
  ICustomResponseExpress,
} from '../../typing/app.type'

const router = express.Router()

// Import data
const importData = catchAsync(async function (
  req: ICustomRequestExpress,
  res: ICustomResponseExpress,
  next: ICustomNextFunction,
) {
  try {
    await Promise.all([
      TourModel.create(parseTours),
      ReviewModel.create(parseReviews),
      UserModel.create(parseUsers, { validateBeforeSave: false }),
    ])
    console.log('Data is successfully loaded!!!')
    res.status(200).json({
      status: 'Fixture is created successfully',
    })
  } catch (error) {
    console.log('Could not import data because of: ', error)
  }
})

// Delete data
const deleteData = catchAsync(async function (
  req: ICustomRequestExpress,
  res: ICustomResponseExpress,
  next: ICustomNextFunction,
) {
  try {
    await Promise.all([
      TourModel.deleteMany(),
      ReviewModel.deleteMany(),
      UserModel.deleteMany(),
    ])
    console.log('Data is successfully deleted!!!')
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
