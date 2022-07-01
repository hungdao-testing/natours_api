import pino from 'pino'
import pinoHttp from 'pino-http'

let transport
if (process.env.NODE_ENV !== 'production') {
  transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'pid,hostname',
      translateTime: true,
    },
    messageFormat: '{levelLabel} - {pid} - url:{req.url}',
  }
}
export const pinoLogger = pino({
  transport: transport,
})

export const httpLogger = pinoHttp({
  logger: pinoLogger,
  // Define a custom request id function
  genReqId: function (req) {
    return req.id
  },

  customLogLevel: function (req, res, err) {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn'
    } else if (res.statusCode >= 500 || err) {
      return 'error'
    } else if (res.statusCode >= 300 && res.statusCode < 400) {
      return 'silent'
    }
    return 'info'
  },

  // Define a custom success message
  customSuccessMessage: function (req, res) {
    if (res.statusCode === 404) {
      return 'resource not found'
    }
    return `${req.method} completed`
  },

  // Define a custom receive message
  customReceivedMessage: function (req, res) {
    return 'request received: ' + req.method
  },

  // Define a custom error message
  customErrorMessage: function (req, res, err) {
    return 'request errored with status code: ' + res.statusCode
  },

  // Override attribute keys for the log object
  customAttributeKeys: {
    req: 'request',
    res: 'response',
    err: 'error',
    responseTime: 'timeTaken',
  },
})
