import { test, expect } from '../tourFixture'

test.describe('Get Tour ', () => {
  test.describe('Get Monthly Plan', () => {
    test('User with role "user" could not get data @restriction', async ({
      request,
      loginToken,
    }) => {
      const year = 2022
      const token = await loginToken('USER')
      const monthlyPlan = await request.get(
        `/api/v1/tours/monthly-plan/${year}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      expect(monthlyPlan.status()).toBe(403)
    })
  })
})
