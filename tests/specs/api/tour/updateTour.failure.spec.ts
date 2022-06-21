import { updateTourService } from '@tests/adapter/tour.service'
import { testPW, expect, tourPayloadBuilder } from '@tests/helpers/testHelper'

testPW.describe('Update tour', () => {
  const tourPayloadAsset = tourPayloadBuilder()
  let token: string = ''

  testPW.describe('could not update existing tour, because ', () => {
    let tourId: string
    const payload = { ...tourPayloadAsset }
    testPW.beforeAll(async ({ createTourPWFixture, authenBy }) => {
      token = await authenBy('LEAD-GUIDE')
      const createdTour = await createTourPWFixture(token)
      tourId = createdTour.data._id
    })

    testPW.afterAll(async ({ deleteTourPWFixture }) => {
      if (tourId && tourId.length > 0) await deleteTourPWFixture(token, tourId)
    })

    testPW(`The price discount is greater than the regular one`, async ({ request }) => {
      payload['price'] = 2001
      payload['priceDiscount'] = 5000

      const updatedTour = await updateTourService(request, { tourId, token, payload })

      expect(updatedTour.statusCode).toBe(500)
      expect(updatedTour.body.status).toBe('error')
      expect(updatedTour.body.message).toContain(
        `discount price (${payload['priceDiscount']}) should be less than regular price`,
      )
    })

    testPW(`The difficult level is not in the supported list`, async ({ request }) => {
      payload['difficulty'] = 'hard'
      const updatedTour = await updateTourService(request, { tourId, token, payload })
      expect(updatedTour.statusCode).toBe(500)
      expect(updatedTour.body.status).toBe('error')
      expect(updatedTour.body.message).toContain(`ifficulty is either easy, medium or difficult`)
    })

    testPW(`Ratings average is < 1.0`, async ({ request }) => {
      payload['ratingsAverage'] = 0.9

      const updatedTour = await updateTourService(request, { tourId, token, payload })
      expect(updatedTour.statusCode).toBe(500)
      expect(updatedTour.body.status).toBe('error')
      expect(updatedTour.body.message).toContain('rating must be above 1.0')
    })

    testPW(`Ratings average is > 5.0`, async ({ request }) => {
      payload['ratingsAverage'] = 5.1

      const updatedTour = await updateTourService(request, { tourId, token, payload })
      expect(updatedTour.statusCode).toBe(500)
      expect(updatedTour.body.status).toBe('error')
      expect(updatedTour.body.message).toContain('rating must be below 5.0')
    })
  })

  testPW(`Could not update for a non-existing tour`, async ({ authenBy, request }) => {
    tourPayloadAsset['ratingsAverage'] = 1.0
    const nonExistingTourId = '5c88fa8cf4afda39709c296d'
    token = await authenBy('ADMIN')

    let updatedTour = await updateTourService(request, {
      tourId: nonExistingTourId,
      token,
      payload: tourPayloadAsset,
    })
    expect(updatedTour.statusCode).toBe(404)
    expect(updatedTour.body.status).toBe('fail')
    expect(updatedTour.body.message).toContain('No tours found with the passing ID')
  })
})
