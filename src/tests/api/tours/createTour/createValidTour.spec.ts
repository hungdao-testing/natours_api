import { test, expect } from '../tourFixture'
import fs from 'fs'
import path from 'path'

const validPayload = JSON.parse(
  fs.readFileSync(path.join(`${__dirname}`, '..', `validTourPayload.json`), {
    encoding: 'utf-8',
  }),
)

test.describe('Create Tour', () => {
  let token: any

  test.beforeAll(async ({ loginToken }) => {
    token = await loginToken('LEAD_GUIDE')
  })

  for (const fixture of validPayload) {
    test.describe('Verify response data', () => {
      let tourBody: any

      test.afterEach(async ({ deleteTour }) => {
        const tourId = tourBody.data.tours._id
        const status = await deleteTour(token, tourId)

        expect(status).toBe(204)
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
