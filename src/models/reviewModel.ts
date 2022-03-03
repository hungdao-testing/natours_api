import mongoose from 'mongoose'
import { ITour } from './tourModel'
import { IUser } from './userModel'

interface IReviewDocument extends mongoose.Document {
  review: String
  rating: number
  createdAt: Date
  tour: ITour
  user: IUser
}

export interface IReview extends IReviewDocument {}

const reviewSchema = new mongoose.Schema<IReviewDocument>(
  {
    review: { type: String, required: [true, 'Review cannot be empty'] },
    rating: { type: Number, min: 1, max: 5 },
    createdAt: { type: Date, default: new Date() },
    tour: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

export const ReviewModel = mongoose.model<IReviewDocument>(
  'Review',
  reviewSchema,
)
