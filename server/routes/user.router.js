const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

// Handles GET request to get all admins that are current users
router.get('/admins', rejectUnauthenticated, (req, res) => {
  const username = req.body.username;
  const queryText = `
    SELECT "user"."username", "user"."id"
    FROM "user" ORDER BY "user"."id";`;
  pool.query(queryText, username)
  .then(result => {
    res.send(result.rows);
  }).catch(error => {
    console.log(`error getting admin list`, error);
    res.sendStatus(500);
  }); 
});

// Handles POST request for adding new admins to the users table
router.post('/admin', rejectUnauthenticated, (req, res) => {
  const username = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);
  const queryText = `INSERT INTO "user" (username, password) VALUES ($1, $2);`;
  pool.query(queryText, [username, password])
  .then(() => res.sendStatus(201))
  .catch(() => res.sendStatus(500));
});

// Handles UPDATING requests for when Admins change their user info.
router.put('/admin', rejectUnauthenticated, (req, res) => {
  const acceptedKeys = ['username', 'password'];
  if(req.body.password){
    req.body.password = encryptLib.encryptPassword(req.body.password);
  }
  if(!req.body.username && !req.body.password){
    res.sendStatus(400);
    return;
  }
  const config = [req.user.id];
  const setValues = Object.entries(req.body)
    .filter(([key, value]) => {
      return value && acceptedKeys.includes(key) ;
    }).map(([key, value]) => {
      config.push(value);
      return `${key}=$${config.length}`;
    }).join(', ');
  const queryText = `
    UPDATE "user"
    SET ${setValues}
    WHERE "user"."id" = $1`;
    pool.query(queryText, config)
      .then((result) => {
        res.sendStatus(200);
      }).catch((error) => {
        res.sendStatus(500);
        console.log('error updating admin user info router', error);
    });
})

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', (req, res, next) => {  
  const username = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);

  const queryText = 'INSERT INTO "user" (username, password) VALUES ($1, $2) RETURNING id';
  pool.query(queryText, [username, password])
    .then(() => res.sendStatus(201))
    .catch(() => res.sendStatus(500));
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post('/logout', (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

// Allows am Admin to delete another admin. Admins CANNOT delete themselves.
router.delete('/admin/:id', rejectUnauthenticated, (req, res) => {
  console.log('In begin of Delete Admin', req.body);
  const user = req.params;
  let queryText = `DELETE FROM "user" WHERE "user"."id"=$1`
  pool.query(queryText, [user.id])
  .then((result) => { res.sendStatus(200);
  }).catch((error) => {
    console.log('error deleting an admin', error);
    res.sendStatus(500);
  });
});

module.exports = router;
