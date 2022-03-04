1. Lecture #153: `populate` creates a new query => affect to performance

2. Lecture #155: there are 2 ids (`id` and `_id`) displaying on the response, the reason is we are using the virtual property on the Review Model

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