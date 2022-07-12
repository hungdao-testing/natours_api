import { getUserService, getUsersService } from '@tests/adapter/user.service'
import { testPW, expect } from '@tests/helpers/testHelper'

function assertFailedBy(message: string, userRes: { statusCode: number; body: any }) {
  expect(userRes.body).toHaveProperty('status', 'fail')
  expect(userRes.body).toHaveProperty('message', message)

  return true
}

testPW.describe.parallel('Get all users', () => {
  testPW.describe('Not by current logged-in user', () => {
    testPW('is failed because of guide-user permission', async ({ request, authenBy }) => {
      const token = await authenBy('GUIDE')
      const users = await getUsersService(request, token)
      expect(users.statusCode).toBe(403)
      expect(
        assertFailedBy('You do not have permission to perform this action', users),
      ).toBeTruthy()
    })

    testPW('is failed because of lead-guide-user permission', async ({ request, authenBy }) => {
      const token = await authenBy('LEAD-GUIDE')
      const users = await getUsersService(request, token)
      expect(users.statusCode).toBe(403)
      expect(
        assertFailedBy('You do not have permission to perform this action', users),
      ).toBeTruthy()
    })

    testPW('is failed because of regular-user permission', async ({ request, authenBy }) => {
      const token = await authenBy('USER')
      const users = await getUsersService(request, token)
      expect(users.statusCode).toBe(403)
      expect(
        assertFailedBy('You do not have permission to perform this action', users),
      ).toBeTruthy()
    })

    testPW(
      'is failed because the request is calling to non-existing user',
      async ({ request, authenBy }) => {
        const token = await authenBy('ADMIN')
        const nonExistingUserId = '62c179517e5bc3bb475bfc79'
        const users = await getUserService(request, token, nonExistingUserId)
        expect(users.statusCode).toBe(404)
        expect(assertFailedBy('No users found with the passing ID', users)).toBeTruthy()
      },
    )
  })

  testPW.describe('By current logged-in user', () => {})
})
