import mongoose from 'mongoose'
import { environment } from '@config/env.config'

const parseURI = () => {
  const DB_URI = environment.DB_CONN_STRING!.replace('<PASSWORD>', environment.DB_PASSWORD!)

  return DB_URI
}
export function connect() {
  const DB_URI = parseURI()
  mongoose.connect(DB_URI).then((conn) => {
    console.log('DB connection is established!')
  })
}
