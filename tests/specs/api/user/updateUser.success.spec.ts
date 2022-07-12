import { loginAs } from '@tests/adapter/authen.service'
import { updateMeService } from '@tests/adapter/user.service'
import { testPW, expect } from '@tests/helpers/testHelper'

testPW.describe.parallel('Update Users', () => {
  testPW.describe('By users themselves', () => {
    let user: { email: string; userId: string }
    testPW.beforeAll(async ({ createUserWithRolePWFixture }) => {
      user = await createUserWithRolePWFixture('USER')
    })

    testPW.describe('update profile', () => {
      testPW('Update name', async ({ request }) => {
        const token = await loginAs({ email: user.email, password: 'test1234' }, request)
        const updateNameReq = await updateMeService(request, token, { name: 'Alibaba TEST' })
        expect(updateNameReq.statusCode).toBe(200)
      })
      testPW.skip('Update avatar', () => {})
    })

    testPW.skip('reset password', () => {})

    testPW.skip('activate registration accounts', () => {})
  })

  testPW.describe.skip('By admin', () => {
    testPW('Promote user role', () => {})
  })
})
