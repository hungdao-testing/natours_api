import mongoose from 'mongoose'
import { parseTours, parseUsers } from '../dev-data/data/parseFile'
import { IUser } from '../main/models/user.model'
import { UserRoles } from '../typing/app.type'

export function getUserByRole(role: keyof typeof UserRoles) {
  return parseUsers.find((el) => el.role === UserRoles[role].toLowerCase())
}

export function getTourGuidedBy(guideName: string) {
  const user = parseUsers.find(
    (el) =>
      (el.role === UserRoles.GUIDE || el.role === UserRoles.LEAD_GUIDE) &&
      el.name === guideName,
  )
  if (!user) console.log(`No tour guided by ${guideName}`)
  return parseTours.find((el) => el.guides.includes(user?._id))
}
