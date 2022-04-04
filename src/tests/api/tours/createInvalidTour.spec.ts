import { test, expect } from '@playwright/test'
import _ from 'lodash'
import fs from 'fs'

const invalidPayload = JSON.parse(
  fs.readFileSync(`${__dirname}/invalidTourPayload.json`, {
    encoding: 'utf-8',
  }),
)

test.describe('Create Tour', () => {
  const guideUser = {
    role: 'LEAD_GUIDE',
    email: 'miyah@example.com',
    password: 'test1234',
  }
  let token: string = ''
  let payload: unknown = {}

  test.beforeAll(async ({ request }) => {
    const loginReq = await request.post(`/api/v1/users/login`, {
      data: {
        email: guideUser.email,
        password: guideUser.password,
      },
    })

    const loginRes = await loginReq.json()
    token = loginRes.token
  })

  for (const fixture of invalidPayload) {
    test.describe('Error handling', () => {
      test.beforeEach(async () => {
        payload = fixture.payload
      })

      test(`Return error ${fixture.expected_result.response_code} because of ${fixture.case}`, async ({
        request,
      }) => {
        const tourCreationReq = await request.post(`/api/v1/tours`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: payload,
        })
        expect(tourCreationReq.status()).toBe(
          fixture.expected_result.response_code,
        )
      })
    })
  }
})
