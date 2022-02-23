import { NextFunction, Request, Response } from 'express';
import { UserModel } from '../models/userModel';
import { catchAsync } from '../utils/catchAsync';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError';


const signToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN!
    })
};


export const signup = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const newUser = await UserModel.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        });

        const token = signToken(newUser._id);

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser
            }
        });
    }
);

export const login = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;

        // 1) Check email or password is existed in request body
        if (!email || !password) {
            return next(new AppError('Please provide email and password', 400));
        }

        // 2) Check user is existed && password is correct on DB
        //https://mongoosejs.com/docs/api.html#query_Query-select
        // By default, the `password` field is excluded by schema level (UserModel), to load it to do something, we
        // user the .select("+ <fieldnName>")
        const user = await UserModel.findOne({ email }).select('+password');

        if (!user || !(await user.correctPassword(password, user.password))) {
            return next(new AppError('Incorrect email or password', 401));
        }

        // 3) send token
        const token = signToken(user._id);

        res.status(200).json({
            status: 'success',
            token: token
        });
    }
);

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    // 1. Getting token and check of it's existed
    let token: string = '';
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please login to get access', 401))
    }
    // 2. Verification the token

    // 3. Check if user still exists

    // 4. Check if user changed password after the token was issued


    next()
})