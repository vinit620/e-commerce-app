const express = require('express');
const router = express.Router();

const { getProductById, createProduct, getPhoto, getProduct, updateProduct, removeProduct, getAllProducts, getAllUniqueCategory } = require('../controllers/product');
const { isAdmin, isAuthenticated, isSignedIn } = require('../controllers/auth');
const { getUserById } = require('../controllers/user');

// Params
router.param('userId', getUserById);
router.param('productId', getProductById);

// create product
// TODO: Validate incoming data using express-validator
router.post('/product/create/:userId', isSignedIn, isAuthenticated, isAdmin, createProduct);

// get product
router.get('/product/:productId', getProduct);
router.get('/product/photo/:productId', getPhoto);

// update product
router.put('/product/:productId/:userId', isSignedIn, isAuthenticated, isAdmin, updateProduct);

// delete product
router.delete('/product/:productId/:userId', isSignedIn, isAuthenticated, isAdmin, removeProduct);

// get all products
router.get('/products', getAllProducts);

// get all categories in which products are available
router.get('/products/category', getAllUniqueCategory);

module.exports = router;