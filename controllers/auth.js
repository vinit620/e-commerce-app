const User = require('../models/user');
const { validationResult } = require('express-validator');


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
