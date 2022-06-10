import express from 'express'
import * as testController from '@controllers/test.controller'

const router = express.Router()

router.route('/create-fixture').post(testController.importTextFixtureData)
router.route('/delete-fixture').delete(testController.deleteTestFixtureData)

export default router
