import { NextFunction, Request, Response } from 'express'
import { IBooking } from '@models/booking.model'
import { IReview } from '@models/review.model'
import { ITour } from '@models/tour.model'
import { IUser } from '@models/user.model'

export interface ICustomRequestExpress extends Request {
  requestTime?: string | undefined
  user?: IUser
}

export interface ICustomResponseExpress extends Response {}

export interface ICustomNextFunction extends NextFunction {}

export type TModels = ITour | IReview | IUser | IBooking

export { UserRoles } from '@models/user.model'
