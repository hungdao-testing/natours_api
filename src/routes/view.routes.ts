import express from 'express'
import * as viewsController from '@controllers/view.controller'
import * as authController from '@controllers/auth.controller'

const router = express.Router()

router.use(viewsController.alerts)

router.use(authController.isLoggedIn)

router.get('/', authController.isLoggedIn, viewsController.getOverview)
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour)
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm)
router.get('/confirm-signup/:confirmationToken', viewsController.getConfirmSignUpForm)
router.get('/me', authController.protect, viewsController.getAccount)
router.get('/my-tours', authController.protect, viewsController.getMyTours)

router.post('/submit-user-data', authController.protect, viewsController.updateUserData)

export default router
