import { TourModel } from '../models/tour.model'
import { BookingModel } from '../models/booking.model'
import { catchAsync } from '../utils/catchAsync'
import Stripe from 'stripe'
import {
    ICustomRequestExpress,
    ICustomResponseExpress,
    ICustomNextFunction,
} from '../../typing/app.type'
import * as factory from './handlerFactory.controller'

export const getCheckoutSession = catchAsync(
    async (
        req: ICustomRequestExpress,
        res: ICustomResponseExpress,
        next: ICustomNextFunction,
    ) => {
        // 1) Get the currently booked tour
        const tour = await TourModel.findById(req.params.tourId)

        // 2) Create the checkout session
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: '2020-08-27',
        })
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId
                }&user=${req.user!.id}&price=${tour!.price}`,
            cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour!.slug}`,
            customer_email: req.user!.email,
            client_reference_id: req.params.tourId,
            line_items: [
                {
                    name: `${tour!.name} Tour`,
                    description: `${tour!.summary}`,
                    images: [
                        `${req.protocol}://${req.get('host')}/img/tours/${tour!.imageCover
                        }`,
                    ],
                    amount: tour!.price * 100,
                    currency: 'usd',
                    quantity: 1,
                },
            ],
        })
        // 3) Create session as response
        res.status(200).json({
            status: 'success',
            session,
        })
    },
)

export const createBookingCheckout = catchAsync(
    async (
        req: ICustomRequestExpress,
        res: ICustomResponseExpress,
        next: ICustomNextFunction,
    ) => {
        // this is only TEMPORARY, because it's UNSECURE: everyone can makes booking without payment
        const { tour, user, price } = req.query
        if (!tour && !user && !price) return next()

        await BookingModel.create({ tour, user, price })

        res.redirect(req.originalUrl.split('?')[0])
    },
)

export const createBooking = factory.createOne(BookingModel)
export const getBooking = factory.getOne(BookingModel)
export const getAllBookings = factory.getAll(BookingModel)
export const updateBooking = factory.updateOne(BookingModel)
export const deleteBooking = factory.deleteOne(BookingModel)
