const express = require("express");

const {
  getUserById,
  getUser,
  updateUser,
  userPurchaseList,
} = require("./../controllers/user");
const { isSignedIn, isAuthenticated } = require("./../controllers/auth");

const router = express.Router();

// params
/* PARAMETER EXTRACTOR */
router.param("userId", getUserById);

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);

// for updating user
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);

router.get(
  "/order/user/:userId",
  isSignedIn,
  isAuthenticated,
  userPurchaseList
);
module.exports = router;
