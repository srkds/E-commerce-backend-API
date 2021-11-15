const User = require("./../models/user");
const { check, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

exports.signup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: err,
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

exports.signin = (req, res) => {
  // de-structuring the body
  const { email, password } = req.body;

  // for throwing errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  // finding user based on registered email
  // if found then match password
  // otherwise raise an error
  User.findOne({ email }, (err, user) => {
    // err for error of query
    // and !user for if query is run successfuly but user doesn't exist
    if (err || !user)
      return res.status(400).json({ error: "User Doesn't exist" });

    // validating is password matches in database or not
    if (!user.authenticate(password)) {
      return res
        .status(400)
        .json({ error: "Email and password Doesn't match" });
    }

    // create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);

    // put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    // send response to front end
    const { _id, name, email, role } = user;
    res.json({
      token,
      user: { _id, name, email, role },
    });
  });
};

exports.signout = (req, res) => {
  // Clearing cookies from user device
  res.clearCookie("token");
  res.send("signout success");
};

// Protected Routes
/* uses expressjwt to authenticate token
 we can use it for authenticated routes
 it is middleware but it has in built next so we don't have to call explicitly
 */
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth" /* This makes new field in request 
   and adds _id and other stuff we can use it as req.auth */,
});

// Custome Middleware

exports.isAuthenticated = (req, res, next) => {
  // req.auth._id is comming from isSignedIn middleware
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  // if this is true then user can do changes in their own account
  if (!checker) {
    res.status(403).json({
      error: "ACCESS DENIED!",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    res.status(403).json({
      error: "You are not Admin, ACCESS DENIED",
    });
  }
  next();
};
