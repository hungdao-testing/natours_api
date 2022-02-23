import express from 'express';
import * as tourController from '../controllers/tourControllers';
import * as authController from '../controllers/authController';


const router = express.Router();

// router.param('id', tourController.checkID);

// modify the request query on `aliasTopTour` (role as middleware) then pass into `getAllTours`
router
    .route('/top-5-cheap')
    .get(tourController.aliasTopTour, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
    .route('/')
    .get(authController.protect ,tourController.getAllTours)
    .post(tourController.createTour);

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

export default router;
