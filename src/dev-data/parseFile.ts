import fs from 'fs'
import path from 'path'
import { IReview } from '../main/models/review.model'
import { ITour } from '../main/models/tour.model'
import { IUser } from '../main/models/user.model'

const prefixPath = path.join(__dirname, '../..', "data")
export const parseTours: ITour[] = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../..', "data", "tours.json"), 'utf-8'),
)
export const parseUsers: IUser[] = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../..', "data", "new_users.json"), 'utf-8'),
)
export const parseReviews: IReview[] = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../..', "data", "reviews.json"), 'utf-8'),
)

console.log(`${prefixPath}/tours.json`)