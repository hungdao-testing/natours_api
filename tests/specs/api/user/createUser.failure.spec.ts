import { createUserService } from '@tests/adapter/user.service'
import { testPW, expect, userPayloadBuilder } from '@tests/helpers/testHelper'

function assertFailureBy(
    message: string,
    userRes: {
        statusCode: number
        body: any
    },
) {
    expect(userRes.statusCode).toBe(500)
    expect(userRes.body).toHaveProperty('status', 'error')
    expect(userRes.body).toHaveProperty('message')
    expect(userRes.body.message).toContain(message)

    return true
}

testPW.describe('Signup Account', () => {
    testPW('failed becasuse the password is not matched to confirm password', async ({ request }) => {
        const userPayload = userPayloadBuilder();
        userPayload.passwordConfirm = "mismatch password"
        const createUseReq = await createUserService(request, userPayload)
        expect(assertFailureBy('Password are not the same as', createUseReq)).toBeTruthy()
    })

    testPW('failed becasuse the specified role is not in the supported list', async ({ request }) => {
        const userPayload = userPayloadBuilder('ADMIN1');
        const createUseReq = await createUserService(request, userPayload)
        expect(assertFailureBy('The input role is not matched to supported list', createUseReq)).toBeTruthy()
    })

    testPW('failed becasuse duplicated to the existing email', async ({ request }) => {
        const userPayload = userPayloadBuilder('USER');
        userPayload.email = 'admin@natours.io'
        const createUseReq = await createUserService(request, userPayload)
        expect(assertFailureBy('There was a duplicate user information', createUseReq)).toBeTruthy()
    })

    testPW('failed becasuse password length is less than 8', async ({ request }) => {
        const userPayload = userPayloadBuilder('USER');
        userPayload.password = '1234567'
        userPayload.passwordConfirm = '1234567'
        const createUseReq = await createUserService(request, userPayload)
        expect(assertFailureBy('The min length is at least 8 chars', createUseReq)).toBeTruthy()
    })
})
