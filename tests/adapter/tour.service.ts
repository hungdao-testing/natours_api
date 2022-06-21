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

export async function updateTourService(
  request: APIRequestContext,
  data: { tourId: string; token: string; payload: unknown },
) {
  const updateTourRequest = await request.patch(`/api/v1/tours/${data.tourId}`, {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
    data: data.payload,
  })
  const body = await updateTourRequest.json()
  const status = updateTourRequest.status()

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

export async function getToursService(request: APIRequestContext, queryParam?: string) {
  let url = '/api/v1/tours'
  if (queryParam) {
    url = url + '?' + queryParam
  }
  const getToursRequest = await request.get(url)
  const body = await getToursRequest.json()
  const status = getToursRequest.status()

  return {
    statusCode: status,
    body,
  }
}

export async function getTourService(
  request: APIRequestContext,
  tourId: string,
  queryParam?: string,
) {
  let url = `/api/v1/tours/${tourId}`
  if (queryParam) {
    url = url + '?' + queryParam
  }
  const getToursRequest = await request.get(url)
  const body = await getToursRequest.json()
  const status = getToursRequest.status()

  return {
    statusCode: status,
    body,
  }
}

export async function getTopFiveCheapestTours(request: APIRequestContext, token: string) {
  let url = `/api/v1/tours/top-5-cheap`

  const getToursRequest = await request.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const body = await getToursRequest.json()
  const status = getToursRequest.status()

  return {
    statusCode: status,
    body,
  }
}

export async function getMonthlyPlanByYear(
  request: APIRequestContext,
  token: string,
  year: number,
) {
  let url = `/api/v1/tours/monthly-plan/${year}`

  const getToursRequest = await request.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const body = await getToursRequest.json()
  const status = getToursRequest.status()

  return {
    statusCode: status,
    body,
  }
}
