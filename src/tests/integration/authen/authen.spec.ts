import { test, expect } from '@playwright/test'
import { getUserByRole } from '../../fixtureHandler'
import { UserRoles } from '../../../typing/app.type'

test.describe('Authentication', () => {
  test.describe('Login', () => {
    const users = [
      getUserByRole('ADMIN'),
      getUserByRole('GUIDE'),
      getUserByRole('LEAD_GUIDE'),
      getUserByRole('USER'),
    ]

    for (const user of users) {
      test(`As ${user!.role} role, ${user!.name
        } could login with valid credential`, async ({ baseURL, request }) => {
          const res = await request.post(`${baseURL}/users/login`, {
            data: {
              email: user!.email,
              password: user!.password,
            },
          })
          const body = await res.json()

          expect(res.status()).toBe(200)
          expect(body.token.length).toBeGreaterThan(1)
          expect(body.data.currentUser.name).toBe(user!.name)
          expect(body.data.currentUser.email).toBe(user!.email)
          expect(body.data.currentUser.role).toBe(user!.role)
        })
    }

    test(`User "${users[3]!.name
      }" login failed because of invalid credential`, async ({
        baseURL,
        request,
      }) => {
      const res = await request.post(`${baseURL}/users/login`, {
        data: {
          email: users[3]!.email,
          password: 'invalid',
        },
      })
      expect(res.status()).toBe(401)
    })

    test(`User "${users[3]!.name
      }" login failed because of missing password`, async ({
        baseURL,
        request,
      }) => {
      const res = await request.post(`${baseURL}/users/login`, {
        data: {
          email: users[3]!.email,
        },
      })
      expect(res.status()).toBe(400)
    })
  })

  test.describe('Signup', () => {
    test('As a new client, I could create an account with default role as "user"', async ({
      baseURL,
      request,
    }) => {
      const newUser = {
        name: 'Tommy Road',
        email: 'tommy.road@natour.com',
        password: '12345678x@X',
        passwordConfirm: '12345678x@X',
      }
      const res = await request.post(`${baseURL}/users/signup`, {
        data: newUser,
      })
      const body = await res.json()

      expect(res.status()).toBe(201)
      expect(body.token.length).toBeGreaterThan(1)
      expect(body.data.currentUser.name).toBe(newUser.name)
      expect(body.data.currentUser.email).toBe(newUser.email)
      expect(body.data.currentUser.active).toBe(true)
      expect(body.data.currentUser.role).toBe('user')
    })

    test('As a new client, I could create an account with specific role', async ({
      baseURL,
      request,
    }) => {
      const newUser = {
        name: 'David Josh',
        email: 'dave.josh@natour.com',
        password: '12345678x@X',
        passwordConfirm: '12345678x@X',
        role: UserRoles.GUIDE,
      }
      const res = await request.post(`${baseURL}/users/signup`, {
        data: newUser,
      })
      const body = await res.json()

      expect(res.status()).toBe(201)
      expect(body.token.length).toBeGreaterThan(1)
      expect(body.data.currentUser.name).toBe(newUser.name)
      expect(body.data.currentUser.email).toBe(newUser.email)
      expect(body.data.currentUser.role).toBe(newUser.role)
    })

    test('As a new client, I could not create an account duplicated with existing one', async ({
      baseURL,
      request,
    }) => {
      const duplicatedUser = getUserByRole('USER')

      const res = await request.post(`${baseURL}/users/signup`, {
        data: duplicatedUser,
      })
      const body = await res.json()

      expect(res.status()).toBe(500)
      expect(body.status).toBe('error')
    })

    test('As a new client, I could not create an account if password and passwordConfirm are not the same as', async ({
      baseURL,
      request,
    }) => {
      const errorUser = {
        name: 'Patrick Tam',
        email: 'patrick.tam@natour.com',
        password: '12345678x@X',
        passwordConfirm: '12345678x@',
        role: UserRoles.LEAD_GUIDE,
      }

      const res = await request.post(`${baseURL}/users/signup`, {
        data: errorUser,
      })
      const body = await res.json()

      expect(res.status()).toBe(500)
      expect(body.status).toBe('error')
    })

    test('As a new client, I could not create an account because of missing email', async ({
      baseURL,
      request,
    }) => {
      const errorUser = {
        name: 'Patrick Tam',
        password: '12345678x@X',
        passwordConfirm: '12345678x@',
      }

      const res = await request.post(`${baseURL}/users/signup`, {
        data: errorUser,
      })
      const body = await res.json()

      expect(res.status()).toBe(500)
      expect(body.status).toBe('error')
    })

    test('As a new client, I could not create an account because of missing password', async ({
      baseURL,
      request,
    }) => {
      const errorUser = {
        name: 'Patrick Tam',
        email: 'patrick.tam@natour.com',
      }

      const res = await request.post(`${baseURL}/users/signup`, {
        data: errorUser,
      })
      const body = await res.json()

      expect(res.status()).toBe(500)
      expect(body.status).toBe('error')
    })

    test('As a new client, I could not create an account because of missing name', async ({
      baseURL,
      request,
    }) => {
      const errorUser = {
        email: 'patrick.tam@natour.com',
        password: '12345678x@X',
        passwordConfirm: '12345678x@',
      }

      const res = await request.post(`${baseURL}/users/signup`, {
        data: errorUser,
      })
      const body = await res.json()

      expect(res.status()).toBe(500)
      expect(body.status).toBe('error')
    })
  })
})
