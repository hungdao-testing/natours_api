import { NextFunction, Request, Response } from 'express'
import { IReview } from '../models/reviewModel'
import { ITour } from '../models/tourModel'
import { IUser } from '../models/userModel'

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
  LEAD_GUIDE = 'lead_guide',
  USER = 'user',
}
