import { deleteTourService } from '@tests/adapter/tour.service'
import { testPW, expect } from '@tests/helpers/testHelper'

testPW.describe.parallel('Delete tour', () => {
  testPW(`Could not delete a non-existing tour`, async ({ authenBy, request }) => {
    const token = await authenBy('LEAD-GUIDE')
    const nonExistingTourId = '507f1f77bcf86cd799439011'
    let deletedTour = await deleteTourService(request, { tourId: nonExistingTourId, token })
    expect(deletedTour.statusCode).toBe(404)
  })
})
