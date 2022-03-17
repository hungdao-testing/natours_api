import mongoose, { Model, Schema } from 'mongoose'
import { TourModel } from './tour.model'
import { IUser } from './user.model'

interface IReviewDocument extends mongoose.Document {
  review: String
  rating: number
  createdAt: Date
  tour: String
  user: IUser
}

export interface IReview extends IReviewDocument {}

interface IReviewModel extends Model<IReview> {
  calcAverageRatings: (tour: String) => void
}

const reviewSchema = new mongoose.Schema<IReview, IReviewModel>(
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

reviewSchema.index({ tour: 1, user: 1 }, { unique: true })

reviewSchema.pre(/^find/, async function (next) {
  // this.populate({ path: 'tour', select: 'name' });

  this.populate({
    path: 'user',
    select: 'name photo',
  })
  next()
})

reviewSchema.statics.calcAverageRatings = async function (tourId: string) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ])

  if (stats.length > 0) {
    await TourModel.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    })
  } else {
    await TourModel.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    })
  }
}

reviewSchema.post('save', function () {
  // this points to current review

  ;(this.constructor as IReviewModel).calcAverageRatings(this.tour)
})

reviewSchema.post(/^findOneAnd/, function (doc: IReview) {
  //this.findOne doesnt work here, query has already executed
  ;(doc.constructor as IReviewModel).calcAverageRatings(doc.tour)
})

export const ReviewModel = mongoose.model<IReview>('Review', reviewSchema)
