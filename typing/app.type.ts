import { NextFunction, Request, Response } from 'express'
import { IBooking } from '@models/booking.model'
import { IReview } from '@models/review.model'
import { ITour } from '@models/tour.model'
import { IUser } from '@models/user.model'

export enum UserRoles {
  ADMIN = 'admin',
  GUIDE = 'guide',
  LEAD_GUIDE = 'lead-guide',
  USER = 'user',
}
export interface IRequest extends Request {
  requestTime?: string | undefined
  user?: IUser
}

export interface IResponse extends Response { }

export interface INextFunc extends NextFunction { }

export type TModels = ITour | IReview | IUser | IBooking




