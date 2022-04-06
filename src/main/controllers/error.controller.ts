import { NextFunction, Request, Response } from 'express'
import AppError from '../utils/appError'
import mongoose from 'mongoose'
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'

function handleCastErrorDB(err: mongoose.Error.CastError) {
  const message = `Invalid ${err.path}: ${err.value}.`
  return new AppError(message, 400)
}

function handleDuplicaFieldsDB(error: mongoose.Error) {
  if (!Object.getPrototypeOf(error).keyValue) {
    return new AppError(error.message, 400)
  }
  const errorField = Object.getPrototypeOf(error).keyValue
  const message = `The key '${Object.keys(
    errorField,
  )}' has duplicate value of: "${Object.values(
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

const sendErrorDev = (err: AppError, res: Response) => {
  if (!err.statusCode) err.statusCode = 500
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  })
}

const sendErrorProd = <T extends mongoose.Error & AppError>(
  err: T,
  res: Response,
) => {
  // Operational, trusted error: send message to client

  if (err.isOperational) {
    res.status(err.statusCode!).json({
      status: err.status,

      message: err.message,
    })
  }
  // Programming or other unknown error: dont leak detail
  else {
    console.error('ERROR: ', err)

    res.status(500).json({
      status: 'error',

      message: 'Something went wrong!!!',
    })
  }
}

export default function errorController(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let error = Object.create(err)
  error.statusCode = error.statusCode
  error.status = error.status || 'error'

  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'local'
  ) {
    sendErrorDev(error, res)
  } else if (process.env.NODE_ENV === 'production') {
    if (error instanceof mongoose.Error.CastError)
      error = handleCastErrorDB(error)

    if (Object.getPrototypeOf(error).code === 11000)
      error = handleDuplicaFieldsDB(error)

    if (error instanceof mongoose.Error.ValidationError)
      error = handleValidationErrorDB(error)

    if (error.name == 'JsonWebTokenError') error = handleJWTError(error)
    if (error.name == 'TokenExpiredError') error = handleJWTExpiredError(error)

    sendErrorProd(error, res)
  }
}
