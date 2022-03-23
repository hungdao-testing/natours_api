import fs from 'fs'
import { IReview } from '../../main/models/review.model'
import { ITour } from '../../main/models/tour.model'
import { IUser } from '../../main/models/user.model'

export const parseTours: ITour[] = JSON.parse(
  fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'),
)
export const parseUsers: IUser[] = JSON.parse(
  fs.readFileSync(`${__dirname}/new_users.json`, 'utf-8'),
)
export const parseReviews: IReview[] = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'),
)
