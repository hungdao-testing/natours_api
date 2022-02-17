export default class AppError extends Error {
    public status: string;
    public statusCode: number;
    public isOperational: boolean;


    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? "fail" : "error";
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}