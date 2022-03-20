import dotenv from 'dotenv'
import mongoose from 'mongoose'

export function connect() {
  dotenv.config({ path: './config.env' })
  const DB_URI = process.env.DB_CONN_STRING!.replace(
    '<PASSWORD>',
    process.env.DB_PASSWORD!,
  )
  mongoose.connect(DB_URI).then((conn) => {
    console.log('DB connection is established!')
  })
}
