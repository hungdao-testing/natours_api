1. Function overload issue:

   - Reference: https://github.com/microsoft/TypeScript/issues/26048

2. How to implement `verifyToken()` by using promification

```ts
import type { VerifyOptions, Secret, JwtPayload } from 'jsonwebtoken';

const verifyToken = util.promisify<
  string,
  Secret,
  VerifyOptions | undefined,
  JwtPayload
>(jwt.verify)(token, process.env.JWT_SECRET!, undefined);
```

Ref: https://stackoverflow.com/questions/44540022/is-there-any-way-to-inherit-method-signature-with-util-promisify-on-typescript/69684105#69684105
