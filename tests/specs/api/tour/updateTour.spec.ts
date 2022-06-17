import { updateTourService } from '@tests/adapter/tour.service'
import { testPW, expect } from '@tests/helpers/testHelper'
import { getTourPayloadAsset } from '@tests/utils/fileManagement'

const tourPayloadAsset = getTourPayloadAsset()

testPW.describe.only('Update tour', () => {
    let token: string
    let payload = { ...tourPayloadAsset }
    let tourId: string

    testPW.describe('Update successfully', () => {
        testPW.beforeAll(async ({ authenBy }) => {
            token = await authenBy('ADMIN')
        })

        testPW.beforeEach(async ({ createTourPWFixture }, testInfo) => {
            payload['name'] = `[TEST-${testInfo.workerIndex}] Amazing Tour`
            const createdTour = await createTourPWFixture(token, payload)
            tourId = createdTour.data._id
        })

        testPW.afterEach(async ({ deleteTourPWFixture }) => {
            await deleteTourPWFixture(token, tourId)
        })

        testPW(`As an admin, I could update a tour with correct data format`, async ({ request }) => {
            //BUG: could not update tour because of price and priceDiscount validation
            payload['price'] = 2001
            payload['priceDiscount'] = 1500
            payload['ratings'] = 4.1
            const updatedTour = await updateTourService(request, { tourId, token, payload })
            expect(updatedTour.statusCode).toBe(201)
            expect(updatedTour.body.status).toBe('success')
            expect(updatedTour.body.tours.name).toBe(payload.name)
            expect(updatedTour.body.tours.price).toBe(2001)
            expect(updatedTour.body.tours.priceDiscount).toBe(1500)
            expect(updatedTour.body.tours.ratings).toBe(4.1)
        })
    })
})
