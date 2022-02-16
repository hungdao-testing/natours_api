1. Lecture #114, no matter what inside the `next(<anything>)` => express understands `anything` is error, then it skips all middleware function
    and pass into the global handling error function.

2. Lecture #115: `Error.captureStackTrace(this [, func])` when specifying the `func` inside the `captureStackTrace` the trace_log would reach to the things inside `func`.
    
    - E.g. `Error.captureStackTrace(this, AppError.constructor)` => the stacktrace doesn't contain class `AppError`
    
    - Ref: https://stackoverflow.com/a/67073333