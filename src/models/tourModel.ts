import mongoose from 'mongoose';
import { runInThisContext } from 'vm';

//Ref: https://mongoosejs.com/docs/typescript/schemas.html
export interface Tour extends mongoose.Document {
    id: number;
    name: string;
    ratings: number;
    ratingsAverage?: number,
    ratingsQuantity?: number,
    price: number;
    duration: number;
    maxGroupSize: number;
    difficulty: string;
    priceDiscount?: number,
    summary: string,
    description?: string,
    imageCover: string,
    images: string[],
    createdAt: Date,
    startDates: Date[],
}

const tourSchema = new mongoose.Schema<Tour>({
    id: Number,
    name: {
        type: String,
        required: [true, 'A tour must have name'],
        unique: true,
        trim: true
    },
    price: { type: Number, required: [true, 'A tour must have price'] },
    ratings: { type: Number, default: 4.5 },
    duration: { type: Number, required: [true, 'A tour must have a duration'] },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have max group size']
    },
    difficulty: { type: String, required: [true, 'A tour must have difficulty'] },
    ratingsAverage: { type: Number, default: 4.5 },
    ratingsQuantity: { type: Number, default: 0 },
    priceDiscount: { type: Number },
    summary: { type: String, trim: true, required: [true, 'A tour must have summary'] },
    description: { type: String, trim: true, },
    imageCover: { type: String, required: [true, 'A tour must have image cover'] },
    images: [String],
    createdAt: { type: Date, default: new Date(), select: false }, // "select: false" means not expose (Lecture 98)
    startDates: { type: [Date] }

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }

});

tourSchema.virtual('durationWeeks').get(function (this: Tour) { // have to declare the type for `this`
    return this.duration / 7;
})

export const TourModel = mongoose.model<Tour>('Tour', tourSchema);
