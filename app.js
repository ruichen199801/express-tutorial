const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session'); // session stored in db, take care of parsing cookies, don't need cookieParser if we have this
const passport = require('passport');
const local = require('./strategies/local');

const usersRoute = require('./routes/users');
const postsRoute = require('./routes/posts');
const authRoute = require('./routes/auth');

const store = new session.MemoryStore(); // save session to memory (instead of db)
const app = express();

// middleware functions (global level, register BEFORE routes)
app.use(cookieParser());

app.use(session({
    secret: 'some secret',
    resave: false,
    cookie: { maxAge: 60000 },
    saveUninitialized: false, // otherwise generate a new session id every time
    store // same as store: store
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// invoked every time a request is made
app.use((req, res, next) => {
    console.log(store); // saves sessionID automatically to store
    console.log(`${req.method} - ${req.url}`);
    next(); // must invoke next() to call the middleware function
});

// https://www.passportjs.org/concepts/authentication/sessions/
app.use(passport.initialize());
app.use(passport.session());

// make sure we register middleware BEFORE routes
app.use('/users', usersRoute); // prefixed with /user
app.use('/posts', postsRoute);
app.use('/auth', authRoute);


app.listen(3000, () => {
    console.log('Server is running on Port 3000');
});

// COMMENT THE LINES BELOW BEFORE RUNNING APP!
const users = [
    { name: 'Ruichen', age: 22 },
    { name: 'Yaqi', age: 18 },
    { name: 'Bowei', age: 15 },
];

const posts = [
    { title: 'My favorite taco' },
    { title: 'My favorite biryani' },
    { title: 'My favorite masala' },
];

app.get('/', (req, res) => {
    res.send({
        msg: 'Hello!',
        user: {}
    });
});

app.get('/users', (req, res) => {
    res.status(200).send(users);
});

// POST: pass business logic data in request body
app.post('/users', (req, res) => {
    // console.log(req.body);
    const user = req.body;
    users.push(user);
    res.status(201).send('Created User');
});

// GET localhost:3000/users/Ruichen
app.get('/users/:name', (req, res) => {
    // console.log(req.params); // object
    const { name } = req.params;
    const user = users.find((user) => user, name === name);
    if (user) res.status(200).send(users);
    else res.status(404).send('Not Found');
});

// local middleware function: good idea to split codes into middleware.js
function validateAuthToken(req, res, next) {
    const { authorization } = req.headers;
    if (authorization && authorization == '123') {
        next(); // go to call the next function sequentially
    } else {
        res.status(403).send({ msg: 'Forbodden. Incorrect Credentials.' })
    }
}

app.post('/posts', validateAuthToken, (req, res) => {
    const post = req.body;
    posts.push(post);
    res.status(201).send(post);
});

// // POST: pass auth in header
// app.post('/posts', (req, res) => {
//     console.log(req.headers);
//     const { authorization } = req.headers;
//     if (authorization && authorization === '123') {
//         const post = req.body;
//         posts.push(post);
//         res.status(201).send(post);
//     } else {
//         res.status(403).send('Forbidden');
//     };
// });

// GET localhost:3000/posts?title=My favorite taco
app.get('/posts', (req, res) => {
    // console.log(req.query); // object
    const { title } = req.query;
    if (title) {
        const post = posts.find((post) => post.title === title);
        if (post) res.status(200).send(post);
        else res.status(404).send('Not Found');
    }
    res.status(200).send(posts);
});

// "mock" sending cookie to server and validate
function validateCookie(req, res, next) {
    const { cookies } = req;
    if ('session_id' in cookies) {
        console.log('Session ID Exists.');
        if (cookies.session_id === '123456') {
            next();
        } else {
            res.status(403).send({ msg: 'Not Authenticated' });
        }
    } else {
        res.status(403).send({ msg: 'Not Authenticated' });
    }
};

// "mock" visiting a protected route, where we need to validate cookie
app.get('/protected', validateCookie, (req, res) => {
    res.status(200).json({ msg: 'You are authorized.' });
});

app.post('/login', (req, res) => {
    console.log(req.sessionID);
    const { username, password } = req.body;
    if (username && password) {
        if (req.session.authenticated) {
            // user has logged in
            res.json(req.session);
        } else {
            // real app: save hased password in db
            if (password === '123') {
                req.session.authenticated = true;
                req.session.user = {
                    username, password
                };
                res.json(req.session);
            } else {
                res.status(403).json({ msg: 'Bad Credentials' });
            }
        }
    } else res.status(403).json({ msg: 'Bad Credentials' });
});

// "mock" getting cookie from server (hardcode a cookie, but we NEVER do that in real app)
app.get('/signin', validateCookie, (req, res) => {
    res.cookie('session_id', '123456'); // get cookie as response and store on client side
    res.status(200).json({ msg: 'Logged In.' });
});
