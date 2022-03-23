import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { config } from '../config/config'

const parseURI = () => {
  if (process.env.NODE_ENV === 'development') {
    dotenv.config({ path: config.dev_env })
  } else if (process.env.NODE_ENV === 'local') {
    dotenv.config({ path: config.local_env })
  }

  const DB_URI = process.env.DB_CONN_STRING!.replace(
    '<PASSWORD>',
    process.env.DB_PASSWORD!,
  )

  return DB_URI
}
export function connect() {
  const DB_URI = parseURI()
  mongoose.connect(DB_URI).then((conn) => {
    console.log('DB connection is established!')
  })
}
