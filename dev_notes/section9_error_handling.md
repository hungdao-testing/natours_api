1. Lecture #114, no matter what inside the `next(<anything>)` => express understands `anything` is error, then it skips all middleware function
    and pass into the global handling error function.