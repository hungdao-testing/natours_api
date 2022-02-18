import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';
import mongoose from 'mongoose';


function handleCastErrorDB(err: mongoose.Error.CastError) {
    const message = `Invalid ${err.path}: ${err.value}.`
    return new AppError(message, 400)
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

export default function errorController(
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) {

    err.statusCode = err.statusCode;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);

    } else if (process.env.NODE_ENV === 'production') {
        let error = Object.create(err);

        if (error instanceof mongoose.Error.CastError) error = handleCastErrorDB(error);


        sendErrorProd(error, res);
    }
}


