import { test, expect } from '@playwright/test'
import jsonschema, { Schema } from 'jsonschema'
import _ from 'lodash'
import { parseTours } from '../../../../dev-data/data/parseFile'

const schemaValidator = new jsonschema.Validator()

test.describe('Get Tour Distance', () => {
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
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  name: { type: 'string', required: true },
                  distance: { type: 'number', required: true },
                },
              },
            },
          },
        },
      },
    }

    const res = await request.get(`/api/v1/tours/distances/${latlng}/unit/mi`)
    const body = await res.json()

    expect(res.status()).toBe(200)
    expect(
      schemaValidator.validate(body, schema, { nestedErrors: true }).valid,
    ).toBeTruthy()
  })

  test('Response returns correct data', async ({ request }) => {
    const res = await request.get(`/api/v1/tours/distances/${latlng}/unit/mi`)
    const body = await res.json()
    expect(res.status()).toBe(200)
    expect(body.results).toBe(parseTours.length)
  })

  test('Response returns error if missing one of lat-long value', async ({
    request,
  }) => {
    const res = await request.get(`/api/v1/tours/distances/-118.11349/unit/mi`)

    expect(res.status()).toBe(400)
  })
})
