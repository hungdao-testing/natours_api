import { createTourService } from '@tests/adapter/tour.service'
import { getTourPayloadAsset } from '@tests/utils/fileManagement'
import { testPW, expect } from '@tests/helpers/testHelper'

const tourPayloadAsset = getTourPayloadAsset()

testPW.describe.parallel('Create a tour', () => {
  testPW(`I could not create a tour if missing tour name`, async ({ authenBy, request }) => {
    const { name, ...missingTourNamePayload } = tourPayloadAsset
    const authToken = await authenBy('ADMIN')

    const createdTour = await createTourService(request, {
      token: authToken,
      payload: missingTourNamePayload,
    })
    expect(createdTour.statusCode).toBe(500)
    expect(createdTour.body.status).toBe('error')
    expect(createdTour.body.message).toContain('A tour must have name')
  })

  testPW(
    `I could not create a tour with if ratings average is out of range [1.0 - 5.0]`,
    async ({ authenBy, request }) => {
      const authToken = await authenBy('ADMIN')
      let newPayload = { ...tourPayloadAsset }
      newPayload['ratingsAverage'] = 0.9

      let createdTour = await createTourService(request, {
        token: authToken,
        payload: newPayload,
      })
      expect(createdTour.statusCode).toBe(500)
      expect(createdTour.body.status).toBe('error')
      expect(createdTour.body.message).toContain('rating must be above 1.0')

      newPayload['ratingsAverage'] = 5.1

      createdTour = await createTourService(request, {
        token: authToken,
        payload: newPayload,
      })
      expect(createdTour.statusCode).toBe(500)
      expect(createdTour.body.status).toBe('error')
      expect(createdTour.body.message).toContain('rating must be below 5.0')
    },
  )
  testPW(
    `I could not create a tour with if discount price is greater than regular price`,
    async ({ authenBy, request }) => {
      const authToken = await authenBy('ADMIN')

      let newPayload = { ...tourPayloadAsset }
      newPayload['priceDiscount'] = tourPayloadAsset['price'] + 1

      let createdTour = await createTourService(request, {
        token: authToken,
        payload: newPayload,
      })
      expect(createdTour.statusCode).toBe(500)
      expect(createdTour.body.status).toBe('error')
      expect(createdTour.body.message).toContain(
        `discount price (${newPayload['priceDiscount']}) should be less than regular price`,
      )
    },
  )

  testPW(
    `I could not create a tour with if difficult level is not in the supported list`,
    async ({ authenBy, request }) => {
      const authToken = await authenBy('ADMIN')

      let newPayload = { ...tourPayloadAsset }
      newPayload['difficulty'] = 'hard'

      let createdTour = await createTourService(request, {
        token: authToken,
        payload: newPayload,
      })
      expect(createdTour.statusCode).toBe(500)
      expect(createdTour.body.status).toBe('error')
      expect(createdTour.body.message).toContain(`Difficulty is either easy, medium or difficult`)
    },
  )

  testPW(`I could not create a tour with if missing image cover`, async ({ authenBy, request }) => {
    const { imageCover, ...missingImageCoverPayload } = tourPayloadAsset
    const authToken = await authenBy('ADMIN')

    const createdTour = await createTourService(request, {
      token: authToken,
      payload: missingImageCoverPayload,
    })
    expect(createdTour.statusCode).toBe(500)
    expect(createdTour.body.status).toBe('error')
    expect(createdTour.body.message).toContain('A tour must have image cover')
  })

  testPW(`I could not create a tour with if missing summary`, async ({ authenBy, request }) => {
    const { summary, ...missingSummaryPayload } = tourPayloadAsset
    const authToken = await authenBy('ADMIN')

    const createdTour = await createTourService(request, {
      token: authToken,
      payload: missingSummaryPayload,
    })
    expect(createdTour.statusCode).toBe(500)
    expect(createdTour.body.status).toBe('error')
    expect(createdTour.body.message).toContain('A tour must have summary')
  })

  testPW(
    `I could not create a tour with if my role is regular user`,
    async ({ authenBy, request }) => {
      const authToken = await authenBy('USER')

      const createdTour = await createTourService(request, {
        token: authToken,
        payload: tourPayloadAsset,
      })
      expect(createdTour.statusCode).toBe(403)
      expect(createdTour.body.status).toBe('fail')
    },
  )
  testPW(
    `I could not create a tour with if my role is guide user`,
    async ({ authenBy, request }) => {
      const authToken = await authenBy('GUIDE')

      const createdTour = await createTourService(request, {
        token: authToken,
        payload: tourPayloadAsset,
      })
      expect(createdTour.statusCode).toBe(403)
      expect(createdTour.body.status).toBe('fail')
    },
  )
})
