import axios from 'axios'

import { showAlert } from './alerts'

// const port = getPort()

// const stripe = new Stripe(process.env.STRIPE_PUBLIC_KEY)

export const bookTour = async (tourId: string) => {
  try {
    // 1) get the checkout-session from api
    const session = await axios({
      url: `/api/v1/bookings/checkout-session/${tourId}`,
    })

    // 2) create checkout form + charge credit card
    // await stripe.redirectToCheckout({
    //   sessionId: session.data.session.id,
    // })

    // how to fix issue `stripe is not redirected` https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15087376#questions/17025238

    window.location.replace(session.data.session.url)
  } catch (error) {
    showAlert('Error: ', (error as Error).message)
  }
}
