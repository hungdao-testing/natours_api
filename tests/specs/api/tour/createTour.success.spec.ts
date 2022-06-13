import { getTourPayloadAsset } from '@tests/utils/fileManagement'
import { testPW, expect } from '@tests/helpers/testHelper'

const tourPayloadAsset = getTourPayloadAsset()

testPW.describe.parallel('Create a tour', () => {
  testPW(
    `As an admin, I could create a tour with full essential information`,
    async ({ createTourPWFixture, authenBy, deleteTourPWFixture }) => {
      const payload = { ...tourPayloadAsset }
      payload['name'] = '[TEST-ADMIN] Amazing Tour'
      const authToken = await authenBy('ADMIN')

      const createdTour = await createTourPWFixture(authToken, payload)
      expect(createdTour.data.name).toBe(payload['name'])

      await deleteTourPWFixture(authToken, createdTour.data._id)
    },
  )

  testPW(
    `As a lead-guide, I could create a tour with full essential information`,
    async ({ createTourPWFixture, authenBy, deleteTourPWFixture }) => {
      const payload = { ...tourPayloadAsset }
      payload['name'] = '[TEST-LEAD_GUIDE] Amazing Tour'

      const authToken = await authenBy('LEAD-GUIDE')

      const createdTour = await createTourPWFixture(authToken, payload)
      expect(createdTour.data.name).toBe(payload['name'])

      await deleteTourPWFixture(authToken, createdTour.data._id)
    },
  )

  testPW(
    `As an admin, I could create a tour without optional info`,
    async ({ createTourPWFixture, authenBy, deleteTourPWFixture }) => {
      const {
        ratings,
        ratingsAverage,
        priceDiscount,
        description,
        images,
        startDates,
        guides,
        ...requiredFieldPayload
      } = tourPayloadAsset
      requiredFieldPayload['name'] = '[TEST-OPTIONAL] Amazing Tour'

      const authToken = await authenBy('ADMIN')

      const createdTour = await createTourPWFixture(authToken, requiredFieldPayload)
      expect(createdTour.data.name).toBe('[TEST-OPTIONAL] Amazing Tour')

      await deleteTourPWFixture(authToken, createdTour.data._id)
    },
  )
})
