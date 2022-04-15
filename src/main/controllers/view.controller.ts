import {
  ICustomRequestExpress,
  ICustomResponseExpress,
  ICustomNextFunction,
} from '../../typing/app.type'
import { TourModel } from '../models/tour.model'
import { catchAsync } from '../utils/catchAsync'

export const getOverview = catchAsync(
  async (req: ICustomRequestExpress, res: ICustomResponseExpress) => {
    // 1) Get tour data from collection
    const tours = await TourModel.find()

    // 2) Build template

    // 3) Render that template

    res.status(200).render('overview', {
      title: 'All Tours',
      tours,
    })
  },
)

export const getTour = catchAsync(
  async (req: ICustomRequestExpress, res: ICustomResponseExpress) => {
    // 1) get the data, for the requested tour (including reviews and tour guide)
    const tour = await TourModel.findOne({ slug: req.params.slug }).populate({
      path: 'reviews',
      fields: 'review rating user',
    })

    //2 ) Build template

    // 3) render template
    res
      .status(200)
      // .set(
      //   'Content-Security-Policy',
      //   'script-src 'self' http://xxxx 'unsafe-inline' 'unsafe-eval';',
      // )
      .render('tour', {
        title: `${tour!.name} Tour`,
        tour,
      })
  },
)
