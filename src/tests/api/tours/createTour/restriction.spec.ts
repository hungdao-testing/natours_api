import { test, expect } from '../tourFixture'

test.describe.parallel('Create Tour', () => {
  const payload = {
    name: '[QA] Sport Lover',
    duration: 14,
    maxGroupSize: 9,
    difficulty: 'easy',
    price: 2997,
    summary:
      'Surfing, skating, parajumping, rock climbing and more, all in one tour',
    imageCover: 'tour-1-cover.jpg',
    startLocation: {
      description: 'California, USA',
      type: 'Point',
      coordinates: [-118.803461, 34.006072],
      address: '29130 Cliffside Dr, Malibu, CA 90265, USA',
    },
  }

  test('User with role "user" could not create a new tour @restriction', async ({
    request,
    loginToken,
  }) => {
    const token = await loginToken('USER')

    const tourCreationReq = await request.post(`/api/v1/tours`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: payload,
    })

    expect(tourCreationReq.status()).toBe(403)
  })

  test('User with role "guide" could not create a new tour @restriction', async ({
    request,
    loginToken,
  }) => {
    const token = await loginToken('GUIDE')

    const tourCreationReq = await request.post(`/api/v1/tours`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: payload,
    })

    expect(tourCreationReq.status()).toBe(403)
  })
})
