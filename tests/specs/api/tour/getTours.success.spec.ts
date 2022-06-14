import { ITour } from '@app_type'
import { getTestTourBy } from '@fixture'
import { getTopFiveCheapestTours as getTopFiveTours, getTourService, getToursService } from '@tests/adapter/tour.service'
import { testPW, expect } from '@tests/helpers/testHelper'

testPW.describe('Get tours', () => {
  testPW.describe('Get tours without query params', () => {
    const userRoles = ['ADMIN', 'LEAD-GUIDE', 'GUIDE'] as const
    for (const role of userRoles) {
      testPW(`As an ${role.toString()}, I could get all tours`, async ({ request, authenBy }) => {
        const token = await authenBy(role)

        const tours = await getToursService(request, token)
        expect(tours.statusCode).toBe(200)
        expect(tours.body.status).toBe('success')
        expect(tours.body.results).toBe(tours.body.tours.length)
      })
    }
  })

  testPW.describe('Filter tours', () => {
    let token: string

    testPW.beforeAll(async ({ authenBy }) => {
      token = await authenBy('ADMIN')
    })

    testPW('Filter tours by price > 500', async ({ request }) => {
      const priceGreaterThan500 = (tour: ITour) => tour.price > 500
      const testDataTour = getTestTourBy(priceGreaterThan500)

      const tours = await getToursService(request, token, 'price[gt]=500')
      expect(tours.statusCode).toBe(200)
      expect(tours.body.status).toBe('success')
      const actualTourData = tours.body.tours as ITour[]
      for (let i = 0; i < actualTourData.length; i++) {
        expect(actualTourData[i].name).toBe(testDataTour[i].name)
        expect(actualTourData[i].price).toBe(testDataTour[i].price)
        expect(actualTourData[i].price).toBeGreaterThan(500)
      }
    })

    testPW('Filter tours by rating average < 5', async ({ request }) => {
      const ratingAverageLessThan5 = (tour: ITour) => tour.ratingsAverage! < 5
      const testDataTour = getTestTourBy(ratingAverageLessThan5)

      const tours = await getToursService(request, token, 'ratingsAverage[lt]=5')
      expect(tours.statusCode).toBe(200)
      expect(tours.body.status).toBe('success')
      const actualTourData = tours.body.tours as ITour[]
      for (let i = 0; i < actualTourData.length; i++) {
        expect(actualTourData[i].name).toBe(testDataTour[i].name)
        expect(actualTourData[i].ratingsAverage).toBe(testDataTour[i].ratingsAverage)
        expect(actualTourData[i].ratingsAverage).toBeLessThan(5)
      }
    })

    testPW('Limit fields to be displayed', async ({ request }) => {
      const fieldsNotBeDisplayed = '-name,-price'
      const tours = await getToursService(request, token, `fields=${fieldsNotBeDisplayed}`)
      expect(tours.statusCode).toBe(200)
      expect(tours.body.status).toBe('success')
      expect(tours.body.tours[0]).not.toHaveProperty('name')
      expect(tours.body.tours[0]).not.toHaveProperty('price')
    })
  })

  testPW.describe('Pagination', () => {
    let token: string

    testPW.beforeAll(async ({ authenBy }) => {
      token = await authenBy('LEAD-GUIDE')
    })

    testPW('The number tour per page is less than total tours', async ({ request }) => {
      const toursPerPage = 2
      const testDataTour = getTestTourBy(() => true)

      const toursOnFirstPage = await getToursService(request, token, `limit=${toursPerPage}&page=1`)
      let expectedTourPerPage =
        testDataTour.length <= toursPerPage === true ? testDataTour.length : toursPerPage
      expect(toursOnFirstPage.statusCode).toBe(200)
      expect(toursOnFirstPage.body.status).toBe('success')
      expect(toursOnFirstPage.body.tours.length).toBeLessThanOrEqual(expectedTourPerPage)

      const toursOnSecondPage = await getToursService(
        request,
        token,
        `limit=${toursPerPage}&page=2`,
      )
      expectedTourPerPage = testDataTour.length - expectedTourPerPage
      expect(toursOnSecondPage.statusCode).toBe(200)
      expect(toursOnSecondPage.body.status).toBe('success')
      expect(toursOnSecondPage.body.tours.length).toBeLessThanOrEqual(expectedTourPerPage)
    })
    testPW('The number tour per page is greater than total tours', async ({ request }) => {
      const toursPerPage = 4
      const testDataTour = getTestTourBy(() => true)

      const toursOnFirstPage = await getToursService(request, token, `limit=${toursPerPage}&page=1`)
      let expectedTourPerPage =
        testDataTour.length <= toursPerPage === true ? testDataTour.length : toursPerPage
      expect(toursOnFirstPage.statusCode).toBe(200)
      expect(toursOnFirstPage.body.status).toBe('success')
      expect(toursOnFirstPage.body.tours.length).toBeLessThanOrEqual(expectedTourPerPage)

      const toursOnSecondPage = await getToursService(
        request,
        token,
        `limit=${toursPerPage}&page=2`,
      )
      expectedTourPerPage = testDataTour.length - expectedTourPerPage
      expect(toursOnSecondPage.statusCode).toBe(200)
      expect(toursOnSecondPage.body.status).toBe('success')
      expect(toursOnSecondPage.body.tours.length).toBeLessThanOrEqual(expectedTourPerPage)
    })
  })

  testPW.describe('Get specific tour', () => {
    const tourData = getTestTourBy(() => true)[0]
    testPW.describe('Get tour without query params', () => {
      const userRoles = ['ADMIN', 'LEAD-GUIDE', 'GUIDE'] as const

      for (const role of userRoles) {
        testPW(
          `As an ${role.toString()}, I could get detail for a tour ${tourData.name}`,
          async ({ request, authenBy }) => {
            const token = await authenBy(role)

            const tours = await getTourService(request, token, tourData._id)
            expect(tours.statusCode).toBe(200)
            expect(tours.body.status).toBe('success')
            expect(tours.body.tours.name).toBe(tourData.name)
            expect(tours.body.tours.price).toBe(tourData.price)
          },
        )
      }
    })
  })

  testPW('Get top five cheapest tours', async ({ request, authenBy }) => {
    const token = await authenBy('ADMIN')
    const top5CheapestTours = getTestTourBy(() => true).sort((tourOne, tourTwo) => {
      if (tourOne.ratingsAverage! < tourTwo.ratingsAverage!) return 1
      if (tourOne.price < tourTwo.price) return -1
      return -1
    }).splice(0, 5)

    const tours = await getTopFiveTours(request, token)

    expect(tours.statusCode).toBe(200)
    expect(tours.body.status).toBe('success')
    for (let i = 0; i < tours.body.tours.length; i++) {
      expect(tours.body.tours[i].name).toBe(top5CheapestTours[i].name)
    }

  })
})
