import { test, expect, APIResponse } from '@playwright/test'
import jsonschema, { Schema } from 'jsonschema'
import fs from 'fs'
import {
  filterToursByQueryParam,
  getTourByPagination,
} from '../../../utils/tourHelper'
import _ from 'lodash'
import { parseTours } from '../../../../dev-data/data/parseFile'
import path from 'path'

const schemaValidator = new jsonschema.Validator()
const tourSchema = JSON.parse(
  fs.readFileSync(path.join(`${__dirname}`, '..', `tourSchema.json`), {
    encoding: 'utf-8',
  }),
)

test.describe('Get Tours', () => {
  test('Response format is returned as defined', async ({ request }) => {
    const schema: Schema = {
      id: 'getToursSchema',
      type: 'object',
      properties: {
        status: { type: 'string' },
        results: { type: 'interger' },
        tours: {
          type: 'array',
          items: {
            ...tourSchema,
          },
        },
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
      expect(body.results).toBe(expectedTours.length)
      expect(_.differenceBy(body.tours, expectedTours, 'name').length).toBe(0)
    })

    test('Sorting', async ({ request }) => {
      let sortStr = '-price,ratingsAverage'
      const newQueryStr = queryStr + '&' + sortStr

      const res = await request.get(`/api/v1/tours?${newQueryStr}`)
      const body = await res.json()

      const expectedTours = _.orderBy(
        filterToursByQueryParam(queryStr),
        ['price', 'ratingsAverage'],
        ['desc', 'asc'],
      )

      expect(res.status()).toBe(200)
      expect(body.results).toBe(expectedTours.length)
      for (let i = 0; i < expectedTours.length; i++) {
        expect(expectedTours[i].name).toBe(body.tours[i].name)
      }
    })

    test.describe('Displaying field', () => {
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

      test('Allow fields not to be displayed', async ({ request }) => {
        const limitFields = 'fields=-ratings,-name'
        const newQueryStr = queryStr + '&' + limitFields

        const res = await request.get(`/api/v1/tours?${newQueryStr}`)
        const body = await res.json()

        expect(res.status()).toBe(200)
        expect(body.tours[0]).not.toHaveProperty('ratings')
        expect(body.tours[0]).not.toHaveProperty('name')
      })

      test('Returning 500 if including and excluding fields are mentioning in query params', async ({
        request,
      }) => {
        const limitFields = 'fields=-ratings,name'
        const newQueryStr = queryStr + '&' + limitFields

        const res = await request.get(`/api/v1/tours?${newQueryStr}`)
        const body = await res.json()

        expect(res.status()).toBe(500)
      })
    })

    test.describe('Pagination and limit results', () => {
      test("Return all tours in one page if query params dont include 'limit'", async ({
        request,
      }) => {
        const res = await request.get(`/api/v1/tours?&page=1`)
        const body = await res.json()

        expect(res.status()).toBe(200)
        expect(body.results).toBe(parseTours.length)
      })
      test('Get tours per page', async ({ request }) => {
        let numberToursOnPage = 3
        let pageIndex = 2

        const res = await request.get(
          `/api/v1/tours?&page=${pageIndex}&limit=${numberToursOnPage}`,
        )
        const body = await res.json()
        expect(body.results).toBe(3)

        const tours = getTourByPagination(
          parseTours,
          pageIndex,
          numberToursOnPage,
        )
        expect(_.differenceBy(tours, body.tours, 'name').length).toBe(0)
      })

      test('Get tours on non-existing page', async ({ request }) => {
        let numberToursOnPage = 3
        let pageIndex = 100

        const res = await request.get(
          `/api/v1/tours?&page=${pageIndex}&limit=${numberToursOnPage}`,
        )
        const body = await res.json()

        expect(body.tours.length).toBe(0)
      })
    })
  })
})
