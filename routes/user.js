const express = require('express');
const router = express.Router();
const { isSignedIn, isAuthenticated } = require('../controllers/auth');
const { getUserById, getUser, updateUser, userPurchaseList } = require('../controllers/user');

router.param('userId', getUserById);

// Get a user by _id
router.get('/user/:userId', isSignedIn, isAuthenticated, getUser);

// Update user
router.put('/user/:userId', isSignedIn, isAuthenticated, updateUser);

// Get order list of a user
router.get('/orders/user/:userId', isSignedIn, isAuthenticated, userPurchaseList);

module.exports = router;
