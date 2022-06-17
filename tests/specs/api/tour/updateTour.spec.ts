import { testPW, expect } from '@tests/helpers/testHelper'
import { getTourPayloadAsset } from '@tests/utils/fileManagement'


const tourPayloadAsset = getTourPayloadAsset()

testPW.describe('Update tour', () => {

    let token: string;
    let payload = { ...tourPayloadAsset }
    let tourId: string;

    testPW.describe('Update successfully', () => {

        testPW.beforeAll(async ({ authenBy }) => {
            token = await authenBy('ADMIN')
        })

        testPW.beforeEach(async ({ createTourPWFixture }, testInfo) => {
            payload['name'] = `[TEST-${testInfo.workerIndex}] Amazing Tour`
            const createdTour = await createTourPWFixture(token, payload);
            tourId = createdTour.data._id
        })

        testPW.afterEach(async ({ deleteTourPWFixture }) => {
            await deleteTourPWFixture(token, tourId)
        })

        testPW(
            `As an admin, I could update a tour with correct data format`,
            async ({ createTourPWFixture, authenBy }) => {
                

            },
        )
    })
})
