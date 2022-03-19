import express from 'express'
import * as tourController from '../controllers/tour.controllers'
import * as authController from '../controllers/auth.controller'
import reviewRouter from './review.routes'

const router = express.Router()

router.use('/:tourId/reviews', reviewRouter)

// router.param('id', tourController.checkID);

// modify the request query on `aliasTopTour` (role as middleware) then pass into `getAllTours`
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTour, tourController.getAllTours)

router.route('/tour-stats').get(tourController.getTourStats)

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('ADMIN', 'LEAD_GUIDE', 'GUIDE'),
    tourController.getMonthlyPlan,
  )

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin)

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances)

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('ADMIN', 'LEAD_GUIDE'),
    tourController.createTour,
  )

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('ADMIN', 'LEAD_GUIDE'),
    tourController.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo('ADMIN', 'LEAD_GUIDE'),
    tourController.deleteTour,
  )

export default router
