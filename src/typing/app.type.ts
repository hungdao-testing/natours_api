import { NextFunction, Request, Response } from 'express'
import { IUser } from '../models/userModel'

export interface ICustomRequestExpress extends Request {
  requestTime?: string | undefined
  user?: IUser
}

export interface ICustomResponseExpress extends Response {}

export interface ICustomNextFunction extends NextFunction {}

export enum UserRoles {
  ADMIN = 'admin',
  GUIDE = 'guide',
  LEAD_GUIDE = 'lead_guide',
  USER = 'user',
}
