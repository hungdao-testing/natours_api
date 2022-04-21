import { test, expect } from '../tourFixture'
import jsonschema, { Schema } from 'jsonschema'
import _ from 'lodash'
import { filterToursByYear } from '../../../utils/tourHelper'

const schemaValidator = new jsonschema.Validator()

test.describe.parallel('Get Monthly Plan', () => {
  const year = 2022
  const expectedTours = filterToursByYear(year)

  const schema: Schema = {
    id: 'getToursSchema',
    type: 'object',
    properties: {
      status: { type: 'string' },
      data: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            numToursStart: { type: 'number' },
            month: { type: 'number', minimum: 1, maximum: 12 },
            tours: { type: 'array', items: { type: 'string' } },
          },
          required: ['numToursStart', 'month', 'tours'],
        },
      },
    },
    required: ['status', 'data'],
  }

  test('Verify respone schema', async ({ request, loginToken }) => {
    const token = await loginToken('ADMIN')
    const monthlyPlan = await request.get(
      `/api/v1/tours/monthly-plan/${year}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    const monthlyPlanBody = await monthlyPlan.json()
    expect(monthlyPlan.status()).toBe(200)
    expect(
      schemaValidator.validate(monthlyPlanBody, schema, {
        nestedErrors: true,
      }).valid,
    ).toBeTruthy()
  })

  test('Verify response returns correct data', async ({
    request,
    loginToken,
  }) => {
    const token = await loginToken('LEAD_GUIDE')
    const monthlyPlan = await request.get(
      `/api/v1/tours/monthly-plan/${year}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    const monthlyPlanBody = await monthlyPlan.json()
    const toursByMonth = expectedTours.filter(
      (el) => monthlyPlanBody.data[0].month === el.month,
    )

    toursByMonth.forEach((el) => {
      expect(monthlyPlanBody.data[0].tours).toContain(el.name)
    })
    ;(
      monthlyPlanBody.data as {
        name: string
        month: string
        tours: string[]
      }[]
    ).forEach((el) => {
      expect(Object.keys(_.groupBy(expectedTours, 'month'))).toContain(
        el.month.toString(),
      )
    })
  })
})
