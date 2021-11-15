var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
var { signout, signup, signin, isSignedIn } = require("../controllers/auth");

router.get("/signout", signout);
router.post(
  "/signup",
  // validators
  [
    check("name", "Name should be at least 3").isLength({ min: 3 }),
    check("email", "Email is require").isEmail(),
    check("password", "Password should more than 3").isLength({ min: 3 }),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("email", "Email is require").isEmail(),
    check("password", "Password should more than 3").isLength({ min: 3 }),
  ],
  signin
);

router.get("/testroute", isSignedIn, (req, res) => {
  res.send(req.auth); // req.auth comming from isSignedIn middleware
});

module.exports = router;
