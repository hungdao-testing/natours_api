import { test, expect } from '@playwright/test'
import jsonschema, { Schema } from 'jsonschema'
import fs from 'fs'
import _ from 'lodash'

const schemaValidator = new jsonschema.Validator()
const tourSchema = JSON.parse(
  fs.readFileSync(`${__dirname}/tourSchema.json`, { encoding: 'utf-8' }),
)

test.describe('Get Tour Within', () => {
  const distance = 400
  const latlng = '34.111745,-118.11349'

  test('Response format is returned as defined', async ({ request }) => {
    const schema: Schema = {
      type: 'object',
      properties: {
        status: { type: 'string' },
        results: { type: 'interger' },
        data: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                ...tourSchema,
              },
            },
          },
        },
      },
    }

    const res = await request.get(
      `/api/v1/tours/tours-within/${distance}/center/${latlng}/unit/mi`,
    )
    const body = await res.json()

    expect(res.status()).toBe(200)
    expect(
      schemaValidator.validate(body, schema, { nestedErrors: true }).valid,
    ).toBeTruthy()
  })

  test('Response returns correct data', async ({ request }) => {
    const res = await request.get(
      `/api/v1/tours/tours-within/${distance}/center/${latlng}/unit/mi`,
    )
    const body = await res.json()

    expect(res.status()).toBe(200)
    body.data.data.forEach((tour: any) => {
      expect([
        'The Wine Taster',
        'The Park Camper',
        'The Sports Lover',
      ]).toContain(tour.name)
    })
  })

  test('Response returns error if missing one of lat-long value', async ({
    request,
  }) => {
    const res = await request.get(
      `/api/v1/tours/tours-within/${distance}/center/-118.11349/unit/mi`,
    )

    expect(res.status()).toBe(400)
  })
})
