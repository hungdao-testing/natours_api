1.  Lecture #127,

    [`this` works only on 'create and save', therefore could not work on update/delete](https://mongoosejs.com/docs/validation.html#update-validators-and-this)

2.  Lecture #129, the length of JWT_SECRET should be at least 32 chars

3.  Lecture #130, `Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client`
    If we called `next()` inside the if-block of the login function without `return`, which leads express understands that it could move to next line to send `res.json()`. Therefore, express send 2 responses to client that is the root-cause of the problem

4.  Lecture 131:
    https://mongoosejs.com/docs/api.html#query_Query-select
    By default, the `password` field is excluded by schema level (UserModel), to load it to do something, we apply the .`select("+ <fieldnName>")`

5.  Lecture 130:
    Instance methods:

    - https://stackoverflow.com/questions/42448372/typescript-mongoose-static-model-method-property-does-not-exist-on-type/45675548#45675548

    - https://github.com/Automattic/mongoose/issues/10358#issuecomment-861779692

6.  Lecture 132:
    a. `jwt.verify()` has 2 versions:

        - if callback function is supplied as parameter in the function => `jwt.verify()` is async

        - if callback function is NOT supplied as parameter in the function => `jwt.verify()` is sync

        Normally the `verify` function takes lots of time of verifying and could block the events if using the sync. Therefore, we choose the `async` version for the time of processing.

        
    To apply the async, we have 2 ways:

        a.1. Use promisify (read the doc Typescript.md -> section 2)
                ```ts

                    import type { VerifyOptions, Secret, JwtPayload } from 'jsonwebtoken';

                    const verifyToken = util.promisify<string, Secret,VerifyOptions | undefined, JwtPayload>(jwt.verify)(token, process.env.JWT_SECRET!, undefined);
        
                ```

        a.2. Use `Promise`
                ```js
                const verifyToken = (token: string, secret: string): Promise<string | JwtPayload> => {
                    return new Promise((resolve, reject) => {
                        jwt.verify(token, secret, (err, payload) => {
                            if (err) return reject(err);
                            return resolve(payload as (string | JwtPayload))
                        })
                    })
                }

                ```

    b. Business

        1. Getting token and check of it's existed in the request body

        2. Verification the token in the process of sign-verify circle

        3. Check if user still exists (make sure no one changes the user under back-end after system generates token previously)
        
        4. Check if user changed password after the token was issued by comparing jwt_token_time and changePasswordAt (on DB)

7. Lecture #135:

    a. Lecture summarization: https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065314#questions/16608090

    b. `const resetToken = crypto.randomBytes(36).toString('hex');` //create a new, temporary password for the user using node's crypto module.

    =>  This creates a 72 characters long, cryptographically strong (very random) password using hexadecimal encoding (numbers 0-9, letters A-F). Try running this in the terminal to understand the returned value: `node -e "console.log(require('crypto').randomBytes(4).toString('hex'));"`

    c. Notes: encrypted resetToken is stored in DB, the plain resetToken is used to send email to user.

8. Lecture #136:
    - Send plain-version of resetToken to user via email, and compare it with the encrypted-version of the resetToken under DB.

9. Lecture #137:
    1. ` this.passwordChangedAt = new Date(Date.now() - 1000);` sometimes, the time to generate JWT is a bit before setting `passwordChangeAt`, => causes the token is invalid because of comparision inside the function `methods.changePasswordAfter()`. Therefore, to make sure the time of updating passwordChangeAt is always before JWT, we minus (-1000: 1 second) as a trick way.


10. Lecture #138:
    - Why we don't use `findByIDAndUpdate()` but `findById()`?
    
        a. In the `UserModel.ts` the validator (userSchema) for passwordConfirm is applied to `Create and Save` process, NOT the update process.

11. Lecture #139
    - The business intention for FE part will be: update_password and update_user_profile are placed different screens => 2 API(s)

12. Lecture #130: 
    - Delete user means set it to inactive in DB