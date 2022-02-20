import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';
import mongoose from 'mongoose';

function handleCastErrorDB(err: mongoose.Error.CastError) {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
}

function handleDuplicaFieldsDB(error: mongoose.Error) {
    if (!Object.getPrototypeOf(error).keyValue) {
        return new AppError(error.message, 400);
    }
    const errorField = Object.getPrototypeOf(error).keyValue;
    const message = `The key '${Object.keys(
        errorField
    )}' has duplicate value of: "${Object.values(
        errorField
    )}". Please use another value.`;
    return new AppError(message, 400);
}

const sendErrorDev = (err: AppError, res: Response) => {
    res.status(err.statusCode!).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err: AppError, res: Response) => {
    // Operational, trusted error: send message to client

    if (err.isOperational) {
        res.status(err.statusCode!).json({
            status: err.status,

            message: err.message
        });
    }
    // Programming or other unknown error: dont leak detail
    else {
        console.error('ERROR: ', err);

        res.status(500).json({
            status: 'error',

            message: 'Something went wrong!!!'
        });
    }
};

export default function errorController<T extends Error>(
    err: T,
    req: Request,
    res: Response,
    next: NextFunction
) {
    let error = Object.create(err);
    error.statusCode = error.statusCode;
    error.status = error.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(error, res);
    } else if (process.env.NODE_ENV === 'production') {
        if (error instanceof mongoose.Error.CastError)
            error = handleCastErrorDB(error);
        if (Object.getPrototypeOf(error).code === 11000)
            error = handleDuplicaFieldsDB(error);

        sendErrorProd(error, res);
    }
}
