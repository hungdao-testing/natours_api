1. Lecture #127,   

    [`this` works only on 'create and save', therefore could not work on update/delete](https://mongoosejs.com/docs/validation.html#update-validators-and-this)

2. Lecture #129, the length of JWT_SECRET should be at least 32 chars

3. Lecture #130, `Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client`
    If we called `next()` inside the if-block of the login function without `return`, which leads express understands that it could move to next line to send `res.json()`. Therefore, express send 2 responses to client that is the root-cause of the problem

4. Lecture 131:
    https://mongoosejs.com/docs/api.html#query_Query-select
    By default, the `password` field is excluded by schema level (UserModel), to load it to do something, we apply the .`select("+ <fieldnName>")`

5. Lecture 130:
    Instance methods: 
    -   https://stackoverflow.com/questions/42448372/typescript-mongoose-static-model-method-property-does-not-exist-on-type/45675548#45675548
    
    -   https://github.com/Automattic/mongoose/issues/10358#issuecomment-861779692
