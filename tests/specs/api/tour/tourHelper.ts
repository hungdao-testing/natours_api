import { ITour, UserRoles } from '@app_type'
import { getTestUserByRole } from '@fixture_data/fixtureData'
import { expect, test as base } from '@playwright/test'
import { loginAs } from '@tests/adapter/authen.service'
import { createTourService, deleteTourService } from '@tests/adapter/tour.service'

interface ITourTestFixture {
  tourRestriction: (role: UserRoles) => Promise<string>
  createTourPWFixture: (
    token: string,
    payload: unknown,
  ) => Promise<{ statusCode: number; data: ITour & { _id: string } }>
  deleteTourPWFixture: (token: string, tourId: string) => Promise<void>
}

export const tourPW = base.extend<ITourTestFixture>({
  tourRestriction: async ({ request }, use) => {
    await use(async (role: UserRoles) => {
      const user = getTestUserByRole(role)
      const token = await loginAs(
        {
          email: user.email,
          password: user.password,
        },
        request,
      )
      return token
    })
  },

  createTourPWFixture: async ({ request }, use) => {
    await use(async (token: string, payload: unknown) => {
      const { body, statusCode } = await createTourService(request, { token, payload })
      const createdTour = body.data.tours

      expect(statusCode).toBe(201)
      expect(createdTour).toHaveProperty('_id')
      expect(createdTour._id.length).toBeGreaterThanOrEqual(24)

      return {
        statusCode,
        data: createdTour,
      }
    })
  },

  deleteTourPWFixture: async ({ request }, use) => {
    await use(async (token, tourId) => {
      const { statusCode } = await deleteTourService(request, { token, tourId })
      expect(statusCode).toBe(204)
    })
  },
})

export { expect } from '@playwright/test'
