const LocalStrategy = require('passport-local');
const passport = require('passport');
const db = require('../database');

// see trade off btwn session store vs db query: https://www.passportjs.org/concepts/authentication/sessions/
// serializeUser: what data to store into session passing from client to server
passport.serializeUser((user, done) => {
    done(null, user.username);
});

// deSerializeUser: what data to query from db when client parses data from session
passport.deserializeUser(async (username, done) => {
    try {
        const result = await db.promise().query(`SELECT * FROM USERS WHERE USERNAME = '${username}'`);
        if (result[0][0]) {
            done(null, result[0][0]);
        }
    } catch (err) {
        done(err, null);
    };
});

passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const result = await db.promise().query(`SELECT * FROM USERS WHERE USERNAME = '${username}'`);
            if (result[0].length === 0) {
                done(null, false); // user is not found
            } else {
                // if user is found, then compare password
                if (result[0][0].password === password) {
                    done(null, result[0][0]);
                } else {
                    done(null, false);
                }
            }
        } catch (err) {
            done(err, false);
        }
    }
));