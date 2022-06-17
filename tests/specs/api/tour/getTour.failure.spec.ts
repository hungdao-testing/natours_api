import { getMonthlyPlanByYear, getTourService } from '@tests/adapter/tour.service'
import { expect, testPW } from '@tests/helpers/testHelper'

testPW.describe.parallel('Get tours @smoke', () => {
  testPW('A client with role "USER" could not get monthly-plan', async ({ authenBy, request }) => {
    const token = await authenBy('USER')
    const tours = await getMonthlyPlanByYear(request, token, 2022)

    expect(tours.statusCode).toBe(403)
    expect(tours.body.status).toBe('fail')
    expect(tours.body.message).toBe('You do not have permission to perform this action')
  })

  testPW.describe('A client could not find an non-existing tour', () => {
    testPW('Find a non-existing tour with correct id format', async ({ request }) => {
      const tours = await getTourService(request, '5c88fa8cf4afda39709c295b')
      expect(tours.statusCode).toBe(404)
      expect(tours.body.status).toBe('fail')
    })
    testPW('Find a non-existing tour with incorrect id format', async ({ request }) => {
      const tours = await getTourService(request, 'invalidId')
      expect(tours.statusCode).toBe(500)
    })
  })
})
