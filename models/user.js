const mongoose = require("mongoose");
// import { v4 as uuidv4 } from "uuid";
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    lastname: {
      type: String,
      maxlength: 32,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    encry_password: {
      type: String,
      required: true,
    },
    userInfo: {
      type: String,
      trim: true,
    },
    // salt is for password encryption for more search on internet
    salt: String,
    role: {
      type: Number,
      default: 0,
    },
    purchases: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

//virtuals
userSchema
  .virtual("password")
  .set(function (password) {
    // setting up fields
    this._password = password;
    this.salt = uuidv4();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

// METHODS
userSchema.methods = {
  // method to match hashed values
  authenticate: function (plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password;
  },

  // method that generates encrypted password
  securePassword: function (plainpassword) {
    //if no password provided
    if (!plainpassword) return "";
    try {
      // this will create a secure encrypted password
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

// exporting our model
module.exports = mongoose.model("User", userSchema);
