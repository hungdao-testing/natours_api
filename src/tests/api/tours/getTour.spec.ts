import { test, expect, APIResponse } from '@playwright/test'
import jsonschema, { Schema } from 'jsonschema'
import fs from 'fs'
import { filterToursByQueryParam, sortToursByQueryParam } from './tourHelper'
import _ from 'lodash'

const schemaValidator = new jsonschema.Validator()
const tourSchema = JSON.parse(
  fs.readFileSync(`${__dirname}/tourSchema.json`, { encoding: 'utf-8' }),
)

test.describe.only('Get Tours', () => {
  test('Response format is returned as defined', async ({ request }) => {
    const schema: Schema = {
      id: 'getToursSchema',
      type: 'object',
      properties: {
        status: { type: 'string' },
        results: { type: 'interger' },
        tours: { ...tourSchema },
      },
    }

    const res = await request.get(`/api/v1/tours`)
    const body = await res.json()

    expect(res.status()).toBe(200)
    expect(
      schemaValidator.validate(body, schema, { nestedErrors: true }).valid,
    ).toBeTruthy()
  })

  test.describe('Check query params', () => {
    const queryStr = 'price[lt]=1000&ratingsAverage[gt]=4'
    let res: APIResponse
    let body: any

    test('Filter', async ({ request }) => {
      res = await request.get(`/api/v1/tours?${queryStr}`)
      body = await res.json()
      const expectedTours = filterToursByQueryParam(queryStr)

      expect(res.status()).toBe(200)
      expect(body.result).toBe(expectedTours.length)
      expect(_.differenceBy(body.tours, expectedTours, 'name').length).toBe(0)
    })

    test('Sorting', async ({ request }) => {
      let sortStr = 'sort=-price,ratingsAverage'
      const newQueryStr = queryStr + '&' + sortStr

      const res = await request.get(`/api/v1/tours?${newQueryStr}`)
      const body = await res.json()

      const expectedTours = sortToursByQueryParam(
        sortStr,
        filterToursByQueryParam(queryStr),
      )

      expect(res.status()).toBe(200)
      expect(body.result).toBe(expectedTours.length)
      for (let i = 0; i < expectedTours.length; i++) {
        expect(expectedTours[i].name).toBe(body.tours[i].name)
      }
    })

    test.describe('Limiting field', () => {
      test('Allow fields to be displayed', async ({ request }) => {
        const schema: Schema = {
          id: 'getToursSchema',
          type: 'object',
          properties: {
            status: { type: 'string' },
            results: { type: 'interger' },
            tours: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  _id: {
                    type: 'string',
                  },
                  name: {
                    type: 'string',
                  },
                  ratings: {
                    type: 'number',
                  },
                  guides: {
                    type: 'array',
                    items: [
                      {
                        type: 'object',
                        properties: {
                          _id: {
                            type: 'string',
                          },
                          name: {
                            type: 'string',
                          },
                          email: {
                            type: 'string',
                          },
                          photo: {
                            type: 'string',
                          },
                          role: {
                            type: 'string',
                          },
                        },
                        required: ['_id', 'name', 'email', 'photo', 'role'],
                      },
                      {
                        type: 'object',
                        properties: {
                          _id: {
                            type: 'string',
                          },
                          name: {
                            type: 'string',
                          },
                          email: {
                            type: 'string',
                          },
                          photo: {
                            type: 'string',
                          },
                          role: {
                            type: 'string',
                          },
                        },
                        required: ['_id', 'name', 'email', 'photo', 'role'],
                      },
                    ],
                  },
                  durationWeeks: {
                    type: ['null', 'number'],
                  },
                },
                required: ['_id', 'name', 'ratings', 'durationWeeks', 'guides'],

                maxProperties: 5,
                minProperties: 5,
              },
            },
          },
        }
        const limitFields = 'fields=ratings,name'
        const newQueryStr = queryStr + '&' + limitFields

        const res = await request.get(`/api/v1/tours?${newQueryStr}`)
        const body = await res.json()

        expect(res.status()).toBe(200)

        expect(
          schemaValidator.validate(body, schema, { nestedErrors: true }).valid,
        ).toBeTruthy()
      })

      test('Allow fields not to be displayed', async ({ request }) => {})
    })
  })
})
