import { APIRequestContext } from '@playwright/test'

export async function createTourService(
  request: APIRequestContext,
  data: { token: string; payload: unknown },
) {
  const createTourRequest = await request.post(`/api/v1/tours`, {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
    data: data.payload,
  })
  const body = await createTourRequest.json()
  const status = createTourRequest.status()

  return {
    statusCode: status,
    body,
  }
}

export async function deleteTourService(
  request: APIRequestContext,
  data: { token: string; tourId: string },
) {
  let body
  const tourDeleteReq = await request.delete(`/api/v1/tours/${data.tourId}`, {
    headers: { Authorization: `Bearer ${data.token}` },
  })
  const status = tourDeleteReq.status()
  if (status.toString().startsWith('2')) {
    body = ''
  } else {
    body = await tourDeleteReq.json()
  }
  return {
    statusCode: status,
    body,
  }
}
