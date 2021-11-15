const Product = require("../models/product");

const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

// MIDDLEWARES
exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) return res.status(400).json({ error: "Product Not Found!" });
      req.product = product;
      next();
    });
};

// CONTROLLERS
exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  // this request will be parsed quick because bulky image removed
  // we will load image saprately
  return res.json(req.product); // comming from middleware
};

// middleware for getting image seprately
// this will make our app very fast
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtentions = true; // for extentions

  form.parse(req, (err, fields, file) => {
    if (err) return res.status(400).json({ error: "Problem with image " });

    // destructuring the fields
    const { name, description, price, category, stock } = fields;
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({ error: "Please Include all fields" });
    }

    // product is created based on these fields
    let product = new Product(fields);

    // handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        // return if file is too big
        return res.status(400).json({ error: "File size is too big!" });
      }

      product.photo.data = fs.readFileSync(file.photo.path); // giving path of photo(getting from formidable) to store in database
      product.photo.contentType = file.photo.type; // seting file type
    }

    // save to db
    product.save((err, product) => {
      if (err)
        return res.status(400).json({ error: "Saving t-shirt in DB failed!" });
      res.json(product);
    });
  });
};

// delete controller
exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) return res.status(400).json({ error: "Error deleting Product!" });
    res.json({
      message: "Product Deleted Successfuly ",
      deletedProduct,
    });
  });
};

// update controller
exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtentions = true; // for extentions

  form.parse(req, (err, fields, file) => {
    if (err) return res.status(400).json({ error: "Problem with image " });

    // product is created based on these fields
    let product = req.product; // getting existing product
    product = _.extend(product, fields); // updating

    // handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        // return if file is too big
        return res.status(400).json({ error: "File size is too big!" });
      }

      product.photo.data = fs.readFileSync(file.photo.path); // giving path of photo(getting from formidable) to store in database
      product.photo.contentType = file.photo.type; // seting file type
    }

    // save to db
    product.save((err, product) => {
      if (err)
        return res
          .status(400)
          .json({ error: "Updating t-shirt in DB failed!" });
      res.json(product);
    });
  });
};

// product listing
exports.getAllProducts = (req, res) => {
  let limit = req.quary.limit ? parseInt(req.quary.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  Product.find()
    .select("-photo") // it will select all except photo
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exex((err, products) => {
      if (err) return res.status(400).json({ error: "NO PRODUCTS FOUND!" });
      res.json(products);
    });
};
