import { updateTourService } from '@tests/adapter/tour.service'
import { testPW, expect, tourPayloadBuilder } from '@tests/helpers/testHelper'

testPW.describe.parallel('Update tour', () => {
  testPW.describe('As an authorized user', () => {
    let token: string
    let tourId: string
    const payload = tourPayloadBuilder()

    testPW.beforeEach(async ({ authenBy, createTourPWFixture }) => {
      token = await authenBy('ADMIN')
      const createdTour = await createTourPWFixture(token, payload)
      tourId = createdTour.data._id
    })

    testPW.afterEach(async ({ deleteTourPWFixture }) => {
      await deleteTourPWFixture(token, tourId)
    })

    testPW(`I could update tour`, async ({ request }) => {
      const updatedTour = await updateTourService(request, { tourId, token, payload })

      expect(updatedTour.statusCode).toBe(200)
      expect(updatedTour.body.status).toBe('success')
      expect(updatedTour.body.tours.name).toBe(payload.name)
      expect(updatedTour.body.tours.price).toBe(payload.price)
      expect(updatedTour.body.tours.priceDiscount).toBe(payload.priceDiscount)
      expect(updatedTour.body.tours.ratings).toBe(payload.ratings)
      expect(updatedTour.body.tours.maxGroupSize).toBe(payload.maxGroupSize)
    })
  })
})
