import app from './app'
import * as db from './db'

process.on('uncaughtException', (err: Error) => {
  console.log('Uncaught Exception!!! -- Shuttting down')
  console.log(err.name, err.message)
  process.exit(1)
})

db.connect()

const port = process.env.PORT || 3000
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`)
})

process.on('unhandledRejection', (err: Error) => {
  console.log('Unhandle Rejection!!! -- Shuttting down')
  console.log(err.name, err.message)
  server.close(() => {
    process.exit(1)
  })
})
