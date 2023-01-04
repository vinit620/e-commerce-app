const express = require('express');
const { body } = require('express-validator');
const { signup, signin, signout } = require('../controllers/auth');
const router = express.Router();

// User Registration
router.post(
    '/signup',
    [
        body('email').isEmail(),  // email validation
        body('password').isLength({ min: 5 }) // password validation
    ],
    signup
);

// User Signin
router.post(
    '/signin',
    [
        body('email').isEmail(),  // email validation
        body('password').isLength({ min: 5 }) // password validation
    ],
    signin
);

// User Signout
router.get('/signout', signout);

module.exports = router;
