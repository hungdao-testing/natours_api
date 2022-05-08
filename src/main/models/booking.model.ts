import mongoose, { Model, Schema } from 'mongoose'

interface IBookingDocument extends mongoose.Document {
    tour: string
    user: string
    price: number
    createdAt: Date
    paid: true
}

export interface IBooking extends IBookingDocument { }

interface IBookingModel extends Model<IBooking> { }

const bookingSchema = new mongoose.Schema<IBooking, IBookingModel>({
    tour: {
        type: Schema.Types.ObjectId,
        ref: 'Tour',
        required: [true, 'Booking must belong to a tour.'],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Booking must belong to a user.'],
    },
    price: {
        type: Number,
        required: [true, 'Booking must have a price'],
    },
    createdAt: { type: Date, default: new Date() },
    paid: {
        type: Boolean,
        default: true,
    },
})

bookingSchema.pre(/^find/, function (next) {
    this.populate([{
        path: 'user',
        select: '-passwordChangedAt -role'
    },
    {
        path: 'tour',
        select: 'name',
    }
    ]);

    next()
})

export const BookingModel = mongoose.model<IBooking>('Booking', bookingSchema)
