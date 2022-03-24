import { test, expect } from '@playwright/test'
import _ from 'lodash'
import { parseTours } from '../../../dev-data/data/parseFile'
import { ITour } from '../../../main/models/tour.model'

test.describe('Tour', () => {
  test.describe('Get /tours', () => {
    test('Return all tours without query params', async ({
      baseURL,
      request,
    }) => {
      const res = await request.get(`${baseURL}/tours`)
      const body = await res.json()
      const { tours } = body

      expect(res.status()).toBe(200)
      expect(tours.length).toBe(parseTours.length)
    })

    test('Return tours matched with query params', async ({
      baseURL,
      request,
    }) => {
      const res = await request.get(
        `${baseURL}/tours?price[lt]=1000&ratingsAverage[gte]=4.7`,
      )
      const body = await res.json()

      const { tours } = body
      expect(res.status()).toBe(200)
      expect(tours.length).toBe(2)

      tours.forEach((el: ITour) => {
        expect(['The Forest Hiker', 'The Sea Explorer']).toContain(el.name)
      })
    })
  })
})
