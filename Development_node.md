## Mongo DB

1. Schema vs Interface:
   https://mongoosejs.com/docs/typescript/schemas.html

2. As the lecture #94, we need to exclude the query params which are not belong to schema to prevent DB returning wrong result. But, in the latest version, Mongoose will do it for us
   Udemy: https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065086#questions/16342802
   Mongoose: https://mongoosejs.com/docs/tutorials/query_casting.html#the-strictquery-option

3. Lecture #95, in case to query the MongoDb with operator (>=, <=, >, <), the API client (e.g Postman) needs to pass input with `<field>[gte|lte|gt|lt]` (e.g. duration[gte]=5 , means duration >= 5 )

4. Lecture #97, sort=-[prop] (`-` means sorting descendant )
https://stackoverflow.com/questions/49760024/why-mongodb-sort-by-id-is-much-faster-than-sort-by-any-other-indexed-field

