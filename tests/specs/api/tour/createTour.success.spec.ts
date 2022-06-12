import { ITour, UserRoles } from '@app_type'
import { getTestAsset } from '@tests/utils/fileManagement'
import { tourPW, expect } from './tourHelper'

const sampleTourPayload = getTestAsset('tourPayload.json') as ITour

tourPW.describe('Create a tour', () => {
  tourPW(
    `As an admin, I could create a tour with full essential information`,
    async ({ createTourPWFixture, tourRestriction, deleteTourPWFixture }) => {
      sampleTourPayload['name'] = '[TEST-ADMIN] Amazing Tour'
      const authToken = await tourRestriction(UserRoles.ADMIN)

      const createdTour = await createTourPWFixture(authToken, sampleTourPayload)
      expect(createdTour.data.name).toBe('[TEST-ADMIN] Amazing Tour')

      await deleteTourPWFixture(authToken, createdTour.data._id)
    },
  )

  tourPW(
    `As a lead-guide, I could create a tour with full essential information`,
    async ({ createTourPWFixture, tourRestriction, deleteTourPWFixture }) => {
      sampleTourPayload['name'] = '[TEST-LEAD_GUIDE] Amazing Tour'
      const authToken = await tourRestriction(UserRoles.LEAD_GUIDE)

      const createdTour = await createTourPWFixture(authToken, sampleTourPayload)
      expect(createdTour.data.name).toBe('[TEST-LEAD_GUIDE] Amazing Tour')

      await deleteTourPWFixture(authToken, createdTour.data._id)
    },
  )

  tourPW(
    `As an admin, I could create a tour without optional info`,
    async ({ createTourPWFixture, tourRestriction, deleteTourPWFixture }) => {
      const {
        ratings,
        ratingsAverage,
        priceDiscount,
        description,
        images,
        startDates,
        guides,
        ...requiredFieldPayload
      } = sampleTourPayload
      requiredFieldPayload['name'] = '[TEST-OPTIONAL] Amazing Tour'

      const authToken = await tourRestriction(UserRoles.LEAD_GUIDE)

      const createdTour = await createTourPWFixture(authToken, requiredFieldPayload)
      expect(createdTour.data.name).toBe('[TEST-OPTIONAL] Amazing Tour')

      await deleteTourPWFixture(authToken, createdTour.data._id)
    },
  )
})
