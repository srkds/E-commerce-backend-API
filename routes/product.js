const express = require("express");

const {
  getProductById,
  getProduct,
  createProduct,
  photo,
  updateProduct,
  deleteProduct,
  getAllProducts,
} = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

const router = express.Router();

// PARAMETER EXTERCTION
router.param("productId", getProductById);
router.param("userId", getUserById);

// ROUTES

// CREATE
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);

// READ
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

// UPDATE
router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
);

// DELETE
router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteProduct
);

// LISTING ROUTE
router.get("/products", getAllProducts);

module.exports = router;
