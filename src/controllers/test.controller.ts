import { INextFunc, IRequest, IResponse } from '@app_type'
import { ReviewModel } from '@models/review.model'
import { TourModel } from '@models/tour.model'
import { UserModel } from '@models/user.model'
import { catchAsync } from '@utils/catchAsync'
import { parseTours, parseUsers } from '@fixture'
import { pinoLogger } from '@utils/logger'

export const importTextFixtureData = catchAsync(async function (
  req: IRequest,
  res: IResponse,
  next: INextFunc,
) {
  try {
    await Promise.all([
      TourModel.create(parseTours),
      UserModel.create(parseUsers, { validateBeforeSave: false }),
    ])

    res.status(200).json({
      status: 'Fixture is created successfully',
    })
  } catch (error) {
    pinoLogger.info('Could not import data because of: ', error)
  }
})

export const deleteTestFixtureData = catchAsync(async function (
  req: IRequest,
  res: IResponse,
  next: INextFunc,
) {
  try {
    await Promise.all([TourModel.deleteMany(), ReviewModel.deleteMany(), UserModel.deleteMany()])

    res.status(204).json({
      status: 'Fixture is deleted successfully',
    })
  } catch (error) {
    pinoLogger.info('Could not delete data because of: ', error)
  }
})
