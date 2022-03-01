import express from 'express';
import morgan from 'morgan';
import { default as globalErrorHandler } from './controllers/errorController';
import tourRouter from './routes/tourRoutes';
import userRouter from './routes/userRoutes';
import { ICustomRequestExpress } from './typing/types';
import AppError from './utils/appError';
import { rateLimit } from 'express-rate-limit';

const app = express();

// 1) GLOBAL MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const limiter = rateLimit({
    // 1IP is allowed to do max 100 reqs in 1 hour
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP, please try again in an hour!'
});

app.use('/api', limiter); // apply rate-limit to routes starts-with '/api'

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use(
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log('Hello from the middleware 👋');
        next();
    }
);

app.use(
    (
        req: ICustomRequestExpress,
        res: express.Response,
        next: express.NextFunction
    ) => {
        req.requestTime = new Date().toISOString();
        next();
    }
);

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all(
    '*',
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const err = new AppError(
            `Could not find ${req.originalUrl} on this server !`,
            404
        );
        next(err);
    }
);

app.use(globalErrorHandler);

export default app;
