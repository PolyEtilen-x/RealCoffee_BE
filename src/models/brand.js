const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isMainBrand: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Brand", BrandSchema);
