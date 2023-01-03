const express = require('express');
const { body } = require('express-validator');
const { signout, signup } = require('../controllers/auth');
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


module.exports = router;