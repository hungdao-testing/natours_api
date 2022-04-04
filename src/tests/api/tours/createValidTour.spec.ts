import { test, expect } from '@playwright/test'
import _ from 'lodash'
import fs from 'fs'

const validPayload = JSON.parse(
  fs.readFileSync(`${__dirname}/validTourPayload.json`, {
    encoding: 'utf-8',
  }),
)

test.describe('Create Tour', () => {
  let token: any
  const guideUser = {
    role: 'LEAD_GUIDE',
    email: 'miyah@example.com',
    password: 'test1234',
  }

  test.beforeAll(async ({ request }) => {
    const loginReq = await request.post(`/api/v1/users/login`, {
      data: {
        email: guideUser.email,
        password: guideUser.password,
      },
    })

    const loginRes = await loginReq.json()
    token = loginRes.token
  })

  for (const fixture of validPayload) {
    test.describe('Verify response data', () => {
      let tourBody: any

      test.afterEach(async ({ request }) => {
        const tourId = tourBody.data.tours._id
        const res = await request.delete(`/api/v1/tours/${tourId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        expect(res.status()).toBe(204)
      })

      test(`User with role ${fixture.user.role} could create a new tour ${fixture.case}`, async ({
        request,
      }) => {
        const newTour = await request.post(`/api/v1/tours`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: fixture.payload,
        })
        tourBody = await newTour.json()

        expect(newTour.status()).toBe(201)
        expect(tourBody.data.tours._id.length).toBeGreaterThan(1)

        for (const prop in fixture.expected_result.data) {
          expect(tourBody.data.tours[prop]).toBe(
            fixture.expected_result.data[prop],
          )
        }
      })
    })
  }
})
