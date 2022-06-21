import { getTourService } from '@tests/adapter/tour.service'
import { expect, testPW } from '@tests/helpers/testHelper'

testPW.describe('Get tours @smoke', () => {
  testPW('Could not find a non-existing tour', async ({ request }) => {
    const tours = await getTourService(request, '5c88fa8cf4afda39709c295b')
    expect(tours.statusCode).toBe(404)
    expect(tours.body.status).toBe('fail')
  })
})
