import { ITour, UserRoles } from '@app_type'
import { faker } from '@faker-js/faker'
import { getTestUserByRole } from '@fixture'
import { expect, test as testBase } from '@playwright/test'
import { loginAs } from '@tests/adapter/authen.service'
import { createTourService, deleteTourService } from '@tests/adapter/tour.service'
import { confirmSignupService, createUserService } from '@tests/adapter/user.service'
import { getTourPayloadAsset } from '@tests/utils/fileManagement'

type TUserPayload = {
  email: string
  name: string
  role: string
  password: string
  passwordConfirm: string
  active: boolean
}
interface ITestPWFixture {
  authenBy: (role: keyof typeof UserRoles) => Promise<string>
  createTourPWFixture: (
    token: string,
    payload?: unknown,
  ) => Promise<{ statusCode: number; data: ITour & { _id: string } }>
  deleteTourPWFixture: (token: string, tourId: string) => Promise<void>
  createUserWithRolePWFixture: (
    role: keyof typeof UserRoles,
    payload?: TUserPayload,
  ) => Promise<{ email: string; userId: string }>
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

export function userPayloadBuilder(
  role?: keyof typeof UserRoles | Omit<string, keyof typeof UserRoles>,
): TUserPayload {
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()
  const email = faker.internet.email(firstName, lastName)
  const name = firstName + ' ' + lastName
  return {
    email,
    name,
    role: role ? role.toLowerCase() : 'user',
    password: 'test1234',
    passwordConfirm: 'test1234',
    active: false,
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
    await use(async (role: keyof typeof UserRoles, userPayload?: TUserPayload) => {
      // let userPayload = userPayloadBuilder()

      if (!userPayload) userPayload = userPayloadBuilder(role)
      userPayload.active = true

      const req = await createUserService(request, userPayload)

      expect(req.statusCode).toBe(201)

      expect(req.body).toHaveProperty('status', 'success')
      expect(req.body).toHaveProperty('token')
      expect(req.body.data.currentUser).toHaveProperty('confirmationCode')
      expect(req.body.data.currentUser).toHaveProperty('role', role ? UserRoles[role] : 'user')
      expect(req.body.data.currentUser).toHaveProperty('photo', 'default.jpg')
      expect(req.body.data.currentUser).toHaveProperty('active', false)

      if ([200, 201].includes(req.statusCode)) {
        await confirmSignupService(request, req.body.data.currentUser.confirmationCode)
      }
      return {
        email: userPayload.email,
        userId: req.body.data.currentUser.id,
      }
    })
  },
})

export { expect } from '@playwright/test'
