const Product = require('../models/product');
const formidable = require('formidable');
const _ = require('lodash')
const fs = require('fs');


/*  - Middleware that creates a new property named "product" in req
    - req.product is the product information if it is found in DB    */
exports.getProductById = (req, res, next, id) => {
    Product.findById(id, (err, product) => {
        if (err) {
            return res.status(400).json({
                error: "Product not found in DB"
            });
        }

        req.product = product;
        next();
    })
}


// Create product
exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "Cannot register product"
            });
        }

        let product = new Product(fields);

        // handle incoming file
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "File size is too big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.filepath);
            product.photo.contentType = file.photo.type;
        }

        // Save Product in DB
        product.save((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: "Failed to save product in DB"
                });
            }

            return res.json(product);
        });
    });
}


// Get product
exports.getProduct = (req, res) => {
    // IMP: we are not sending the photo as it will slow down the res
    req.product.photo = undefined;
    res.json(req.photo);
}


// middleware to send the photo to speed up the res (PERFORMANCE OPTIMIZATION)
exports.getPhoto = (req, res, next) => {
    if (req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}


// update product
exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "Cannot update product"
            });
        }

        let product = req.product;
        product = _.extend(fields)

        // handle incoming file
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "File size is too big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.filepath);
            product.photo.contentType = file.photo.type;
        }

        // Save Product in DB
        product.save((err, updatedProduct) => {
            if (err) {
                return res.status(400).json({
                    error: "Failed to update Product"
                });
            }

            return res.json(updatedProduct);
        });
    });
}


// delete product
exports.removeProduct = (req, res) => {
    const product = req.product;
    product.remove((err, deletedProduct) => {
        if (err || !deletedProduct) {
            return res.status(400).json({
                error: "Failed to delete deletedProduct"
            });
        }

        return res.json({
            success: `Successfully deleted ${deletedProduct.name} with ID:${deletedProduct._id}`
        });
    });
}


// get all products listing
exports.getAllProducts = (req, res) => {
    
    // get the number of products to send
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "stock";

    Product.find()
        .select('-photo')
        .populate('category')
        .sort([[sortBy, 'asc']])
        .limit(limit)
        .exec((err, products) => {
            if (err || !products) {
                res.status(400).json({
                    error: "cannot get products"
                });
            }

            return res.json(products);
        });
}


// get all categories in which products are available
exports.getAllUniqueCategory = (req, res) => {
    Product.distinct('category', {}, (err, category) => {
        if (err || ! category) {
            return res.status(400).json({
                error: "No category found"
            });
        }
        return res.json(category);
    })
}


// middleware to update the stock and sold when order is placed
exports.updateStock = (req, res, next) => {

    let operations = req.body.order.products.map(product => {
        return {
            updateOne: {
                filter: { _id: product._id },
                update: { $inc: { stock: -product.count, sold: +product.count }}
            }
        }
    });

    // using mongoose builWrite method to efficiently update DB
    Product.bulkWrite(operations, {}, (err, products) => {
        if (err || !products) {
            return res.status(400).json({
                error: 'failed to update stock in DB'
            });
        }
        next();
    })
}