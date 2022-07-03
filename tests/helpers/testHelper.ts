import { ITour, UserRoles } from '@app_type'
import { faker } from '@faker-js/faker'
import { getTestUserByRole } from '@fixture'
import { expect, test as testBase } from '@playwright/test'
import { loginAs } from '@tests/adapter/authen.service'
import { createTourService, deleteTourService } from '@tests/adapter/tour.service'
import { getTourPayloadAsset } from '@tests/utils/fileManagement'

interface ITestPWFixture {
  authenBy: (role: keyof typeof UserRoles) => Promise<string>
  createTourPWFixture: (
    token: string,
    payload?: unknown,
  ) => Promise<{ statusCode: number; data: ITour & { _id: string } }>
  deleteTourPWFixture: (token: string, tourId: string) => Promise<void>
  createUserWithRolePWFixture: (role: keyof typeof UserRoles, payload: {
    name: string
    email: string
  }) => Promise<void>
}

export function tourPayloadBuilder() {
  const tourPayloadAsset = getTourPayloadAsset()
  const price = parseFloat(faker.finance.account(3))
  tourPayloadAsset.name = 'TEST-' + faker.name.jobTitle()
  tourPayloadAsset.price = price
  tourPayloadAsset.priceDiscount = price - 10
  tourPayloadAsset.maxGroupSize = parseInt(faker.finance.amount(5, 12))
  tourPayloadAsset.ratingsAverage = parseFloat(faker.finance.amount(1, 5, 1))
  tourPayloadAsset.ratings = parseFloat(faker.finance.amount(4, 5, 1))

  return tourPayloadAsset
}

export function userPayloadBuilder(role?: keyof typeof UserRoles | Omit<string, keyof typeof UserRoles>) {
  let userRole;
  if (role) userRole = role
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()
  const email = faker.internet.email(firstName, lastName);
  const name = firstName + lastName
  return {
    email,
    name,
    role: userRole?.toLowerCase(),
    password: "test1234",
    passwordConfirm: "test1234"
  }
}

export const testPW = testBase.extend<ITestPWFixture>({
  authenBy: async ({ request }, use) => {
    await use(async (role: keyof typeof UserRoles) => {
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
    await use(async (token: string, tourPayload?: unknown) => {
      let createTourPayload = tourPayload || tourPayloadBuilder()
      const { body, statusCode } = await createTourService(request, {
        token,
        payload: createTourPayload,
      })
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

  createUserWithRolePWFixture: async ({ request }, use) => {
    await use(async (role: keyof typeof UserRoles) => {
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
  }
})

export { expect } from '@playwright/test'
