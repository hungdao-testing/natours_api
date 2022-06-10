import { ITour, UserRoles } from '@app_type'
import { getTestUserByRole } from '@fixture_data/fixtureData'
import { expect, test as base } from '@playwright/test'
import { loginAs } from '@tests/adapter/authen.service'

interface ITourTestFixture {
    tourRestriction: (role: UserRoles.ADMIN | UserRoles.LEAD_GUIDE) => Promise<string>
    createTour: (token: string, payload: unknown) => Promise<{ status: number; data: ITour & { _id: string } }>
    deleteTour: (token: string, tourId: string) => Promise<void>
}

export const tourPW = base.extend<ITourTestFixture>({
    tourRestriction: async ({ request }, use) => {
        await use(async (role: UserRoles.ADMIN | UserRoles.LEAD_GUIDE) => {
            const user = getTestUserByRole(role)
            const token = await loginAs(
                {
                    email: user.email,
                    password: user.password,
                },
                request,
            )
            return token;
        })
    },

    createTour: async ({ request }, use) => {
        await use(async (token: string, payload: unknown) => {
            const tourCreationReq = await request.post(`/api/v1/tours`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: payload,
            })
            const body = await tourCreationReq.json()
            const status = tourCreationReq.status()
            const createdTour = body.data.tours;

            expect(status).toBe(201)
            expect(createdTour).toHaveProperty('_id')
            expect(createdTour._id.length).toBeGreaterThanOrEqual(24)

            return {
                status,
                data: createdTour,
            }
        })
    },

    deleteTour: async ({ request }, use) => {
        await use(async (token, tourId) => {
            const tourDeleteReq = await request.delete(`/api/v1/tours/${tourId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            const status = tourDeleteReq.status()
            expect(status).toBe(204)
        })
    },
})

export { expect } from '@playwright/test'
