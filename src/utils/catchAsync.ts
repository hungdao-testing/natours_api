import { NextFunction, Request, Response } from 'express'

export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    ;(fn(req, res, next) as Promise<Function>).catch(next)
  }
}
