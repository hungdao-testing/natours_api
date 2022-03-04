import express from 'express'
import * as authController from '../controllers/authController'
import * as reviewController from '../controllers/reviewController'


const router = express.Router()

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo("USER"),
    reviewController.createReview,
  )

export default router
