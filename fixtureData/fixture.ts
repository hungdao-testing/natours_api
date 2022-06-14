import { ITour, IUser, UserRoles } from '@app_type'

import fs from 'fs'
import path from 'path'

export const parseTours: ITour[] = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'tours.test.json'), 'utf-8'),
)
export const parseUsers: IUser[] = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'users.test.json'), 'utf-8'),
)

export function getTestUserByRole(role: keyof typeof UserRoles) {
  return parseUsers.find((user) => user.role === role.toString().toLowerCase())!
}

export function getTestTourBy(conditions: (...args: any[]) => boolean) {
  return parseTours.filter(conditions).sort((a: ITour, b: ITour) => {
    if (a._id < b._id) return 1
    return -1
  })
}
