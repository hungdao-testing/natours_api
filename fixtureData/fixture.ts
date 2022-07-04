import { ITour, IUser, UserRoles } from '@app_type'
import fs from 'fs'
import path from 'path'

export const parseTours: ITour[] = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'tours.test.json'), 'utf-8'),
)
export const parseUsers: IUser[] = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'users.test.json'), 'utf-8'),
)

export function getTestUserByRole(role: keyof typeof UserRoles, isActive: boolean = true) {
  return parseUsers.find((user) => user.role === role.toString().toLowerCase() && user.active === isActive)!
}

export function getTestTourBy(condition: (...args: any[]) => boolean) {
  return parseTours.filter(condition).sort((a: ITour, b: ITour) => {
    if (a._id < b._id) return 1
    return -1
  })
}

export function filterTestToursByYear(year: number) {
  const by = (year: number) => (tour: ITour) =>
    tour.startDates.some((date) => new Date(date).getFullYear() === year)

  return getTestTourBy(by(year)).map((tour) => {
    const { name } = tour
    const months = tour.startDates
      .filter((el) => new Date(el).getFullYear() === year)
      .map((date) => new Date(date).getMonth() + 1)
    return { name, months }
  })
}

