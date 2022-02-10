## Mongo DB

1. Schema vs Interface:
   https://mongoosejs.com/docs/typescript/schemas.html

2. As the lecture #94, we need to exclude the query params which are not belong to schema to prevent DB returning wrong result. But, in the latest version, Mongoose will do it for us
   Udemy: https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065086#questions/16342802
   Mongoose: https://mongoosejs.com/docs/tutorials/query_casting.html#the-strictquery-option

3. Lecture #95, in case to query the MongoDb with operator (>=, <=, >, <), the API client (e.g Postman) needs to pass input with `<field>[gte|lte|gt|lt]` (e.g. duration[gte]=5 , means duration >= 5 )

4. Lecture #97, sort=-[prop] (`-` means sorting descendant )
   https://stackoverflow.com/questions/49760024/why-mongodb-sort-by-id-is-much-faster-than-sort-by-any-other-indexed-field

5. Lecture #98, `query.select(-[field])`, here `-` (minus) is excluding (defining in tourController)
   https://mongoosejs.com/docs/api.html#query_Query-select
   Or, we could exclude a prop in schema by adding prop `select:false`

6. Lecture #100, in `Tour Router` file, if we place the `top-5-cheap` router below the router `:id`, it  will  cause error
   https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065098#questions/9204676
   Notes: there is still not clear the reason