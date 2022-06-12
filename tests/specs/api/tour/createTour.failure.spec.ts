import { ITour, UserRoles } from '@app_type'
import { createTourService } from '@tests/adapter/tour.service'
import { getTestAsset } from '@tests/utils/fileManagement'
import { tourPW, expect } from './tourHelper'

const sampleTourPayload = getTestAsset('tourPayload.json') as ITour

tourPW.describe.parallel('Create a tour', () => {
  tourPW(`I could not create a tour if missing tour name`, async ({ tourRestriction, request }) => {
    const { name, ...missingTourNamePayload } = sampleTourPayload
    const authToken = await tourRestriction(UserRoles.ADMIN)

    const createdTour = await createTourService(request, {
      token: authToken,
      payload: missingTourNamePayload,
    })
    expect(createdTour.statusCode).toBe(500)
    expect(createdTour.body.status).toBe('error')
    expect(createdTour.body.message).toContain('A tour must have name')
  })

  tourPW(
    `I could not create a tour with if ratings average is out of range [1.0 - 5.0]`,
    async ({ tourRestriction, request }) => {
      const authToken = await tourRestriction(UserRoles.ADMIN)
      let newPayload = { ...sampleTourPayload }
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
  tourPW(
    `I could not create a tour with if discount price is greater than regular price`,
    async ({ tourRestriction, request }) => {
      const authToken = await tourRestriction(UserRoles.ADMIN)

      let newPayload = { ...sampleTourPayload }
      newPayload['priceDiscount'] = sampleTourPayload['price'] + 1

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

  tourPW(
    `I could not create a tour with if missing image cover`,
    async ({ tourRestriction, request }) => {
      const { imageCover, ...missingImageCoverPayload } = sampleTourPayload
      const authToken = await tourRestriction(UserRoles.ADMIN)

      const createdTour = await createTourService(request, {
        token: authToken,
        payload: missingImageCoverPayload,
      })
      expect(createdTour.statusCode).toBe(500)
      expect(createdTour.body.status).toBe('error')
      expect(createdTour.body.message).toContain('A tour must have image cover')
    },
  )

  tourPW(
    `I could not create a tour with if missing summary`,
    async ({ tourRestriction, request }) => {
      const { summary, ...missingSummaryPayload } = sampleTourPayload
      const authToken = await tourRestriction(UserRoles.ADMIN)

      const createdTour = await createTourService(request, {
        token: authToken,
        payload: missingSummaryPayload,
      })
      expect(createdTour.statusCode).toBe(500)
      expect(createdTour.body.status).toBe('error')
      expect(createdTour.body.message).toContain('A tour must have summary')
    },
  )

  tourPW(
    `I could not create a tour with if my role is regular user`,
    async ({ tourRestriction, request }) => {
      const authToken = await tourRestriction(UserRoles.USER)

      const createdTour = await createTourService(request, {
        token: authToken,
        payload: sampleTourPayload,
      })
      expect(createdTour.statusCode).toBe(403)
      expect(createdTour.body.status).toBe('fail')
    },
  )
  tourPW(
    `I could not create a tour with if my role is guide user`,
    async ({ tourRestriction, request }) => {
      const authToken = await tourRestriction(UserRoles.GUIDE)

      const createdTour = await createTourService(request, {
        token: authToken,
        payload: sampleTourPayload,
      })
      expect(createdTour.statusCode).toBe(403)
      expect(createdTour.body.status).toBe('fail')
    },
  )
})
