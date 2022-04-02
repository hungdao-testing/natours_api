import { test, expect, APIResponse } from '@playwright/test'
import { allure } from 'allure-playwright'
import jsonschema, { Schema } from 'jsonschema'
import _ from 'lodash'
import { getUserByRole } from '../../fixtureHelpers/userHelper'

const schemaValidator = new jsonschema.Validator()

test.describe('POST /signup', async () => {
  let res: APIResponse
  let body: any

  test.describe('Return 201 success code', () => {
    test('Response is correct format and data', async ({ request }) => {
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
                  active: { type: 'boolean' },
                  _id: { type: 'string' },
                },
                required: ['name', 'email', 'role', '_id', 'active'],
              },
            },
            required: ['currentUser'],
          },
        },
        required: ['status', 'token', 'data'],
      }
      const registerUser = {
        name: 'Patrick Tam',
        email: 'patrick.tam@natour.com',
        password: '12345678x@X',
        passwordConfirm: '12345678x@X',
        role: 'lead-guide',
      }

      res = await request.post(`/api/v1/users/signup`, {
        data: registerUser,
      })

      body = await res.json()

      expect(res.status()).toBe(201)
      expect(schemaValidator.validate(body, schema).valid).toBeTruthy()
      expect(body.data.currentUser).toHaveProperty('name', registerUser.name)
      expect(body.data.currentUser).toHaveProperty('email', registerUser.email)
      expect(body.data.currentUser).toHaveProperty('active', true)
    })

    test('Could create a new user without mentioning role', async ({
      request,
    }) => {
      const registerUser = {
        name: 'Joshua Lee',
        email: 'joshua.lee@natour.com',
        password: '12345678x@X',
        passwordConfirm: '12345678x@X',
      }

      res = await request.post(`/api/v1/users/signup`, {
        data: registerUser,
      })

      body = await res.json()

      expect(res.status()).toBe(201)
      expect(body.data.currentUser).toHaveProperty('role', 'user')
    })
  })

  test.describe('Error Handling', () => {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirm']

    for (const requiredField of requiredFields) {
      let registerUser = {
        name: 'Patrick Tam',
        email: 'patrick.tam@natour.com',
        password: '12345678x@X',
        passwordConfirm: '12345678x@X',
        role: 'user',
      }
      test(`Return 500 error code because of missing required field: ${requiredField}`, async ({
        request,
      }) => {
        let updatedUser = _.omit(registerUser, requiredField)
        res = await request.post(`/api/v1/users/signup`, {
          data: updatedUser,
        })

        body = await res.json()

        expect(res.status()).toBe(500)
      })
    }

    test('Return 500 error code because of mismatch password', async ({
      request,
    }) => {
      const registerUser = {
        name: 'Joshua Lee',
        email: 'joshua.lee@natour.com',
        password: '12345678x@X',
        passwordConfirm: '12345678x@',
      }

      res = await request.post(`/api/v1/users/signup`, {
        data: registerUser,
      })

      body = await res.json()

      expect(res.status()).toBe(500)
    })

    test('Return 500 error code because of duplicating with existing one', async ({
      request,
    }) => {
      const duplicatedUser = getUserByRole('GUIDE')

      res = await request.post(`/api/v1/users/signup`, {
        data: {
          name: 'David Lee',
          email: duplicatedUser!.email,
          password: '12345678x@X',
          passwordConfirm: '12345678x@',
        },
      })

      body = await res.json()

      expect(res.status()).toBe(500)
    })
  })
})
