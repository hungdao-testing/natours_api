import { ITour } from '@app_type'
import { testPW, expect, tourPayloadBuilder } from '@tests/helpers/testHelper'

testPW.describe.parallel('Create a tour', () => {
  let payload: ITour

  testPW.beforeEach(() => {
    payload = tourPayloadBuilder()
  })

  testPW(
    `As an admin, I could create a tour with full essential information`,
    async ({ createTourPWFixture, authenBy, deleteTourPWFixture }) => {
      const authToken = await authenBy('ADMIN')

      const createdTour = await createTourPWFixture(authToken, payload)
      expect(createdTour.data.name).toBe(payload.name)

      await deleteTourPWFixture(authToken, createdTour.data._id)
    },
  )

  testPW(
    `As an lead-guide, I could create a tour without optional info`,
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
      } = payload

      const authToken = await authenBy('LEAD-GUIDE')

      const createdTour = await createTourPWFixture(authToken, requiredFieldPayload)
      expect(createdTour.data.name).toBe(payload.name)

      await deleteTourPWFixture(authToken, createdTour.data._id)
    },
  )
})
