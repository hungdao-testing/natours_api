import express from 'express';
import morgan from 'morgan';
import { default as globalErrorHandler } from './controllers/errorController';
import tourRouter from './routes/tourRoutes';
import userRouter from './routes/userRoutes';
import { ICustomRequestExpress } from './typing/types';
import AppError from './utils/appError';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';



const app = express();

// 1) GLOBAL MIDDLEWARES

// Set security HTTP Header
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Limit request from same API
const limiter = rateLimit({
    // 1IP is allowed to do max 100 reqs in 1 hour
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP, please try again in an hour!'
});

app.use('/api', limiter); // apply rate-limit to routes starts-with '/api'

// Body parser, reading data from body into req.body
app.use(express.json({limit: '10kb'})); // not allow data > 10kb to be passed into body

// Serving static file
app.use(express.static(`${__dirname}/public`));

// TEST middleware
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
