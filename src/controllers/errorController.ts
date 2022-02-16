import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";

export default function errorController(err: AppError, req: Request, res: Response, next: NextFunction) {
    err.statusCode = err.statusCode;
    err.status = err.status || 'error';
    res.status(err.statusCode!).json({
        status: err.status,
        message: err.message
    })
}