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
