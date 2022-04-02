import { test, expect } from '@playwright/test'
import { getUserByRole } from '../../fixtureHelpers/userHelper'
import _ from 'lodash'

test.skip('Tour', () => {
  const year = 2022
  const users = [
    { type: getUserByRole('ADMIN')!, isAccessable: true },
    { type: getUserByRole('GUIDE')!, isAccessable: true },
    { type: getUserByRole('LEAD_GUIDE')!, isAccessable: true },
    { type: getUserByRole('USER')!, isAccessable: false },
  ]

  test.describe('GET /monthly-plan', () => {
    for (const user of users) {
      test(`As a ${user.type.role}, my permission to acess the resource is ${user.isAccessable}`, async ({
        baseURL,
        request,
      }) => {
        //1. setup
        const loginReq = await request.post(`${baseURL}/users/login`, {
          data: {
            email: user.type.email,
            password: user.type.password,
          },
        })
        const body = await loginReq.json()

        //2. act
        const getMonthlyPlanReq = await request.get(
          `${baseURL}/tours/monthly-plan/${year}`,
          {
            headers: {
              Authorization: `Bearer ${body.token}`,
            },
          },
        )

        expect(getMonthlyPlanReq.ok()).toBe(user.isAccessable)
      })
    }

    test('The monthly statistic for tours happening in a year is correct', async ({
      baseURL,
      request,
    }) => {
      const loginReq = await request.post(`${baseURL}/users/login`, {
        data: {
          email: users[0].type.email,
          password: users[0].type.password,
        },
      })
      const body = await loginReq.json()

      //2. act
      const getMonthlyPlanReq = await request.get(
        `${baseURL}/tours/monthly-plan/${year}`,
        {
          headers: {
            Authorization: `Bearer ${body.token}`,
          },
        },
      )
      const monthlyRes = await getMonthlyPlanReq.json()
      const statistic: [
        { numToursStart: number; tours: string[]; month: number },
      ] = monthlyRes.data

      //3. assert
      expect(statistic).toHaveLength(5)

      const janMonth = statistic.find((el) => el.month === 1)
      expect(janMonth).toHaveProperty('numToursStart', 3)
      expect(janMonth).toHaveProperty('month', 1)
      expect(
        _.difference(janMonth!.tours, [
          'The Snow Adventurer',
          'The Star Gazer',
          'The Northern Lights',
        ]).length,
      ).toBe(0)

      const febMonth = statistic.find((el) => el.month === 2)
      expect(febMonth).toHaveProperty('numToursStart', 1)
      expect(febMonth).toHaveProperty('month', 2)
      expect(febMonth).toHaveProperty('tours', ['The Snow Adventurer'])

      const marMonth = statistic.find((el) => el.month === 3)
      expect(marMonth).toHaveProperty('numToursStart', 2)
      expect(marMonth).toHaveProperty('month', 3)
      expect(
        _.difference(marMonth!.tours, ['The Park Camper', 'The Sports Lover'])
          .length,
      ).toBe(0)

      const augMonth = statistic.find((el) => el.month === 8)
      expect(augMonth).toHaveProperty('numToursStart', 1)
      expect(augMonth).toHaveProperty('month', 8)
      expect(augMonth).toHaveProperty('tours', ['The Park Camper'])

      const decMonth = statistic.find((el) => el.month === 12)
      expect(decMonth).toHaveProperty('numToursStart', 1)
      expect(decMonth).toHaveProperty('month', 12)
      expect(decMonth).toHaveProperty('tours', ['The Northern Lights'])
    })

    test('The monthly plan statistic for tours not happening in a year is correct', async ({
      baseURL,
      request,
    }) => {
      const loginReq = await request.post(`${baseURL}/users/login`, {
        data: {
          email: users[0].type.email,
          password: users[0].type.password,
        },
      })
      const body = await loginReq.json()

      //2. act
      const getMonthlyPlanReq = await request.get(
        `${baseURL}/tours/monthly-plan/1900`,
        {
          headers: {
            Authorization: `Bearer ${body.token}`,
          },
        },
      )
      const monthlyRes = await getMonthlyPlanReq.json()
      const statistic = monthlyRes.data

      expect(statistic).toHaveLength(0)
    })
  })
})
