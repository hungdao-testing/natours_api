import { APIRequestContext } from '@playwright/test'

export async function createUserService(
    request: APIRequestContext,
    payload: unknown
) {
    const createTourRequest = await request.post(`/api/v1/users/signup`, {
        data: payload,
    })
    const body = await createTourRequest.json()
    const status = createTourRequest.status()

    return {
        statusCode: status,
        body,
    }
}