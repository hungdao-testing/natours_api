import express from 'express';
import morgan from 'morgan';
import tourRouter from './routes/tourRoutes';
import userRouter from './routes/userRoutes';

const app = express();

class CustomError extends Error {
    public message: string;
    public status: string;
    public statusCode?: number;

    constructor(message: string, status: string, statusCode: number = 500) {
        super();
        this.message = message;
        this.status = status;
        this.statusCode = statusCode
    }
}

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

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    req.requestTime = new Date().toISOString();
    next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all("*", (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Could not find ${req.originalUrl} on this server !`
    // })
    const err = new CustomError(`Could not find ${req.originalUrl} on this server !`, 'fail');

    next(err);
});


app.use((err: CustomError, req: express.Request, res: express.Response, next: express.NextFunction) => {
    err.statusCode = err.statusCode;
    err.status = err.status || 'error';
    res.status(err.statusCode!).json({
        status: err.status,
        message: err.message
    })
})

export default app;