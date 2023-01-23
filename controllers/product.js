const Product = require('../models/product');
const formidable = require('formidable');
const fs = require('fs');


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
            product.photo.data = fs.readFileSync(file.photo.path);
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