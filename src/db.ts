import mongoose from 'mongoose'
import { environment } from '@config/env.config'
import { pinoLogger } from '@utils/logger'

const dbUrl = environment.DB_CONN_STRING! || process.env.DB_CONN_STRING!
const dbPassword = environment.DB_PASSWORD! || process.env.DB_PASSWORD!

const parseURI = () => {
  const DB_URI = dbUrl.replace('<PASSWORD>', dbPassword)

  return DB_URI
}
export function connect() {
  const DB_URI = parseURI()
  mongoose.connect(DB_URI).then((conn) => {
    pinoLogger.info('DB connection is established!')
  })
}
