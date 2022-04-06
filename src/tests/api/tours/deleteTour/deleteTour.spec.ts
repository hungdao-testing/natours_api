import { test, expect } from '../tourFixture'

test.describe('Delete Tour', () => {
  let token: string = ''

  test.beforeEach(async ({ loginToken }) => {
    token = await loginToken('ADMIN')
  })

  test('Delete an existing tour successfully and return 204-code', async ({
    request,
    createTour,
  }) => {
    const { _id } = await createTour(token)
    const deletedTour = await request.delete(`/api/v1/tours/${_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    expect(deletedTour.status()).toBe(204)
  })

  test('Delete an non-existing tour and return 404-code', async ({
    request,
  }) => {
    const deletedTour = await request.delete(
      `/api/v1/tours/6249a41a41fc0363e6062407`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    expect(deletedTour.status()).toBe(404)
  })
})
