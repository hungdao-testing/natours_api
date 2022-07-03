import { UserRoles } from '@app_type'
import { createUserService } from '@tests/adapter/user.service'
import { testPW, expect, userPayloadBuilder } from '@tests/helpers/testHelper'

function commonAssertion(
    role: keyof typeof UserRoles,
    userRes: {
        statusCode: number
        body: any
    },
) {
    expect(userRes.statusCode).toBe(201)
    expect(userRes.body).toHaveProperty('status', 'success')
    expect(userRes.body).toHaveProperty('token')
    expect(userRes.body.data.currentUser).toHaveProperty('confirmationCode')
    expect(userRes.body.data.currentUser).toHaveProperty('role', UserRoles[role])
    expect(userRes.body.data.currentUser).toHaveProperty('photo', 'default.jpg')
    expect(userRes.body.data.currentUser).toHaveProperty('active', false)
    return true
}

testPW.describe('Signup Account', () => {
    testPW('for normal user without specifying the role', async ({ request }) => {
        const userPayload = userPayloadBuilder()
        const createUseReq = await createUserService(request, userPayload)
        expect(commonAssertion('USER', createUseReq)).toBeTruthy()
    })
    testPW('for tour guide', async ({ request }) => {
        const userPayload = userPayloadBuilder('GUIDE')
        const createUseReq = await createUserService(request, userPayload)
        expect(commonAssertion('GUIDE', createUseReq)).toBeTruthy()
    })
    testPW('for lead-tour guide', async ({ request }) => {
        const userPayload = userPayloadBuilder('LEAD-GUIDE')
        const createUseReq = await createUserService(request, userPayload)
        expect(commonAssertion('LEAD-GUIDE', createUseReq)).toBeTruthy()
    })
})
