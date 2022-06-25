## Natours Rest API project

### Business Concept:

The application is about `Booking Tour website`, it helps end-user to review and book designed tours.

The code/ideas of the application are following from the [Udemy course `Node.js, Express, MongoDB & More` (author: Jonas Schmedtmann)](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/). (Note that: I am student of the course )

### Technology information:

#### A. Framework and tool:

1. Programming language: Using Typescript is the main programming language at Back-end site, which is different from the original course.

2. Database: MongoDB, with database-driver is mongoose.

3. Rest-api framrwork: Express v4

4. View enginee: [`Pug` template](https://pugjs.org/)

5. Payment gateway: Stripe

6. Testing framework and tool: [Playwright](https://playwright.dev/)

7. Bundling tool: Using [Esbuild](https://esbuild.github.io/)

#### B. Design model: MVC

1. [Model folder](./src/models) is data-model of the business entities: `user`, `review`, `tour`, `booking`

2. [Controller folder](./src/controllers) is the business layer used to process logic of the application

3. [Views folder](./src/views) is the presentation layer used to render the UI interface to user, it consists `pug` files to HTML file

4. [Routes folder](./src/routes) is the routing of the rest-api services.

5. [Public folder](./src/public) is the folder containing static files as HTML/css/image files. It is used to integrated with the `views` folder.

### Testing

#### Instruction:

Using [Playwright](https://playwright.dev/) as Testing framework to perform integration testing (black-box approach) and UI test.

1. All test specs are placed under `./tests`

2. Playwright configuration is defined on file `playwright.config.ts`

3. To run the test

- Start the API server for the corresponding environment: ` npm run start:api:dev`

- Run the api test specs: `npm run test:api:dev`

- Run the UI test specs: TBD

#### Test Design:

[Playwright test case design approach and how to use it](https://github.com/hungdao-testing/natours_api/wiki/Testing)

### Production app:

- The application is deployed into the Heroku `https://natoursudemy.herokuapp.com/`

### How to use my-app at your site ?

1. Git clone my app
2. Go to folder `config` and replace the DB information in file `development.env`
3. To run at local:

- Run `npm run start:api:dev` to start api
- Run `npm run watch:js:dev` to start bundling js/html/css for dev env.
- Go to `localhost:3001` to open web page.

4. Data file is placed under `fixtureData`, run the api `POST localhost:3001/api/v1/test-data/create-fixture` to seed data, then use the account info on file `users.test.json`

### Limitation:

1. To reduce the cost, the mail-service is used at Dev environment is `mailtrap`. For the PROD, please use `Gmail` service and following the setup in here `https://stackoverflow.com/a/45479968` to know how to generate password
