import { test, expect } from '../tourFixture'

test.describe('Delete Tour', () => {
  const tourId = '5c88fa8cf4afda39709c295a'

  test('User with role "user" could not delete a tour @restriction', async ({
    request,
    loginToken,
  }) => {
    const token = await loginToken('USER')

    const tourDeleteReq = await request.delete(`/api/v1/tours/${tourId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const status = tourDeleteReq.status()
    expect(status).toBe(403)
  })

  test('User with role "guide" could not delete a tour @restriction', async ({
    request,
    loginToken,
  }) => {
    const token = await loginToken('GUIDE')

    const tourDeleteReq = await request.delete(`/api/v1/tours/${tourId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const status = tourDeleteReq.status()
    expect(status).toBe(403)
  })
})
