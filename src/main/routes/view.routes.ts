import express from 'express'
import * as viewsController from '../controllers/view.controller'
import * as authController from '../controllers/auth.controller';

const router = express.Router()

router.get('/', viewsController.getOverview)
router.get('/tour/:slug', viewsController.getTour)
router.get('/login', viewsController.getLoginForm);
// router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);

export default router
