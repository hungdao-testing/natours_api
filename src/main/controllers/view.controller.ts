import {
  ICustomRequestExpress,
  ICustomResponseExpress,
  ICustomNextFunction,
} from '../../typing/app.type'
import { TourModel } from '../models/tour.model'
import { catchAsync } from '../utils/catchAsync'

export const getOverview = catchAsync(async (
  req: ICustomRequestExpress,
  res: ICustomResponseExpress,
) => {
  // 1) Get tour data from collection
  const tours = await TourModel.find()

  // 2) Build template

  // 3) Render that template


  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  })
})

export const getTour = (
  req: ICustomRequestExpress,
  res: ICustomResponseExpress,
) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
  })
}
