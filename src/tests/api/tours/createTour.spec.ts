import { test, expect } from '@playwright/test'
import jsonschema, { Schema } from 'jsonschema'
import _ from 'lodash'
import fs from 'fs'
import { getUserByRole } from '../../fixtureHelpers/userHelper'

const schemaValidator = new jsonschema.Validator()

test.describe('Create Tour', () => {
  const tourSchema = JSON.parse(
    fs.readFileSync(`${__dirname}/tourSchema.json`, { encoding: 'utf-8' }),
  )

  const users = [
    { role: getUserByRole('ADMIN')!, isAccessable: true },
    { role: getUserByRole('LEAD_GUIDE')!, isAccessable: true },
    { role: getUserByRole('GUIDE')!, isAccessable: false },
    { role: getUserByRole('USER')!, isAccessable: false },
  ]

  test.describe('Restriction', () => {
    for (const user of users) {
      test(`User with role ${user.role.role} could ${
        user.isAccessable === true ? 'access' : 'not access'
      } to the api resource`, async ({ request }) => {
        let nameTour = `QA_API_TEST ${new Date().getUTCMilliseconds()}`
        let payloadTour = {
          name: nameTour,
          duration: 14,
          maxGroupSize: 9,
          difficulty: 'easy',
          price: 2997,
          summary:
            'Surfing, skating, parajumping, rock climbing and more, all in one tour',
          imageCover: 'tour-1-cover.jpg',
          startLocation: {
            description: 'California, USA',
            type: 'Point',
            coordinates: [-118.803461, 34.006072],
            address: '29130 Cliffside Dr, Malibu, CA 90265, USA',
          },
        }
        const loginReq = await request.post(`/api/v1/users/login`, {
          data: {
            email: user.role.email,
            password: user.role.password,
          },
        })

        const loginRes = await loginReq.json()

        const newTour = await request.post(`/api/v1/tours`, {
          headers: {
            Authorization: `Bearer ${loginRes.token}`,
          },
          data: payloadTour,
        })

        expect(newTour.ok(), `Failed by user: ${user.role.role}`).toBe(
          user.isAccessable,
        )

        if (newTour.ok()) {
          const newTourRes = await newTour.json()
          await request.delete(`/api/v1/tours/${newTourRes.data.tours._id}`, {
            headers: {
              Authorization: `Bearer ${loginRes.token}`,
            },
          })
        }
      })
    }
  })

  test.describe('Response data', () => {
    const requiredFields = [
      'name',
      'duration',
      'maxGroupSize',
      'difficulty',
      'price',
      'summary',
      'imageCover',
    ]

    let samplePayload: any
    let newTour: any
    let newTourRes: any
    let loginRes: any

    test.beforeEach(async ({ request }) => {
      samplePayload = {
        name: '',
        duration: 14,
        maxGroupSize: 8,
        difficulty: 'difficult',
        price: 2997,
        summary:
          'Surfing, skating, parajumping, rock climbing and more, all in one tour',
        imageCover: 'tour-2-cover.jpg',
        startLocation: {
          description: 'California, USA',
          type: 'Point',
          coordinates: [-118.803461, 34.006072],
          address: '29130 Cliffside Dr, Malibu, CA 90265, USA',
        },
      }

      const adminUserLogin = await request.post(`/api/v1/users/login`, {
        data: {
          email: users[0].role.email,
          password: users[0].role.password,
        },
      })

      loginRes = await adminUserLogin.json()
    })

    test.afterEach(async ({ request }) => {
      if (newTour.ok()) {
        // console.log('Tour Name: ', samplePayload['name'])
        await request.delete(`/api/v1/tours/${newTourRes.data.tours._id}`, {
          headers: {
            Authorization: `Bearer ${loginRes.token}`,
          },
        })
      }
    })

    test('Return correct schema', async ({ request }) => {
      samplePayload['name'] = `QA_API_TEST ${new Date().getUTCMilliseconds()}`

      const schema: Schema = {
        type: 'object',
        properties: {
          status: { type: 'string', required: true },
          data: {
            type: 'object',
            properties: {
              tours: {
                ...tourSchema,
              },
            },
          },
        },
      }
      newTour = await request.post(`/api/v1/tours`, {
        headers: {
          Authorization: `Bearer ${loginRes.token}`,
        },
        data: samplePayload,
      })
      newTourRes = await newTour.json()

      expect(
        schemaValidator.validate(newTourRes, schema, { nestedErrors: true })
          .valid,
      ).toBeTruthy()
    })

    test('Set default values for missing fields', async ({ request }) => {
      samplePayload['name'] = `QA_API_TEST ${new Date().getUTCMilliseconds()}`
      const newTour = await request.post(`/api/v1/tours`, {
        headers: {
          Authorization: `Bearer ${loginRes.token}`,
        },
        data: samplePayload,
      })
      newTourRes = await newTour.json()

      expect(newTourRes.data.tours.ratings).toBe(4.5)
      expect(newTourRes.data.tours.ratingsAverage).toBe(4.5)
    })

    test.describe('Error', () => {
      test.describe('Require fields', () => {
        for (const field of requiredFields) {
          test(`Return error-500 because of missing ${field} in payload`, async ({
            request,
          }) => {
            const newPayload = _.omit(samplePayload, field)
            newTour = await request.post(`/api/v1/tours`, {
              headers: {
                Authorization: `Bearer ${loginRes.token}`,
              },
              data: newPayload,
            })
            expect(newTour.status()).toBe(500)
          })
        }
      })

      test('Return error-500 because of difficulty is not in supported list [difficult, medium.easy]', async ({
        request,
      }) => {
        samplePayload['name'] = `QA_API_TEST ${new Date().getUTCMilliseconds()}`
        samplePayload['difficulty'] = 'unsupported'

        newTour = await request.post(`/api/v1/tours`, {
          headers: {
            Authorization: `Bearer ${loginRes.token}`,
          },
          data: samplePayload,
        })
        newTourRes = await newTour.json()

        expect(newTour.status()).toBe(500)
        expect(newTourRes.error.message).toContain(
          'Tour validation failed: difficulty: Difficulty is either easy, medium or difficult',
        )
      })

      test.describe('Rating Average', () => {
        for (const ratingAverage of [0, 6]) {
          test(`Return error-500 because of rating average "${ratingAverage}" is out-of-range [1-5]`, async ({
            request,
          }) => {
            samplePayload[
              'name'
            ] = `QA_API_TEST ${new Date().getUTCMilliseconds()}`
            samplePayload['ratingsAverage'] = ratingAverage

            const newTour = await request.post(`/api/v1/tours`, {
              headers: {
                Authorization: `Bearer ${loginRes.token}`,
              },
              data: samplePayload,
            })
            const newTourRes = await newTour.json()

            expect(newTour.status()).toBe(500)
            expect(newTourRes.error.message).toContain(
              'Tour validation failed: ratingsAverage',
            )
          })
        }
      })

      test('Return error-500 because of discount price > regular price', async ({
        request,
      }) => {
        samplePayload['name'] = `QA_API_TEST ${new Date().getUTCMilliseconds()}`
        samplePayload['priceDiscount'] = samplePayload['price']

        const newTour = await request.post(`/api/v1/tours`, {
          headers: {
            Authorization: `Bearer ${loginRes.token}`,
          },
          data: samplePayload,
        })
        const newTourRes = await newTour.json()

        expect(newTour.status()).toBe(500)
        expect(newTourRes.error.message).toContain(
          `priceDiscount: discount price (${samplePayload['priceDiscount']}) should be less than regular price`,
        )
      })

      test('Return error-500 because of duplicating name with existing one', async ({
        request,
      }) => {
        samplePayload['name'] = 'The Sports Lover'

        newTour = await request.post(`/api/v1/tours`, {
          headers: {
            Authorization: `Bearer ${loginRes.token}`,
          },
          data: samplePayload,
        })
        newTourRes = await newTour.json()

        expect(newTour.status()).toBe(500)
        expect(newTourRes.message).toContain(
          `E11000 duplicate key error collection`,
        )
      })
    })
  })
})
