import { APIRequestContext } from '@playwright/test'

export async function loginAs(
  userInfo: { email: string; password: string },
  request: APIRequestContext,
) {
  const login = await request.post(`/api/v1/users/login`, {
    data: userInfo,
  })
  const resp = await login.json()
  if (resp?.token) return resp.token
  return 'No token generated'
}
