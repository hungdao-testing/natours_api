import { APIRequestContext } from '@playwright/test'

export async function createUserService(
    request: APIRequestContext,
    payload: unknown
) {
    const createUserRequest = await request.post(`/api/v1/users/signup`, {
        data: payload,
    })
    const body = await createUserRequest.json()
    const status = createUserRequest.status()

    return {
        statusCode: status,
        body,
    }
}

export async function getUsers(
    request: APIRequestContext,
    authToken: string
) {
    const getUsersRequest = await request.get(`/api/v1/users`, {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
    const body = await getUsersRequest.json()
    const status = getUsersRequest.status()

    return {
        statusCode: status,
        body,
    }
}

export async function getUser(
    request: APIRequestContext,
    authToken: string,
    userId: string
) {
    const getUserRequest = await request.get(`/api/v1/users/${userId}`, {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
    const body = await getUserRequest.json()
    const status = getUserRequest.status()

    return {
        statusCode: status,
        body,
    }
}