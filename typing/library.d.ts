declare module 'xss-clean' {
    import * as express from 'express'
    export default function xss(): (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) => void
}
