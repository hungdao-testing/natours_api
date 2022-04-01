import { test, expect } from '@playwright/test'
import jsonschema, { Schema } from 'jsonschema'
import _ from 'lodash'
import { parseTours } from '../../../dev-data/data/parseFile'
import { getTourByPagination } from './tourHelper'

const schemaValidator = new jsonschema.Validator()

test.describe('Get Top-5-tours', () => {
  const tours = getTourByPagination(
    _.orderBy(
      parseTours,
      ['ratingsAverage', 'price', '_id'],
      ['desc', 'asc', 'desc'],
    ),
    1,
    5,
  )

  test('Response format is returned as defined', async ({ request }) => {
    const schema: Schema = {
      id: 'getToursSchema',
      type: 'object',
      properties: {
        status: { type: 'string', required: true },
        result: { type: 'interger', required: true },
        tours: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              price: { type: 'number', required: true },
              ratingsAverage: { type: 'number', required: true },
              summary: { type: 'string', required: true },
              difficulty: {
                type: 'string',
                enum: ['easy', 'medium', 'difficult'],
                required: true,
              },
            },
            minProperties: 4,
            maxProperties: 8,
          },
        },
      },
    }

    const res = await request.get(`/api/v1/tours/top-5-cheap`)
    const body = await res.json()

    expect(res.status()).toBe(200)
    expect(
      schemaValidator.validate(body, schema, { nestedErrors: true }).valid,
    ).toBeTruthy()
  })

  test('Response returns correct data', async ({ request }) => {
    const res = await request.get(`/api/v1/tours/top-5-cheap`)
    const body = await res.json()

    expect(res.status()).toBe(200)
    expect(body.result).toBe(tours.length)
    for (let i = 0; i < tours.length; i++) {
      expect(body.tours[i].name).toBe(tours[i].name)
      expect(body.tours[i].price).toBe(tours[i].price)
      expect(body.tours[i].ratingsAverage).toBe(tours[i].ratingsAverage)
      expect(body.tours[i].difficulty).toBe(tours[i].difficulty)
    }
  })
})
