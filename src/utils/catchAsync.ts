import { NextFunction, Request, Response } from "express"
import AppError from "./appError"

export const catchAsync = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        (fn(req, res, next) as Promise<Function>).catch((err) => next(new AppError(err.message)))
    }
}



