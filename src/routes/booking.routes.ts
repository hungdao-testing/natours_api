import express from 'express'
import * as authController from '@controllers/auth.controller'
import * as bookingController from '@controllers/booking.controller'

const router = express.Router()
router.use(authController.protect)

router.get('/checkout-session/:tourId', bookingController.getCheckoutSession)

router.use(authController.restrictTo('ADMIN', 'LEAD_GUIDE'))

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking)

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking)

export default router
