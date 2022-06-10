import { ITour } from '@models/tour.model'
import { IUser } from '@models/user.model'
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
