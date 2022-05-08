
import { TourModel } from "../models/tour.model";
import { catchAsync } from "../utils/catchAsync";
import Stripe from 'stripe'
import { ICustomRequestExpress, ICustomResponseExpress, ICustomNextFunction } from "../../typing/app.type";


export const getCheckoutSession = catchAsync(async (req: ICustomRequestExpress, res: ICustomResponseExpress, next: ICustomNextFunction) => {

    // 1) Get the currently booked tour
    const tour = await TourModel.findById(req.params.tourId);

    // 2) Create the checkout session
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2020-08-27' });
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get("host")}/`,
        cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour!.slug}`,
        customer_email: req.user!.email,
        client_reference_id: req.params.tourId,
        line_items: [
            {
                name: `${tour!.name} Tour`,
                description: `${tour!.summary}`,
                images: [`${req.protocol}://${req.get("host")}/img/tours/${tour?.imageCover}`],
                amount: tour!.price * 100,
                currency: 'usd',
                quantity: 1
            }
        ]
    })
    // 3) Create session as response
    res.status(200).json({
        status: 'success',
        session
    })
})