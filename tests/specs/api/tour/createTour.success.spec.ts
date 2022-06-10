import { ITour, UserRoles } from '@app_type'
import { getTestAsset } from '@tests/utils/fileManagement'
import { tourPW, expect } from './tourHelper'

const sampleTourPayload = getTestAsset('tourPayload.json') as ITour

tourPW.describe.parallel('Create a tour', () => {
  tourPW(
    `As an admin, I could create a tour with full essential information`,
    async ({ createTour, tourRestriction, deleteTour }) => {
      sampleTourPayload['name'] = '[TEST-ADMIN] Amazing Tour'
      const authToken = await tourRestriction(UserRoles.ADMIN)

      const createdTour = await createTour(authToken, sampleTourPayload)
      expect(createdTour.data.name).toBe('[TEST-ADMIN] Amazing Tour')

      await deleteTour(authToken, createdTour.data._id)
    },
  )

  tourPW(
    `As a lead-guide, I could create a tour with full essential information`,
    async ({ createTour, tourRestriction, deleteTour }) => {
      sampleTourPayload['name'] = '[TEST-LEAD_GUIDE] Amazing Tour'
      const authToken = await tourRestriction(UserRoles.LEAD_GUIDE)

      const createdTour = await createTour(authToken, sampleTourPayload)
      expect(createdTour.data.name).toBe('[TEST-LEAD_GUIDE] Amazing Tour')

      await deleteTour(authToken, createdTour.data._id)
    },
  )
})
