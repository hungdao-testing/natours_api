import express from 'express'
import morgan from 'morgan'
import tourRouter from '@routes/tour.routes'
import userRouter from '@routes/user.routes'
import reviewRouter from '@routes/review.routes'
import viewRouter from '@routes/view.routes'
import bookingRouter from '@routes/booking.routes'
import testRouter from '@routes/test.routes'
import { default as globalErrorHandler } from '@controllers/error.controller'
import { webhokCheckout } from '@controllers/booking.controller'
import { INextFunc, IRequest, IResponse } from 'typing/app.type'
import AppError from '@utils/appError'
import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import path from 'path'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'
import hpp from 'hpp'
import xss from 'xss-clean'
import { environment } from '@config/env.config'
import { httpLogger } from '@utils/logger'

const app = express()

const envName = environment.NODE_ENV || process.env.NODE_ENV

app.enable('trust proxy')

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// 1) GLOBAL MIDDLEWARES

// Implement CORS
app.use(cors())

// Serving static file
app.use(express.static(path.join(__dirname, 'public')))

// Set security HTTP Header
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        'default-src': ['self'],
        scriptSrc: [
          "'self'",
          'https://*.mapbox.com',
          'http:',
          'https://js.stripe.com',
          'https://bundle.js:*',
        ],
        workerSrc: ["'self'", 'data:', 'blob:', 'https://*.mapbox.com', 'https://bundle.js:*'],
        childSrc: ["'self'", 'blob:'],
        imgSrc: [
          "'self'",
          'data:',
          'blob:',
          'https://*.mapbox.com',
          'https://*.stripe.com',
          'https://bundle.js:*',
        ],
        'frame-src': [
          'self',
          'unsafe-inline',
          'data:',
          'blob:',
          'https://*.stripe.com',
          'https://*.mapbox.com',
          'https://*.cloudflare.com/',
          'https://bundle.js:*',
          'ws://localhost:*/',
          'ws://127.0.0.1:*/',
        ],
        connectSrc: [
          'https://*.mapbox.com',
          'https://bundle.js:*',
          'http://127.0.0.1:*/',
          'http://localhost:*/',
          'https://*.stripe.com',
          'https://*.herokuapp.com',
        ],
      },
    },
  }),
)

// Development logging
if (envName === 'development') {
  app.use(httpLogger)
}

// Limit request from same API
let limiter
if (envName !== 'production') {
  limiter = rateLimit({
    // 1IP is allowed to do max 100000 reqs in 1 hour
    max: 100000,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP, please try again in an hour!',
  })
} else {
  limiter = rateLimit({
    // 1IP is allowed to do max 100 reqs in 1 hour
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP, please try again in an hour!',
  })
}
app.use('/api', limiter) // apply rate-limit to routes starts-with '/api'

// the body of stripe checkout could not work on non-raw format.
// so we don't place this route after the `json()` middleware nor on a specific route file
// and it must be in raw format => express.raw()
app.post('/webhook-checkout', express.raw({ type: 'application/json' }), webhokCheckout)

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })) // not allow data > 10kb to be passed into body
app.use(cookieParser())

// Data sanitization against NOSQL query
app.use(mongoSanitize())

// Data sanitization against XSS
app.use(xss())

// Prevent parameter pollution
app.use(
  hpp(
    {
      whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price',
      ],
    }, //allow duplicated fields `duration` on query params
  ),
) // e.g. remove duplicated fields in query params

app.use(compression())

app.use((req: IRequest, res: IResponse, next: INextFunc) => {
  req.requestTime = new Date().toISOString()
  next()
})

//3 ROUTES
app.use('/', viewRouter)
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/bookings', bookingRouter)

if (envName !== 'production') {
  app.use('/api/v1/test-data', testRouter)
}

app.all('*', (req: IRequest, res: IResponse, next: INextFunc) => {
  const err = new AppError(`Could not find ${req.originalUrl} on this server !`, 404)
  next(err)
})

app.use(globalErrorHandler)

export default app
