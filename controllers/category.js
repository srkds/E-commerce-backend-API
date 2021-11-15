const Category = require("../models/category");

// MIDDLEWARES
exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, cate) => {
    if (err) return res.status(400).json({ error: "Category Not found in DB" });
    req.category = cate;
    // console.log(res.category);
    next();
  });
};

// CONTROLLERS
exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err)
      return res
        .status(400)
        .json({ error: "Category not inserted successfuly" });
    res.json({ category });
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.category); // comming from middleware
};
exports.getAllCategory = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err) return res.status(400).json({ error: "No categories found" });
    res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  const category = req.category; // comming from middleware
  console.log(category.name);
  category.name = req.body.name; // changing it's name by our request
  category.save((err, updatedCategory) => {
    if (err)
      return res.status(400).json({ error: "Failed to update category" });
    res.json(updatedCategory);
  });
};

exports.removeCategory = (req, res) => {
  const category = req.category;
  category.remove((err, category) => {
    if (err) return res.status(400).json({ error: "Error Deleting Category" });
    res.json({
      message: `category ${category}  Successfuly deleted`,
    });
  });
};
