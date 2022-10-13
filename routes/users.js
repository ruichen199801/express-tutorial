const { Router } = require('express');
const db = require('../database');

const { check, validationResult } = require('express-validator');

const router = Router();

// add router level middleware
router.use((req, res, next) => {
    console.log('Request made to /users route');
    next();
});

// protected route
router.get('/', async (req, res) => {
    // console.log(req);
    if (req.user) { // user is logged in
        console.log(req.user);
        const results = await db.promise().query(`SELECT * FROM USERS`);
        // console.log(results[0]);
        res.status(200).send(results[0][0]);
    } else {
        res.status(403).send('User Not Authenticated');
    }
});

router.get('/posts', (req, res) => {
    res.json({ route: 'Posts' });
});

router.post('/', [
    check('username')
        .notEmpty()
        .withMessage('Username cannot be empty')
        .isLength({ min: 5 })
        .withMessage('Username must be at least 5 characters'),
    check('password').notEmpty().withMessage('Password cannot be empty'),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // console.log(errors);
        return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    if (username && password) {
        try {
            db.promise().query(`INSERT INTO USERS VALUES('${username}', '${password}')`);
            res.status(201).send({ msg: 'Created User' });
        } catch (err) {
            console.log(err);
        }
    }
});

module.exports = router;
