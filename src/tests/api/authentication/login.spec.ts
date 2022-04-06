import { test, expect, APIResponse } from '@playwright/test'
import { getUserByRole } from '../../fixtureHelpers/userHelper'
import jsonschema, { Schema } from 'jsonschema'

const schemaValidator = new jsonschema.Validator()

test.describe('POST /login', async () => {
  test.describe('Return 200 success code', () => {
    let res: APIResponse
    let body: any

    test.beforeAll(async ({ request }) => {
      const adminUser = getUserByRole('ADMIN')!

      res = await request.post(`/api/v1/users/login`, {
        data: {
          email: adminUser.email,
          password: adminUser.password,
        },
      })

      body = await res.json()
    })

    test('Response format is returned as defined format', async () => {
      const schema: Schema = {
        id: 'loginResSchema',
        type: 'object',
        properties: {
          status: { type: 'string' },
          token: { type: 'string', minLength: 1 },
          data: {
            type: 'object',
            properties: {
              currentUser: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                  role: {
                    type: 'string',
                    enum: ['user', 'lead-guide', 'guide', 'admin'],
                  },
                  _id: { type: 'string' },
                },
                required: ['name', 'email', 'role', '_id'],
              },
            },
            required: ['currentUser'],
          },
        },
        required: ['status', 'token', 'data'],
      }

      expect(res.status()).toBe(200)
      expect(schemaValidator.validate(body, schema).valid).toBeTruthy()
    })

    test('Cookie is set jwt token', async () => {
      expect(res.headers()['set-cookie']).toContain(`jwt=${body.token}`)
    })
  })

  test.describe('Return Error code', () => {
    test('Return 401 error code with invalid credential', async ({
      request,
    }) => {
      const adminUser = getUserByRole('ADMIN')!

      const res = await request.post(`/api/v1/users/login`, {
        data: {
          email: adminUser.email,
          password: 'invalid pass',
        },
      })

      expect(res.status()).toBe(401)
    })

    test('Return 400 error code with missing password', async ({ request }) => {
      const adminUser = getUserByRole('ADMIN')!
      const res = await request.post(`/api/v1/users/login`, {
        data: {
          email: adminUser.email,
        },
      })

      expect(res.status()).toBe(400)
    })
  })
})
