import { NextFunction, Request, Response } from 'express'
import { Document, Model, Types } from 'mongoose'


export interface IRequest extends Request {
  requestTime?: string | undefined
  user?: IUser
}

export interface IResponse extends Response { }

export interface INextFunc extends NextFunction { }

// =========== APP TYPING =================

export enum UserRoles {
  ADMIN = 'admin',
  GUIDE = 'guide',
  "LEAD-GUIDE" = 'lead-guide',
  USER = 'user',
}


export type TModels = ITour | IReview | IUser | IBooking

export interface IUserDocument extends Document {
  name: string
  email: string
  photo?: string
  password: string
  passwordConfirm: string | undefined
  passwordChangedAt: Date
  role: string
  passwordResetToken: string | undefined
  passwordResetExpires: Date | undefined
  active: boolean
}

export interface IUser extends IUserDocument {
  correctPassword: (password1: string, password2: string) => Promise<boolean>
  changePasswordAfter: (JWTTimestamp: string) => boolean
  createPasswordResetToken: () => string
}



type Location = {
  type: string
  coordinates: number[]
  address: string
  description: string
}
//Ref: https://mongoosejs.com/docs/typescript/schemas.html
export interface ITourDocument extends Document {
  id: number
  name: string
  slug: string
  ratings: number
  ratingsAverage?: number
  ratingsQuantity?: number
  price: number
  duration: number
  maxGroupSize: number
  difficulty: string
  priceDiscount?: number
  summary: string
  description?: string
  imageCover: string
  images: string[]
  createdAt: Date
  startDates: Date[]
  secretTour: boolean
  startLocation: Location
  locations: (Location & { day: number })[]
  guides: (IUser | null)[]
}

export interface ITour extends ITourDocument { }
export interface ITourModel extends Model<ITour> { }


interface IReviewDocument {
  review: String
  rating: number
  createdAt: Date
  tour: String
  user: IUser
}

export interface IReview extends IReviewDocument { }

export interface IReviewModel extends Model<IReview> {
  calcAverageRatings: (tour: String) => void
}


export interface IBookingDocument {
  tour: Types.ObjectId
  user: Types.ObjectId
  price: number
  createdAt: Date
  paid: true
}

export interface IBooking extends IBookingDocument { }

export interface IBookingModel extends Model<IBooking> { }