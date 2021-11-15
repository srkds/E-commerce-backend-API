const User = require("./../models/user");

const Order = require("./../models/order");

// Param middleware
exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      // if error or if user not found then
      return res.status(400).json({
        error: "No user found in DB",
      });
    }

    // now req.profile contains user object
    req.profile = user;
    next();
  });
};

// CONTROLER

exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;

  return res.json(req.profile);
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    // here req.profile._id is comming from getUser middleware
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err)
        return res
          .status(400)
          .json({ err: "You are not authorize to update user" });

      user.salt = undefined;
      user.encry_password = undefined;
      user.createdAt = undefined;
      user.updatedAt = undefined;
      res.json(user);
    }
  );
};

exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err)
        return res.status(400).json({ err: "No order in this account " });
      return res.json(order);
    });
};

exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchases = [];

  req.body.order.products.forEach((product) => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });

  //store this in db
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchases } },
    { new: true }, // send's updated data
    (err, purchases) => {
      if (err)
        return res.status(400).json({ error: "Unable to save purchase list" });
    }
  );
  next();
};
