import express from 'express'
import * as userController from '@controllers/user.controllers'
import * as authController from '@controllers/auth.controller'

const router = express.Router()

router.post('/signup', authController.signup)

router.get('/active/:confirmationCode', authController.confirmSignup)

router.post('/login', authController.login)

router.get('/logout', authController.logout)

router.post('/forgotPassword', authController.forgotPassword)

router.patch('/resetPassword/:token', authController.resetPassword) // edit password => using PATCH or PUT, but edit just a portion of User data => PATCH

// all routes below this line will be applied `protect`
router.use(authController.protect)

router.patch('/updateMyPassword', authController.updatePassword)

router.get('/me', userController.getMe, userController.getUser)

router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe,
)

router.delete('/deleteMe', userController.deleteMe)

router.use(authController.restrictTo('ADMIN'))

router.route('/').get(userController.getAllUsers).post(userController.createUser)
router.patch('/promoteUserTo/:userId', userController.promoteUserTo)
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)

export default router
