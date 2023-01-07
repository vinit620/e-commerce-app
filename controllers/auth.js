const User = require('../models/user');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
var { expressjwt: expressJwt } = require("express-jwt");


// USER REGISTRATION
exports.signup = (req, res) => {

    // validation error (if any)
    const val_error = validationResult(req);

    if (!val_error.isEmpty()) {
        return res.status(422).json({
            error_param: val_error.array()[0].param,
            error_msg: val_error.array()[0].msg
        })
    }

    // Registering user in DB
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                err: "Unable to save user in DB"
            })
        }

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
        });
    });
};


// USER SIGNIN
exports.signin = (req, res) => {

    // validation error (if any)
    const val_error = validationResult(req);

    if (!val_error.isEmpty()) {
        return res.status(422).json({
            error_param: val_error.array()[0].param,
            error_msg: val_error.array()[0].msg
        })
    }

    // Extract email and password from req
    const { email, password } = req.body;

    // Find user in DB
    User.findOne({ email }, (err,user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User does not exist'
            });
        }

        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Incorrect password'
            });
        }

        // Create token
        const authToken = jwt.sign({_id: user._id}, process.env.TOKEN_STRING);

        // Put token in cookie
        res.cookie('authToken', authToken, {expire: new Date() + 9999});

        // send response to frontend
        const { _id, name, email, role } = user;
        return res.json({
            authToken,
            user: { _id, name, email, role }
        });
    });
};


// USER SIGNOUT
exports.signout = (req, res) => {
    res.clearCookie('authToken');
    res.json({ msg: 'User signout successful' });
};


// protected routes (middleware)
exports.isSignedIn = expressJwt({
    secret: process.env.TOKEN_STRING,
    algorithms: ["HS256"],
    userProperty: 'auth'
});


// CUSTOM MIDDLEWARES
exports.isAuthenticated = (req, res, next) => {
    let authenticated = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!authenticated) {
        return res.status(403).json({
            error: 'ACCESS DENIED'
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: 'ACCESS DENIED, Only admin can access this page'
        });
    }
    next();
};
