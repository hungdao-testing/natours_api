import { test, expect } from '../tourFixture'
import fs from 'fs'
import path from 'path'

const invalidPayload = JSON.parse(
  fs.readFileSync(path.join(`${__dirname}`, '..', `invalidTourPayload.json`), {
    encoding: 'utf-8',
  }),
)

test.describe('Create Tour', () => {
  let token: string = ''
  let payload: unknown = {}

  test.beforeAll(async ({ loginToken }) => {
    token = await loginToken('LEAD_GUIDE')
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
