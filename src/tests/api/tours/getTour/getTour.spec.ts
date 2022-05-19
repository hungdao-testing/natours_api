import { test, expect } from '@playwright/test'
import jsonschema, { Schema } from 'jsonschema'
import fs from 'fs'
import _ from 'lodash'

import path from 'path'
import { parseTours } from '../../../../dev-data/parseFile'

const schemaValidator = new jsonschema.Validator()
const tourSchema = JSON.parse(
  fs.readFileSync(path.join(`${__dirname}`, '..', `tourSchema.json`), {
    encoding: 'utf-8',
  }),
)

test.describe('Get Tour', () => {
  const validTour = parseTours[0]

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

    const res = await request.get(`/api/v1/tours/${validTour._id}`)
    const body = await res.json()

    expect(res.status()).toBe(200)
    expect(
      schemaValidator.validate(body, schema, { nestedErrors: true }).valid,
    ).toBeTruthy()
  })

  test('Response returns correct data', async ({ request }) => {
    const res = await request.get(`/api/v1/tours/${validTour._id}`)
    const body = await res.json()

    expect(res.status()).toBe(200)
    expect(body.tours.name).toBe(validTour.name)
    expect(body.tours.price).toBe(validTour.price)
  })

  test('Response returns not found for non-existing tour', async ({
    request,
  }) => {
    const res = await request.get(`/api/v1/tours/5c88fa8cf4afda39709c2975`)
    const body = await res.json()

    expect(res.status()).toBe(404)
    expect(body.status).toBe('fail')
  })
})
