import { getToursService, updateTourService } from '@tests/adapter/tour.service'
import { testPW, expect } from '@tests/helpers/testHelper'
import { getTourPayloadAsset } from '@tests/utils/fileManagement'
import { faker } from '@faker-js/faker'

const tourPayloadAsset = getTourPayloadAsset()

testPW.describe.parallel('Update tour', () => {
  testPW.describe('Update successfully for an existing tour', () => {
    let token: string
    let payload = { ...tourPayloadAsset }
    let tourId: string

    testPW.beforeAll(async ({ authenBy }) => {
      token = await authenBy('ADMIN')
    })

    testPW.beforeEach(async ({ createTourPWFixture }, testInfo) => {
      payload['name'] = `[TEST-${testInfo.workerIndex}] Amazing Tour`
      const createdTour = await createTourPWFixture(token, payload)
      tourId = createdTour.data._id
    })

    testPW.afterEach(async ({ deleteTourPWFixture }) => {
      await deleteTourPWFixture(token, tourId)
    })

    testPW(
      `As an admin, I could update a price, price discount, ratings for a tour`,
      async ({ request }) => {
        payload['price'] = 2001
        payload['priceDiscount'] = 1500
        payload['ratings'] = 4.1
        const updatedTour = await updateTourService(request, { tourId, token, payload })
        expect(updatedTour.statusCode).toBe(200)
        expect(updatedTour.body.status).toBe('success')
        expect(updatedTour.body.tours.name).toBe(payload.name)
        expect(updatedTour.body.tours.price).toBe(2001)
        expect(updatedTour.body.tours.priceDiscount).toBe(1500)
        expect(updatedTour.body.tours.ratings).toBe(4.1)
      },
    )
  })

  testPW.describe('Update unsuccessfully for an existing tour', () => {
    let token: string
    let payload = { ...tourPayloadAsset }
    let tourId: string

    testPW.beforeAll(async ({ createTourPWFixture, authenBy }) => {
      token = await authenBy('LEAD-GUIDE')
      payload['name'] = 'TEST-TOUR-' + faker.name.jobTitle()
      const createdTour = await createTourPWFixture(token, payload)
      tourId = createdTour.data._id
    })

    testPW.afterAll(async ({ deleteTourPWFixture }) => {
      await deleteTourPWFixture(token, tourId)
    })

    testPW(
      `As an admin, I could not update tour because the price discount is greater than the regular one`,
      async ({ request }) => {
        payload['price'] = 2001
        payload['priceDiscount'] = 5000
        const updatedTour = await updateTourService(request, { tourId, token, payload })
        expect(updatedTour.statusCode).toBe(500)
        expect(updatedTour.body.status).toBe('error')
        expect(updatedTour.body.message).toContain(
          `discount price (${payload['priceDiscount']}) should be less than regular price`,
        )
      },
    )

    testPW(
      `As a lead guide, I could not update tour because the difficult level is not in the supported list`,
      async ({ request }) => {
        payload['difficulty'] = 'hard'
        const updatedTour = await updateTourService(request, { tourId, token, payload })
        expect(updatedTour.statusCode).toBe(500)
        expect(updatedTour.body.status).toBe('error')
        expect(updatedTour.body.message).toContain(`ifficulty is either easy, medium or difficult`)
      },
    )

    testPW(
      `As a lead guide, I could not update a tour with if ratings average is out of range [1.0 - 5.0]`,
      async ({ request }) => {
        payload['ratingsAverage'] = 0.9

        let updatedTour = await updateTourService(request, { tourId, token, payload })
        expect(updatedTour.statusCode).toBe(500)
        expect(updatedTour.body.status).toBe('error')
        expect(updatedTour.body.message).toContain('rating must be above 1.0')

        payload['ratingsAverage'] = 5.1

        updatedTour = await updateTourService(request, { tourId, token, payload })
        expect(updatedTour.statusCode).toBe(500)
        expect(updatedTour.body.status).toBe('error')
        expect(updatedTour.body.message).toContain('rating must be below 5.0')
      },
    )
  })

  testPW.describe('Permission', () => {
    let token: string
    let payload = { ...tourPayloadAsset }
    let tourId: string

    testPW.beforeAll(async ({ request }) => {
      const tours = await getToursService(request)
      tourId = tours.body.tours[0]._id
    })

    testPW(
      `As a guide, I could not delete tour because of my permisson`,
      async ({ authenBy, request }) => {
        token = await authenBy('GUIDE')
        payload['price'] = 2001

        const updateTourReq = await updateTourService(request, { tourId, token, payload })
        expect(updateTourReq.statusCode).toBe(403)
        expect(updateTourReq.body.status).toBe('fail')
        expect(updateTourReq.body.message).toContain(
          `You do not have permission to perform this action`,
        )
      },
    )

    testPW(
      `As a end-user, I could not delete tour because of my permisson`,
      async ({ authenBy, request }) => {
        token = await authenBy('USER')
        payload['price'] = 2001

        const deletedTourReq = await updateTourService(request, { tourId, token, payload })
        expect(deletedTourReq.statusCode).toBe(403)
        expect(deletedTourReq.body.status).toBe('fail')
        expect(deletedTourReq.body.message).toContain(
          `You do not have permission to perform this action`,
        )
      },
    )
  })

  testPW.describe('Update unsuccessfully for a non-existing tour', () => {
    let token: string
    let payload = { ...tourPayloadAsset }
    let tourId: string

    testPW.beforeAll(async ({ deleteTourPWFixture, createTourPWFixture, authenBy }) => {
      token = await authenBy('ADMIN')
      payload['name'] = 'TEST-TOUR-' + faker.name.jobTitle()
      const createdTour = await createTourPWFixture(token, payload)
      tourId = createdTour.data._id

      await deleteTourPWFixture(token, tourId)
    })

    testPW(
      `As an admin, I could not update information for a deleted tour`,
      async ({ request }) => {
        payload['ratingsAverage'] = 1.0

        let updatedTour = await updateTourService(request, { tourId, token, payload })
        expect(updatedTour.statusCode).toBe(404)
        expect(updatedTour.body.status).toBe('fail')
        expect(updatedTour.body.message).toContain('No tours found with the passing ID')
      },
    )
  })
})
