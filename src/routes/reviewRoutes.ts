import express from 'express'
import * as authController from '../controllers/authController'
import * as reviewController from '../controllers/reviewController'

const router = express.Router({ mergeParams: true })

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('USER'),
    reviewController.setTourUserIds,
    reviewController.createReview,
  )

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview)

export default router
