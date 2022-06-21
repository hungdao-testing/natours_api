import { faker } from '@faker-js/faker'
import { deleteTourService, getTourService } from '@tests/adapter/tour.service'
import { testPW, expect } from '@tests/helpers/testHelper'
import { getTourPayloadAsset } from '@tests/utils/fileManagement'

const tourPayloadAsset = getTourPayloadAsset()

testPW.describe.parallel('Delete tour', () => {
  let token: string
  let payload = { ...tourPayloadAsset }
  let tourId: string
  let tourName: string

  testPW.describe('An existing tour', () => {
    testPW.beforeAll(async ({ authenBy }) => {
      tourName = 'TEST-DELETE' + faker.commerce.productName()
      token = await authenBy('ADMIN')
    })

    testPW.beforeEach(async ({ createTourPWFixture }) => {
      payload['name'] = tourName
      const createdTour = await createTourPWFixture(token, payload)
      tourId = createdTour.data._id
    })

    testPW(`Could delete an existing tour`, async ({ request }) => {
      let deletedTour = await deleteTourService(request, { tourId, token })
      expect(deletedTour.statusCode).toBe(204)

      const getTourReq = await getTourService(request, tourId)
      expect(getTourReq.statusCode).toBe(404)
    })
  })
})
