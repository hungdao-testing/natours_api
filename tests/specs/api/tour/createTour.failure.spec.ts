import { createTourService } from '@tests/adapter/tour.service'
import { testPW, expect, tourPayloadBuilder } from '@tests/helpers/testHelper'

testPW.describe('Create a tour', () => {
  let authToken: string
  const tourPayloadAsset = tourPayloadBuilder()

  testPW.beforeAll(async ({ authenBy }) => {
    authToken = await authenBy('ADMIN')
  })

  testPW(`I could not create a tour if missing tour name`, async ({ request }) => {
    const { name, ...missingTourNamePayload } = tourPayloadAsset

    const createdTour = await createTourService(request, {
      token: authToken,
      payload: missingTourNamePayload,
    })
    expect(createdTour.statusCode).toBe(500)
    expect(createdTour.body.status).toBe('error')
    expect(createdTour.body.message).toContain('A tour must have name')
  })

  testPW(
    `I could not create a tour with if ratings average is less than 1.0`,
    async ({ request }) => {
      let newPayload = { ...tourPayloadAsset }
      newPayload['ratingsAverage'] = 0.9

      const createdTour = await createTourService(request, {
        token: authToken,
        payload: newPayload,
      })
      expect(createdTour.statusCode).toBe(500)
      expect(createdTour.body.status).toBe('error')
      expect(createdTour.body.message).toContain('rating must be above 1.0')
    },
  )

  testPW(
    `I could not create a tour with if ratings average is greater than 5.0`,
    async ({ request }) => {
      let newPayload = { ...tourPayloadAsset }
      newPayload['ratingsAverage'] = 5.1

      const createdTour = await createTourService(request, {
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
    async ({ request }) => {
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
    async ({ request }) => {
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

  testPW(`I could not create a tour with if missing image cover`, async ({ request }) => {
    const { imageCover, ...missingImageCoverPayload } = tourPayloadAsset

    const createdTour = await createTourService(request, {
      token: authToken,
      payload: missingImageCoverPayload,
    })
    expect(createdTour.statusCode).toBe(500)
    expect(createdTour.body.status).toBe('error')
    expect(createdTour.body.message).toContain('A tour must have image cover')
  })

  testPW(`I could not create a tour with if missing summary`, async ({ request }) => {
    const { summary, ...missingSummaryPayload } = tourPayloadAsset

    const createdTour = await createTourService(request, {
      token: authToken,
      payload: missingSummaryPayload,
    })
    expect(createdTour.statusCode).toBe(500)
    expect(createdTour.body.status).toBe('error')
    expect(createdTour.body.message).toContain('A tour must have summary')
  })
})
