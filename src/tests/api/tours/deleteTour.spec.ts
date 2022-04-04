import { test, expect } from '@playwright/test'
import { getUserByRole } from '../../fixtureHelpers/userHelper'

test.describe('Delete Tour', () => {
  let token: string = ''

  const tourPayload = {
    name: '[HOT] Super Tour For QA',
    duration: 14,
    maxGroupSize: 8,
    difficulty: 'difficult',
    price: 2997,
    summary:
      'Surfing, skating, parajumping, rock climbing and more, all in one tour',
    imageCover: 'tour-6-cover.jpg',
    startLocation: {
      description: 'California, USA',
      type: 'Point',
      coordinates: [-118.803461, 34.006072],
      address: '29130 Cliffside Dr, Malibu, CA 90265, USA',
    },
  }

  for (const user of [getUserByRole('USER')!, getUserByRole('GUIDE')!]) {
    test.describe('Restriction', () => {
      let tourId: any

      test.beforeEach(async ({ request }) => {
        const loginReq = await request.post(`/api/v1/users/login`, {
          data: {
            email: user.email,
            password: user.password,
          },
        })

        const loginRes = await loginReq.json()
        token = loginRes.token

        tourId = '5c88fa8cf4afda39709c295a'
      })

      test(`User with role ${user.role} could not access the resource`, async ({
        request,
      }) => {
        const deletedTour = await request.delete(`/api/v1/tours/${tourId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        expect(deletedTour.status()).toBe(403)
      })
    })
  }

  test.describe('Verify response data', () => {
    const adminUser = getUserByRole('ADMIN')

    test.beforeEach(async ({ request }) => {
      const loginReq = await request.post(`/api/v1/users/login`, {
        data: {
          email: adminUser!.email,
          password: adminUser!.password,
        },
      })

      const loginRes = await loginReq.json()
      token = loginRes.token
    })

    test('Delete an existing tour successfully and return 204-code', async ({
      request,
    }) => {
      const newTour = await request.post(`/api/v1/tours`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: tourPayload,
      })
      expect(newTour.status()).toBe(201)
      const tourId = (await newTour.json()).data.tours._id

      const deletedTour = await request.delete(`/api/v1/tours/${tourId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      expect(deletedTour.status()).toBe(204)
    })

    test('Delete an non-existing tour and return 404-code', async ({
      request,
    }) => {
      const deletedTour = await request.delete(
        `/api/v1/tours/6249a41a41fc0363e6062407`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      expect(deletedTour.status()).toBe(404)
    })
  })
})
