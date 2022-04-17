import express from 'express'
import * as viewsController from '../controllers/view.controller'
import * as authController from '../controllers/auth.controller';

const router = express.Router()

router.use(authController.isLoggedIn);

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.post(
    '/submit-user-data',
    authController.protect,
    viewsController.updateUserData
);

export default router
