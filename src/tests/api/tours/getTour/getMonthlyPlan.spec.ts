import { test, expect, APIResponse } from '@playwright/test'
import jsonschema, { Schema } from 'jsonschema'
import _ from 'lodash'
import { filterToursByYear } from '../../../fixtureHelpers/tourHelper'
import { getUserByRole } from '../../../fixtureHelpers/userHelper'

const schemaValidator = new jsonschema.Validator()

test.describe('Get Monthly Plan', () => {
  const year = 2022
  const expectedTours = filterToursByYear(year)

  test('Verify only roles "GUIDE, ADMIN, LEAD_GUIDE" could access the api resource', async ({
    request,
  }) => {
    const users = [
      { role: getUserByRole('ADMIN')!, isAccessable: true },
      { role: getUserByRole('GUIDE')!, isAccessable: true },
      { role: getUserByRole('LEAD_GUIDE')!, isAccessable: true },
      { role: getUserByRole('USER')!, isAccessable: false },
    ]
    for (const user of users) {
      const loginReq = await request.post(`/api/v1/users/login`, {
        data: {
          email: user.role.email,
          password: user.role.password,
        },
      })

      const loginRes = await loginReq.json()

      const monthlyPlan = await request.get(
        `/api/v1/tours/monthly-plan/${year}`,
        {
          headers: {
            Authorization: `Bearer ${loginRes.token}`,
          },
        },
      )

      expect(monthlyPlan.ok()).toBe(user.isAccessable)
    }
  })

  test.describe('Response data', () => {
    let monthlyPlan: APIResponse
    let monthlyPlanBody: any

    test.beforeEach(async ({ request }) => {
      const adminPermission = await request.post(`/api/v1/users/login`, {
        data: {
          email: getUserByRole('ADMIN')!.email,
          password: getUserByRole('ADMIN')!.password,
        },
      })

      const loginRes = await adminPermission.json()

      monthlyPlan = await request.get(`/api/v1/tours/monthly-plan/${year}`, {
        headers: {
          Authorization: `Bearer ${loginRes.token}`,
        },
      })
      monthlyPlanBody = await monthlyPlan.json()
    })

    test('Verify respone schema', async () => {
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

      expect(monthlyPlan.status()).toBe(200)
      expect(
        schemaValidator.validate(monthlyPlanBody, schema, {
          nestedErrors: true,
        }).valid,
      ).toBeTruthy()
    })

    test('Verify response returns correct data', async () => {
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
})
