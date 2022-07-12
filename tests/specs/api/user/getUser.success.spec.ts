import { getTestUserByRole } from '@fixture'
import { getUserService, getUsersService } from '@tests/adapter/user.service'
import { testPW, expect } from '@tests/helpers/testHelper'

function commonAssertion(userRes: { statusCode: number; body: any }) {
  expect(userRes.statusCode).toBe(200)
  expect(userRes.body).toHaveProperty('status', 'success')
  expect(userRes.body).toHaveProperty('users')

  return true
}

testPW.describe.parallel('Get Users', () => {
  testPW.describe('By admin', () => {
    testPW('could get all users', async ({ request, authenBy }) => {
      const token = await authenBy('ADMIN')
      const inactiveUser = getTestUserByRole('USER')
      const users = await getUsersService(request, token)

      expect(commonAssertion(users)).toBeTruthy()
      expect(users.body).toHaveProperty('results')
      expect(users.body.users[0]).toHaveProperty('_id')
      expect(users.body.users[0]).toHaveProperty('name')
      expect(users.body.users[0]).toHaveProperty('email')
      expect(users.body.users[0]).toHaveProperty('photo')
      expect(users.body.users[0]).toHaveProperty('role')
      expect(users.body.users).not.toContain(inactiveUser.name)
    })

    testPW('could get detail active user info', async ({ request, authenBy }) => {
      const token = await authenBy('ADMIN')
      const guideUser = getTestUserByRole('GUIDE')
      const userReq = await getUserService(request, token, guideUser._id)

      expect(commonAssertion(userReq)).toBeTruthy()
      expect(userReq.body.users).toHaveProperty('_id', guideUser._id)
      expect(userReq.body.users).toHaveProperty('name', guideUser.name)
      expect(userReq.body.users).toHaveProperty('email', guideUser.email)
      expect(userReq.body.users).toHaveProperty('photo', guideUser.photo)
      expect(userReq.body.users).toHaveProperty('role', guideUser.role)
    })

    testPW('could get detail inactive user info', async ({ request, authenBy }) => {
      const token = await authenBy('ADMIN')
      const inactiveUser = getTestUserByRole('USER', false)
      const userReq = await getUserService(request, token, inactiveUser._id)

      expect(commonAssertion(userReq)).toBeTruthy()
      expect(userReq.body.users).toHaveProperty('_id', inactiveUser._id)
      expect(userReq.body.users).toHaveProperty('name', inactiveUser.name)
      expect(userReq.body.users).toHaveProperty('email', inactiveUser.email)
      expect(userReq.body.users).toHaveProperty('photo', inactiveUser.photo)
      expect(userReq.body.users).toHaveProperty('role', inactiveUser.role)
    })
  })

  testPW.describe('By current logged-in user', () => {})
})
