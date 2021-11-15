// import mongoose from "mongoose";
const mongoose = require("mongoose");

const { Schema } = mongoose;

const { ObjectId } = Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 32,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      required: true,
    },
    price: {
      type: Number,
      maxlength: 32,
      required: true,
      trim: true,
    },
    category: {
      type: ObjectId, // object id of reference
      ref: "Category", // from where object id reference is comming
      required: true,
    },
    stock: {
      type: Number,
    },
    sold: {
      type: Number,
      default: 0,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
