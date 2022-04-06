import { expect, test as base } from '@playwright/test'
import { UserRoles } from '../../../typing/app.type'
import { getUserByRole } from '../../fixtureHelpers/userHelper'

interface ITourTestFixture {
  loginToken: (role: keyof typeof UserRoles) => Promise<string>
  createTour: (loginToken: string) => Promise<{ _id: string; status: number }>
  deleteTour: (loginToken: string, tourId: string) => Promise<number>
}

const sampleTourPayload = {
  startLocation: {
    description: 'California, USA',
    type: 'Point',
    coordinates: [-118.803461, 34.006072],
    address: '29130 Cliffside Dr, Malibu, CA 90265, USA',
  },
  ratings: 3.5,
  ratingsAverage: 3.9,
  ratingsQuantity: 7,
  images: ['tour-6-1.jpg', 'tour-6-2.jpg', 'tour-6-3.jpg'],
  startDates: [
    '2021-07-19T09:00:00.000Z',
    '2021-09-06T09:00:00.000Z',
    '2022-03-18T10:00:00.000Z',
  ],
  name: 'Summer Tour 7 days 6 nights',
  duration: 14,
  maxGroupSize: 8,
  difficulty: 'difficult',
  guides: [
    '5c8a21f22f8fb814b56fa18a',
    '5c8a1f292f8fb814b56fa184',
    '5c8a1f4e2f8fb814b56fa185',
  ],
  price: 2997,
  priceDiscount: 2000,
  summary:
    'Surfing, skating, parajumping, rock climbing and more, all in one tour',
  description:
    'Nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\nVoluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur!',
  imageCover: 'tour-6-cover.jpg',
  locations: [
    {
      _id: '5c88fa8cf4afda39709c296b',
      description: 'Point Dume Beach',
      type: 'Point',
      coordinates: [-118.809361, 34.003098],
      day: 1,
    },
  ],
}

export const test = base.extend<ITourTestFixture>({
  loginToken: async ({ request }, use) => {
    await use(async (role: keyof typeof UserRoles) => {
      const user = getUserByRole(role)!
      const loginReq = await request.post(`/api/v1/users/login`, {
        data: {
          email: user!.email,
          password: user!.password,
        },
      })
      expect(loginReq.status()).toBe(200)
      const loginRes = await loginReq.json()
      if (loginReq.ok()) {
        return loginRes.token
      } else {
        return 'Could not login'
      }
    })
  },
  createTour: async ({ request }, use) => {
    await use(async (loginToken) => {
      const tourCreationReq = await request.post(`/api/v1/tours`, {
        headers: {
          Authorization: `Bearer ${loginToken}`,
        },
        data: sampleTourPayload,
      })
      const body = await tourCreationReq.json()
      expect(tourCreationReq.status()).toBe(201)
      expect(body.data.tours.name).toBe(sampleTourPayload.name)
      expect(body.data.tours._id.length).toBeGreaterThan(1)
      return {
        _id: body.data.tours._id,
        status: tourCreationReq.status(),
      }
    })
  },
  deleteTour: async ({ request }, use) => {
    await use(async (loginToken, tourId) => {
      const tourDeleteReq = await request.delete(`/api/v1/tours/${tourId}`, {
        headers: {
          Authorization: `Bearer ${loginToken}`,
        },
        data: sampleTourPayload,
      })
      const status = tourDeleteReq.status()
      if (tourDeleteReq.ok()) {
        return status
      } else {
        throw new Error('Could not delete tour')
      }
    })
  },
})
export { expect } from '@playwright/test'
