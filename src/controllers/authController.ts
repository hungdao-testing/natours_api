import { NextFunction, Request, Response } from 'express';
import { UserModel } from '../models/userModel';
import { catchAsync } from '../utils/catchAsync';
import jwt from 'jsonwebtoken';

export const signup = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const newUser = await UserModel.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        });

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET!, {
            expiresIn: process.env.JWT_EXPIRES_IN!
        });

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser
            }
        });
    }
);
