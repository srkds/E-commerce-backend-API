// import mongoose from "mongoose";

const mongoose = require("mongoose");
const { Schema } = mongoose;

const { ObjectId } = Schema;

const ProductCartSchema = new Schema({
  product: {
    type: ObjectId,
    ref: "Product",
  },
  name: String,
  count: Number,
  price: Number,
});

const ProductCart = mongoose.model("ProductCart", ProductCartSchema);

const orderSchema = new Schema(
  {
    products: [ProductCartSchema], // products in cart
    transaction_id: {},
    amount: { type: String },
    address: String,
    updated: Date,
    user: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order, ProductCart };
