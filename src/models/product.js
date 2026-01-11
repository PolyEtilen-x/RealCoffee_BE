const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {type: String, require: true},
    price: {type: Number, require: true},
    stock: {type: Number, default: 0},
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      require: true
    },
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
