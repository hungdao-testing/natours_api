import { ITour, IUser, UserRoles } from '@app_type'

import fs from 'fs'
import path from 'path'

export const parseTours: ITour[] = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'tours.test.json'), 'utf-8'),
)
export const parseUsers: IUser[] = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'users.test.json'), 'utf-8'),
)
// export const parseReviews: IReview[] = JSON.parse(
//   fs.readFileSync(path.join(__dirname, 'reviews.json'), 'utf-8'),
// )

export function getUserByRole(role: UserRoles) {
  return parseUsers.find(user => user.role === role)!;
}
