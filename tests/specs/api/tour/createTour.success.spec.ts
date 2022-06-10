import { UserRoles } from '@app_type'
import { getUserByRole } from '@fixture_data/fixtureData'
import { test, expect } from '@playwright/test'
import * as payload from "./tourPayload.json";

test.describe.skip('Create a tour', () => {
  test('As an admin, I could create a tour', async ({ request }) => {
    const adminUser = getUserByRole(UserRoles.ADMIN);

    const loginAsReq = await request.post('/api/v1/users/login', {
      data: {
        "email": adminUser.email,
        "password": "test1234"
      }
    })

    const loginAsRes = await loginAsReq.json();

    const createTourReq = await request.post(`/api/v1/tours`, {
      data: payload,
      headers: {
        'Authorization': `Bearer ${loginAsRes.token}`
      }
    })

    const createTourRes = await createTourReq.json();

    expect(createTourReq.status()).toBe([200, 201])


  })

  test('As a tour-lead, I could create a tour', () => { })
})
