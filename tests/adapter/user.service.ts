import { APIRequestContext } from '@playwright/test'

export async function createUserService(request: APIRequestContext, payload: unknown) {
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

export async function getUsersService(request: APIRequestContext, authToken: string) {
  const getUsersRequest = await request.get(`/api/v1/users`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  })
  const body = await getUsersRequest.json()
  const status = getUsersRequest.status()

  return {
    statusCode: status,
    body,
  }
}

export async function getUserService(
  request: APIRequestContext,
  authToken: string,
  userId: string,
) {
  const getUserRequest = await request.get(`/api/v1/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  })
  const body = await getUserRequest.json()
  const status = getUserRequest.status()

  return {
    statusCode: status,
    body,
  }
}

export async function updateMeService(
  request: APIRequestContext,
  authToken: string,
  formData: { [key: string]: string },
) {
  const updateMeReq = await request.patch(`/api/v1/users/updateMe`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    form: formData,
  })
  const body = await updateMeReq.json()
  const status = updateMeReq.status()

  return {
    statusCode: status,
    body,
  }
}

export async function confirmSignupService(request: APIRequestContext, confirmationCode: string) {
  const confirmSignupRequest = await request.get(`/api/v1/users/active/${confirmationCode}`)
  const body = await confirmSignupRequest.json()
  const status = confirmSignupRequest.status()

  return {
    statusCode: status,
    body,
  }
}
