import { NextFunction, Request, Response } from 'express'
import AppError from '@utils/appError'
import mongoose from 'mongoose'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import { pinoLogger } from '@utils/logger'

function handleCastErrorDB(err: mongoose.Error.CastError) {
  const message = `Invalid ${err.path}: ${err.value}.`
  return new AppError(message, 400)
}

function handleDuplicaFieldsDB(error: mongoose.Error.ValidationError) {
  if (!Object.getPrototypeOf(error).keyValue) {
    return new AppError(error.message, 400)
  }
  const errorField = Object.getPrototypeOf(error).keyValue
  const message = `The key '${Object.keys(errorField)}' has duplicate value of: "${Object.values(
    errorField,
  )}". Please use another value.`
  return new AppError(message, 400)
}

function handleValidationErrorDB(err: mongoose.Error.ValidationError) {
  const errors = Object.values(err.errors).map((el) => el.message)
  const message = `Invalid input data: ${errors.join('. ')}`
  return new AppError(message, 400)
}

function handleJWTError(err: JsonWebTokenError) {
  return new AppError('Invalid token, please login again', 401)
}

function handleJWTExpiredError(err: TokenExpiredError) {
  return new AppError('Your token is expired, please login again', 401)
}

const sendErrorDev = (err: AppError, req: Request, res: Response) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    })
  }

  // B) RENDERED WEBSITE
  pinoLogger.error('ERROR 💥', err)
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  })
}

const sendErrorProd = <T extends typeof mongoose.Error & AppError>(
  err: T,
  req: Request,
  res: Response,
) => {
  // Operational, trusted error: send message to client
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      })
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    pinoLogger.error('ERROR 💥', err)
    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    })
  }

  // B) RENDERED WEBSITE
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    pinoLogger.error(err)
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    })
  }
  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  pinoLogger.error('ERROR 💥', err)
  // 2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.',
  })
}

export default function errorController(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let error = Object.create(err)
  error.statusCode = error.statusCode || 500
  error.status = error.status || 'error'

  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'local') {
    sendErrorDev(error, req, res)
  } else if (process.env.NODE_ENV === 'production') {
    let err = { ...error }
    err.message = error.message

    if (err instanceof mongoose.Error.CastError) err = handleCastErrorDB(err)

    if (Object.getPrototypeOf(err).code === 11000) err = handleDuplicaFieldsDB(err)

    if (err instanceof mongoose.Error.ValidationError) err = handleValidationErrorDB(err)

    if (err.name == 'JsonWebTokenError') err = handleJWTError(err)
    if (err.name == 'TokenExpiredError') err = handleJWTExpiredError(err)

    sendErrorProd(err, req, res)
  }
}
