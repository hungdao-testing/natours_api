import express from 'express';
import morgan from 'morgan';
import { default as globalErrorHandler } from './controllers/errorController';
import tourRouter from './routes/tourRoutes';
import userRouter from './routes/userRoutes';
import { ICustomRequestExpress } from './typing/customExpress';
import AppError from './utils/appError';

const app = express();


// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log('Hello from the middleware 👋');
    next();
});


app.use((req: ICustomRequestExpress, res: express.Response, next: express.NextFunction) => {
    req.requestTime = new Date().toISOString();
    next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all("*", (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const err = new AppError(`Could not find ${req.originalUrl} on this server !`, 404);
    next(err);
});


app.use(globalErrorHandler);

export default app;
