import express from 'express'
import * as authController from '../controllers/authController'
import * as reviewController from '../controllers/reviewController'

const router = express.Router({ mergeParams: true })

router.use(authController.protect)

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('USER'),
    reviewController.setTourUserIds,
    reviewController.createReview,
  )

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('USER', 'ADMIN'),
    reviewController.updateReview,
  )
  .delete(
    authController.restrictTo('USER', 'ADMIN'),
    reviewController.deleteReview,
  )

export default router
