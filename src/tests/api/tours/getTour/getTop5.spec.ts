import { test, expect } from '@playwright/test'
import jsonschema, { Schema } from 'jsonschema'
import _ from 'lodash'

const schemaValidator = new jsonschema.Validator()

test.describe('Get Top-5-tours', () => {
  test('Response format is returned as defined', async ({ request }) => {
    const schema: Schema = {
      id: 'getToursSchema',
      type: 'object',
      properties: {
        status: { type: 'string', required: true },
        results: { type: 'interger', required: true },
        tours: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', required: true },
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
    expect(body.results).toBe(5)
    body.tours.forEach((tour: any) => {
      expect([
        'The Forest Hiker',
        'The Sea Explorer',
        'The Star Gazer',
        'The Park Camper',
        'The Northern Lights',
      ]).toContain(tour.name)
    })
  })
})
