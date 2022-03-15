1.  Lecture #153: `populate` creates a new query => affect to performance

2.  Lecture #155: there are 2 ids (`id` and `_id`) displaying on the response, the reason is we are using the virtual property on the Review Model

        ```ts
        {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        }
        ```

    To not load the `id` prop, using the follow code

```ts
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
}
```

Ref:

    - https://mongoosejs.com/docs/guide.html#id

    - https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15080942#questions/8350690

3. Lecture #159: `const router = express.Router({mergeParams: true})` => `mergeParams: true` means merge all params passing from other routes.

E.g. `const router = express.Router({mergeParams: true})` in reviewRouter.ts.

If the tourRouter configs `router.use('/:tourId/reviews', reviewRouter);`, then the the params as `/tour/1223435/reviews` will forward to reviewRouter and its params is merged to

```ts
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('USER'),
    reviewController.createReview,
  )
```

4. Lecture #165.

```ts
// all routes below this line will be applied `protect`
router.use(authController.protect)
```

All routers below the `router.use(authController.protect);` will be automatically used `protect()`

5. Lecture #167: Improving reading database by indexes

a. To check the execution statistic, calling `explain()` method in the query `const docs = await features.query.explain()` (file: `handleFactory.controller.ts`) => then calling corresponding api => get the statistic.

  e.g. 

```ts
        ....
        "executionStats": {
            "executionSuccess": true,
            "nReturned": 3,
            "executionTimeMillis": 0,
            "totalKeysExamined": 3,
            "totalDocsExamined": 3,
        ....
```

b. 
- Typically, the `_id` is used to index the documents; therefore, if we filter/get based on a prop which is not `_id`, the MongoDB will scan all docs in a collection => the performance is bad.

e.g. `{{url}}/api/v1/tours?price[lt]=1000` => get docs with price >= 1000 => scan all docs (so far is 9)

To reduce the query time, we apply `indexing` for prop `price` by setting `tourSchema.index({ price: 1 });`, where: 

  - `price` is the prop we want to index
  - `1` is one of IndexOption, 1 - ascending sort

Runnning again `{{url}}/api/v1/tours?price[lt]=1000` => get docs with price >= 1000 => scan only 3 docs