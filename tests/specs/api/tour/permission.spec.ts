import { ITour } from '@app_type'
import {
  createTourService,
  deleteTourService,
  getMonthlyPlanByYear,
  getToursService,
  updateTourService,
} from '@tests/adapter/tour.service'
import { testPW, expect, tourPayloadBuilder } from '@tests/helpers/testHelper'

function isUserCouldNotDo(req: { statusCode: number; body: any }) {
  expect(req.statusCode).toBe(403)
  expect(req.body.status).toBe('fail')
  expect(req.body.message).toContain(`You do not have permission to perform this action`)
  return true
}

testPW.describe.parallel('Tour Permission', () => {
  const payload = tourPayloadBuilder()

  testPW.describe('As a regular user', () => {
    let authToken: string
    let tours: ITour[]

    testPW.beforeAll(async ({ request, authenBy }) => {
      authToken = await authenBy('USER')
      const getTourReq = await getToursService(request)
      tours = getTourReq.body.tours
    })

    testPW(`I could not create a tour`, async ({ request }) => {
      const createdTour = await createTourService(request, {
        token: authToken,
        payload,
      })
      expect(createdTour.statusCode).toBe(403)
      expect(createdTour.body.status).toBe('fail')
    })
    testPW(`I could not delete tour`, async ({ request }) => {
      const deletedTourReq = await deleteTourService(request, {
        tourId: tours[0]._id,
        token: authToken,
      })

      expect(isUserCouldNotDo(deletedTourReq)).toBeTruthy()
    })

    testPW(`I could not update tour `, async ({ request }) => {
      payload['price'] = 2001

      const updateTourReq = await updateTourService(request, {
        tourId: tours[0]._id,
        token: authToken,
        payload,
      })
      expect(isUserCouldNotDo(updateTourReq)).toBeTruthy()
    })

    testPW('I could not get monthly-plan', async ({ request }) => {
      const getMonthlyTours = await getMonthlyPlanByYear(request, authToken, 2022)

      expect(isUserCouldNotDo(getMonthlyTours)).toBeTruthy()
    })
  })

  testPW.describe('As a guide user', () => {
    let authToken: string = ''
    let tours: ITour[]

    testPW.beforeAll(async ({ request, authenBy }) => {
      authToken = await authenBy('GUIDE')
      const getTourReq = await getToursService(request)
      tours = getTourReq.body.tours
    })

    testPW(`I could not create a tour`, async ({ request }) => {
      const createdTourReq = await createTourService(request, {
        token: authToken,
        payload,
      })
      expect(isUserCouldNotDo(createdTourReq)).toBeTruthy()
    })
    testPW(`I could not delete tour`, async ({ request }) => {
      const deletedTourReq = await deleteTourService(request, {
        tourId: tours[0]._id,
        token: authToken,
      })
      expect(isUserCouldNotDo(deletedTourReq)).toBeTruthy()
    })

    testPW(`I could not update tour `, async ({ request }) => {
      payload['price'] = 2001

      const updateTourReq = await updateTourService(request, {
        tourId: tours[1]._id,
        token: authToken,
        payload,
      })
      expect(isUserCouldNotDo(updateTourReq)).toBeTruthy()
    })
  })
})
