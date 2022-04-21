import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { appConfig } from '../config/env.config'

const parseURI = () => {
  if (process.env.NODE_ENV === 'development') {
    dotenv.config({ path: appConfig.dev_env })
  } else if (process.env.NODE_ENV === 'local') {
    dotenv.config({ path: appConfig.local_env })
  } else if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: appConfig.prod_env })
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
