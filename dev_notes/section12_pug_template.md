## 1. Mapbox

```ts
app.use(
  helmet({
    // <~ fix error NotSameOriginAfterDefaultedToSameOriginByCoep 200
    crossOriginEmbedderPolicy: false, 

    // <~ fix error CSP
    contentSecurityPolicy: {  
      directives: {
        scriptSrc: ["'self'", 'https://*.mapbox.com'],
        workerSrc: ["'self'", 'data:', 'blob:'],
        childSrc: ["'self'", 'blob:'],
        imgSrc: ["'self'", 'data:', 'blob:'],
        connectSrc: [
          'https://*.tiles.mapbox.com',
          'https://api.mapbox.com',
          'https://events.mapbox.com',
        ],
      },
    },
  }),
)
```

Issue: `mapboxgpl is not defined`
Ref: https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065656#questions/12944004

=> declare `script(defer src=`/js/mapbox.js`)` on `tour.pug`, note that the keyword `defer` 

Issue: `net::ERR_BLOCKED_BY_CLIENT` happens on some ad-block-browser as Brave, double-check on other, if it didn't happen, so ignore it.

## 2. Lecture 191

Issue related to `Parcel`
https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065664#questions/13541164