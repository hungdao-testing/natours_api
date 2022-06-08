import { TourModel } from '@models/tour.model'
import { BookingModel } from '@models/booking.model'
import { catchAsync } from '@utils/catchAsync'
import Stripe from 'stripe'
import {
  IRequest,
  IResponse,
  INextFunc,
} from '../typing/app.type'
import * as factory from './handlerFactory.controller'
import { UserModel } from '@models/user.model'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2020-08-27',
})

export const getCheckoutSession = catchAsync(
  async (
    req: IRequest,
    res: IResponse,
    next: INextFunc,
  ) => {
    // 1) Get the currently booked tour
    const tour = await TourModel.findById(req.params.tourId)

    // 2) Create the checkout session

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      success_url: `${req.protocol}://${req.get('host')}/my-tours?alert=booking`,
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

export const createBookingCheckout = async (session: Stripe.Checkout.Session) => {
  const tour = session.client_reference_id;
  const user = (await UserModel.findOne({ email: session.customer_email }))?._id;
  const price = session.amount_total! / 100
  await BookingModel.create({ tour, user, price })
}

export const webhokCheckout = catchAsync(
  async (
    req: IRequest,
    res: IResponse,
    next: INextFunc,
  ) => {
    const signature = req.headers['stripe-signature']
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature!,
        process.env.STRIPE_WEBHOOK_SECRET!,
      )
    } catch (error) {
      return res.status(400).send(`Webhook error: ${(error as Error).message}`)
    }

    if (event.type === 'checkout.session.completed') {
      createBookingCheckout(event.data.object as Stripe.Checkout.Session)
    }

    res.status(200).json({ received: true })
  },
)

export const createBooking = factory.createOne(BookingModel)
export const getBooking = factory.getOne(BookingModel)
export const getAllBookings = factory.getAll(BookingModel)
export const updateBooking = factory.updateOne(BookingModel)
export const deleteBooking = factory.deleteOne(BookingModel)
