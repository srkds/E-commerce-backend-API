// import mongoose from "mongoose";
const mongoose = require("mongoose");

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      trime: true,
      required: true,
      maxlength: 32,
      unique: true,
    },
  },
  { timestamps: true } // gives exect time when entry made
);

module.exports = mongoose.model("Category", categorySchema);
