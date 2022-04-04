import { test, expect } from '@playwright/test'

test.describe('Create Tour ', () => {
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

  test('User with role "user" could not create a new tour', async ({
    request,
  }) => {
    const user = {
      email: 'lisa@example.com',
      password: 'test1234',
    }
    const loginReq = await request.post(`/api/v1/users/login`, {
      data: {
        email: user.email,
        password: user.password,
      },
    })

    const loginRes = await loginReq.json()
    const token = loginRes.token

    const tourCreationReq = await request.post(`/api/v1/tours`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: payload,
    })

    expect(tourCreationReq.status()).toBe(403)
  })

  test('User with role "guide" could not create a new tour', async ({
    request,
  }) => {
    const user = {
      email: 'ben@example.com',
      password: 'test1234',
    }
    const loginReq = await request.post(`/api/v1/users/login`, {
      data: {
        email: user.email,
        password: user.password,
      },
    })

    const loginRes = await loginReq.json()
    const token = loginRes.token

    const tourCreationReq = await request.post(`/api/v1/tours`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: payload,
    })

    expect(tourCreationReq.status()).toBe(403)
  })
})
