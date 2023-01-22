const Category = require('../models/category');


exports.getCategoryById = (req, res, next, id) => {

    // find category in DB
    Category.findById(id).exec((err, category) => {
        if (err) {
            return res.status(400).json({
                error: "Category not found in DB"
            });
        }

        req.category = category;
        next();
    });
}


exports.createCategory = (req, res) => {

    // creating a new category with received info
    const category = new Category(req.body);

    // saving in DB
    category.save((err, category) => {
        if (err || !category) {
            return res.status(400).json({
                error: "Not able to create category"
            });
        }

        return res.json({ category });
    });
}


exports.getCategory = (req, res) => {
    return res.json(req.category);
}


exports.getAllCategory = (req, res) => {
    Category.find((err, categories) => {
        if (err) {
            return res.status(400).json({
                error: "No categories found!"
            });
        }

        return res.json({ categories });
    });
}


exports.updateCategory = (req, res) => {
    const category = req.category;
    category.name = req.body.name;
    category.save((err, updatedCategory) => {
        if (err || !updatedCategory) {
            return res.status(400).json({
                error: "Failed to update category"
            });
        }

        return res.json(updatedCategory);
    });
}


exports.removeCategory = (req, res) => {
    const category = req.category;
    category.remove((err, category) => {
        if (err || !category) {
            return res.status(400).json({
                error: "Failed to delete category"
            });
        }

        return res.json({
            success: `Successfully deleted ${category.name} with ID:${category._id}`
        });
    });
}