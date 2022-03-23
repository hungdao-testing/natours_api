import mongoose, { Aggregate, Model } from 'mongoose'
import slugify from 'slugify'
import { IUser } from './user.model'

type Location = {
  type: string
  coordinates: number[]
  address: string
  description: string
}
//Ref: https://mongoosejs.com/docs/typescript/schemas.html
interface ITourDocument extends mongoose.Document {
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

export interface ITour extends ITourDocument {}

const tourSchema = new mongoose.Schema<ITour, Model<ITour>, undefined, {}>(
  {
    id: Number,
    name: {
      type: String,
      required: [true, 'A tour must have name'],
      unique: true,
      trim: true,
      maxlength: [40, 'Tour name must have less or equal than 40 chars'],
      minlength: [10, 'Tour name must have more or equal than 10 chars'],
      // validate: [validator.isAlpha, 'Tour name must contain only chars'] // declare function
    },
    slug: String,
    price: { type: Number, required: [true, 'A tour must have price'] },
    ratings: { type: Number, default: 4.5 },
    duration: { type: Number, required: [true, 'A tour must have a duration'] },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have max group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1.0, 'rating must be above 1.0'],
      max: [5.0, 'rating must be below 5.0'],
      set: (val: number) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: { type: Number, default: 0 },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (this: ITour, val: number) {
          // `this` points current doc to NEW document on creation flow
          return val < this.price
        },
        message: 'discount price ({VALUE}) should be less than regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have summary'],
    },
    description: { type: String, trim: true },
    imageCover: {
      type: String,
      required: [true, 'A tour must have image cover'],
    },
    images: [String],
    createdAt: { type: Date, default: new Date(), select: false }, // "select: false" means not expose (Lecture 98)
    startDates: { type: [Date] },
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 })

tourSchema.index({ slug: 1 })

tourSchema.index({ startLocation: '2dsphere' })

tourSchema.virtual('durationWeeks').get(function (this: ITour) {
  // have to declare the type for `this`
  return this.duration / 7
})

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
})

//Document middleware: runs before .save() and .create()
// `save` is a hook
tourSchema.pre('save', function (next) {
  // console.log(this); // this -> currently being saved document
  this.slug = slugify(this.name, { lower: true })
  next()
})

// Query Middleware -> this: current query object
// To apply the middleware functions to all sorts of `find` (e.g find, findOne,...) => using regex

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-passwordChangedAt -__v',
  })
  next()
})

tourSchema.pre(/^find/, { query: true }, function (next) {
  this.find({ secretTour: { $ne: true } })
  next()
})

tourSchema.post(/^find/, { query: true }, function (docs, next) {
  // console.log(docs);
  next()
})

//Aggregation Middleware
// tourSchema.pre<Aggregate<ITour>>('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
//   console.log(this.pipeline())
//   next()
// })

export const TourModel = mongoose.model<ITour>('Tour', tourSchema)
