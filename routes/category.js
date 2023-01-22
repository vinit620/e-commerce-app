const express = require('express');
const router = express.Router();

const { getCategoryById, createCategory, getCategory, getAllCategory, updateCategory, removeCategory } = require('../controllers/category');
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');
const { getUserById } = require('../controllers/user');

// Params
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

// create category
router.post('/category/create/:userId', isSignedIn, isAuthenticated, isAdmin, createCategory);

// get a particular category
router.get('/category/:categoryId', getCategory);

// get all categories
router.get('/categories', getAllCategory);

// update category
router.put('/category/:categoryId/:userId', isSignedIn, isAuthenticated, isAdmin, updateCategory);

// delete category
router.delete('/category/:categoryId/:userId', isSignedIn, isAuthenticated, isAdmin, removeCategory);

module.exports = router;