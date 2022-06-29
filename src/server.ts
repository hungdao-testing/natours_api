import app from './app'
import * as db from './db'
import { environment } from '@config/env.config'
import { pinoLogger } from '@utils/logger'

const port = environment.PORT || process.env.PORT || 3000

process.on('uncaughtException', (err: Error) => {
  pinoLogger.info('Uncaught Exception!!! -- Shuttting down')
  pinoLogger.error(err.name, err.message)
  process.exit(1)
})

db.connect()

const server = app.listen(port, () => {
  pinoLogger.info(`App running on port ${port}...`)
})

process.on('unhandledRejection', (err: Error) => {
  pinoLogger.info('Unhandle Rejection!!! -- Shuttting down')
  pinoLogger.error(err.name, err.message)
  server.close(() => {
    process.exit(1)
  })
})

process.on('SIGTERM', () => {
  pinoLogger.error('SIGTERM RECEIVED. Shutting down gracefully')
  server.close(() => {
    pinoLogger.error('Process terminated!')
  })
})
