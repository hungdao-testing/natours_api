import mongoose, { Model, PopulatedDoc, Schema, Types } from 'mongoose'
import { ITour } from './tour.model'
import { IUser } from './user.model'

interface IReviewDocument extends mongoose.Document {
  review: String
  rating: number
  createdAt: Date
  tour: ITour
  user: IUser
}

export interface IReview extends IReviewDocument {}

const reviewSchema = new mongoose.Schema<
  IReviewDocument,
  Model<IReviewDocument>
>(
  {
    review: { type: String, required: [true, 'Review cannot be empty'] },
    rating: { type: Number, min: 1, max: 5 },
    createdAt: { type: Date, default: new Date() },
    tour: {
      type: Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

reviewSchema.pre(/^find/, async function (next) {
  // this.populate({ path: 'tour', select: 'name' });

  this.populate({
    path: 'user',
    select: 'name photo',
  })
  next()
})

export const ReviewModel = mongoose.model<IReviewDocument>(
  'Review',
  reviewSchema,
)
