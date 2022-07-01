import { NextFunction, Request, Response } from 'express'
import { INextFunc, IRequest, IResponse } from '@app_type'
import { BookingModel } from '@models/booking.model'
import { TourModel } from '@models/tour.model'
import { UserModel } from '@models/user.model'
import AppError from '@utils/appError'
import { catchAsync } from '@utils/catchAsync'

export const getOverview = catchAsync(async (req: Request, res: Response) => {
  // 1) Get tour data from collection
  const tours = await TourModel.find()

  // 2) Build template

  // 3) Render that template

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  })
})

export const getTour = catchAsync(async (req: IRequest, res: IResponse, next: NextFunction) => {
  // 1) get the data, for the requested tour (including reviews and tour guide)
  const tour = await TourModel.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    select: 'review rating user',
  })

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404))
  }
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
})

export const getLoginForm = (req: IRequest, res: IResponse) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  })
}
export const getConfirmSignUpForm = catchAsync(async (req: IRequest, res: IResponse) => {
  const user = await UserModel.findOne({ confirmationCode: req.params.confirmationToken })
  res.status(200).render('activation_account', {
    title: 'Confirm Signup',
    firstName: user?.name,
    email: user?.email,
    token: req.params.confirmationToken,
  })
})

export const getAccount = (req: IRequest, res: IResponse) => {
  res.status(200).render('account', {
    title: 'Your account',
  })
}

export const updateUserData = catchAsync(async (req: IRequest, res: IResponse) => {
  const updatedUser = await UserModel.findByIdAndUpdate(
    req.user!.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  )

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  })
})

export const getMyTours = catchAsync(async (req: IRequest, res: IResponse) => {
  //1) Find all bookings,
  const bookings = await BookingModel.find({ user: req.user?.id })

  //2) Find tours with the returned IDs
  const tourIds = bookings.map((el) => el.tour)
  const tours = await TourModel.find({ _id: { $in: tourIds } })

  res.status(200).render('overview', {
    title: 'My tours',
    tours,
  })
})

export const alerts = (req: IRequest, res: IResponse, next: INextFunc) => {
  const { alert } = req.query
  if (alert === 'booking')
    res.locals.alert =
      "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediately, please come back later"

  next()
}
