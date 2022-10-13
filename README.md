## ExpressJS Tutorial

Express video tutorials created by *Anson the Developer* on [YouTube](https://www.youtube.com/playlist?list=PL_cUvD4qzbkxZZyyuXa1xkWFhRB_NoQwl).

[2022 Playlist](https://www.youtube.com/playlist?list=PL_cUvD4qzbkwp6pxx27pqgohrsP8v1Wj2) featuring MongoDB, Mongoosh, Session MongoStore.

[GitHub Code](https://github.com/stuyy/expressjs-tutorial/tree/1df72f5e4f1717b803482600adf048ab9e743a5d)

### Project Setup

1. Initialize package.json file: `npm init -y`
2. Install express: `npm i express`
3. Start backend server: 
    * `node app.js`
    * `nodemon app.js` (`npm i nodemon` first) 
    * add `"start": "nodemon app"` in package.json scripts, then run `npm start`

### MySQL Setup

1. Download MySQL from Oracle official website to local desktop (username: `root`, password: `nekomimi`)
2. `export PATH=${PATH}:/usr/local/mysql/bin`
3. `mysql -u root -p` (`root` is username), enter password when prompted
4. `SHOW DATABASES;`
5. `CREATE DATABASE SampleApp;`
6. `USE SampleApp;`
7. `CREATE TABLE USERS (username VARCHAR(255), password VARCHAR(255));`
8. `SHOW TABLES;`
9. `DESCRIBE USERS;`
10. `select * from users;`
11. `DELETE from users;`

### Test Suite

* [Postman Collection Link](https://www.getpostman.com/collections/bbf291a26bd7a5b6660d)
* Test Login:
    1. Create db schema in local MySQL, and use `user-mysql` POST method to add the user object to db
    2. Test `login-passportJS` POST method, expect 200 response and a cookie generated, see the session stored in local memory printed in terminal
    3. Change password or username in request body and test again, expected 401 unauthorized
    4. Test the protected route `user-mysql` GET, expect 200 if user is logged in, otherwise 403
    5. Note: restart server / session expire will require auth again

### Notes
1. Extract middleware functions to middleware.js, call next() for customized middlewares. Always define middlewares before routes
2. Export route not route()
3. req properties:
    * `req.params`: route parameter (localhost:3000/user/jack, jack is a route param)
    * `req.query`: query parameter (localhost:3000/user?username=jack, jack is a query param)
    * use destructuring syntax to extract data: `const { title } = req.query;`
4. 401 Unauthorized is the status code to return when the client provides no credentials or invalid credentials. 403 Forbidden is the status code to return when a client has valid credentials but not enough privileges to perform an action on a resource.
5. How cookies work in login:
    * User enters username and password in frontend, click login button
    * A request sent to server, server generates unique session ID and send back to client
    * Client stores the cookie, and every subsequent request made to server will send the HTTP cookie in req headers
    * The server receives request, middleware functions parse cookies, and check on server side which user this cookie belongs to
    * Server then sends back a response after performing business logic

### Links
1. [express-session params](https://stackoverflow.com/questions/40381401/when-to-use-saveuninitialized-and-resave-in-express-session)
2. [Use express-session in React](https://stackoverflow.com/questions/62375329/display-express-session-data-in-react)
3. [express-session with PassportJS](https://www.passportjs.org/concepts/authentication/sessions/)

*Ruichen Zhang*

Oct 13, 2022
