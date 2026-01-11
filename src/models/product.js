const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {type: String, 
      required: true
    },
    price: {
      type: Number, 
      required: true
    },
    stock: {
      type: Number, 
      default: 0
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true
    },
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
