import { deleteTourService, getTourService, getToursService } from '@tests/adapter/tour.service'
import { testPW, expect } from '@tests/helpers/testHelper'
import { getTourPayloadAsset } from '@tests/utils/fileManagement'

const tourPayloadAsset = getTourPayloadAsset()

testPW.describe.parallel('Delete tour', () => {
  let token: string
  let payload = { ...tourPayloadAsset }
  let tourId: string

  testPW.describe('Delete for an existing tour', () => {
    testPW.beforeAll(async ({ authenBy }) => {
      token = await authenBy('ADMIN')
    })

    testPW.beforeEach(async ({ createTourPWFixture }, testInfo) => {
      payload['name'] = `[TEST-DELETE-${testInfo.workerIndex}] Amazing Tour`
      const createdTour = await createTourPWFixture(token, payload)
      tourId = createdTour.data._id
    })

    testPW(`As an admin, I could delete an existing tour`, async ({ request }) => {
      let deletedTour = await deleteTourService(request, { tourId, token })
      expect(deletedTour.statusCode).toBe(204)

      const getTourReq = await getTourService(request, tourId)
      expect(getTourReq.statusCode).toBe(404)
    })
  })

  testPW.describe('Delete for a non-existing tour', () => {
    testPW.beforeAll(async ({ authenBy }) => {
      token = await authenBy('ADMIN')
    })

    testPW(`As an admin, I could not delete a non-existing tour`, async ({ request }) => {
      const nonExistingTourId = '62ac91d8fa28cc4ed687aa8c'
      let deletedTour = await deleteTourService(request, { tourId: nonExistingTourId, token })
      expect(deletedTour.statusCode).toBe(404)
    })

    testPW(
      `As an admin, I could not delete a tour with incorrect tourId format`,
      async ({ request }) => {
        const nonExistingTourId = 'invalidFormat'
        let deletedTour = await deleteTourService(request, { tourId: nonExistingTourId, token })
        expect(deletedTour.statusCode).toBe(500)
      },
    )
  })

  testPW.describe.parallel('Permission', () => {
    let token: string
    let tourId: string

    testPW.beforeAll(async ({ request }) => {
      const tours = await getToursService(request)
      tourId = tours.body.tours[0]._id
    })

    testPW(
      `As a guide, I could not delete tour because of my permisson`,
      async ({ authenBy, request }) => {
        token = await authenBy('GUIDE')

        const deletedTourReq = await deleteTourService(request, { tourId, token })
        expect(deletedTourReq.statusCode).toBe(403)
        expect(deletedTourReq.body.status).toBe('fail')
        expect(deletedTourReq.body.message).toContain(
          `You do not have permission to perform this action`,
        )
      },
    )

    testPW(
      `As a end-user, I could not delete tour because of my permisson`,
      async ({ authenBy, request }) => {
        token = await authenBy('USER')

        const deletedTourReq = await deleteTourService(request, { tourId, token })
        expect(deletedTourReq.statusCode).toBe(403)
        expect(deletedTourReq.body.status).toBe('fail')
        expect(deletedTourReq.body.message).toContain(
          `You do not have permission to perform this action`,
        )
      },
    )
  })
})
