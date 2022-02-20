import { NextFunction, Request, Response } from 'express';
import { UserModel } from '../models/userModel';
import { catchAsync } from '../utils/catchAsync';


export const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await UserModel.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            user: newUser
        }
    })
})