import { Request } from 'express'
import { IUser } from '../models/userModel'

export interface ICustomRequestExpress extends Request {
  requestTime?: string | undefined
  user?: IUser
}

export enum UserRoles {
  ADMIN = 'admin',
  GUIDE = 'guide',
  LEAD_GUIDE = 'lead_guide',
  USER = 'user',
}
