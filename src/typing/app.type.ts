import { NextFunction, Request, Response } from 'express'
import { IReview } from '../main/models/review.model'
import { ITour } from '../main/models/tour.model'
import { IUser } from '../main/models/user.model'

export interface ICustomRequestExpress extends Request {
  requestTime?: string | undefined
  user?: IUser
}

export interface ICustomResponseExpress extends Response {}

export interface ICustomNextFunction extends NextFunction {}

export type TModels = ITour | IReview | IUser

export enum UserRoles {
  ADMIN = 'admin',
  GUIDE = 'guide',
  LEAD_GUIDE = 'lead-guide',
  USER = 'user',
}
