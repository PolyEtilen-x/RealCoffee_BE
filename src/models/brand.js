const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    isMainBrand: {
      type: Boolean,
      default: false, 
    },

    // brand info
    logo: {
      type: String,
    },

    licenseImage: {
      type: String,
    },

    phone: {
      type: String,
    },

    address: {
      type: String,
    },

    taxCode: {
      type: String,
    },

    // commission other brand
    revenue: {
      type: Number,
      default: 0,
    },

    commissionRate: {
      type: Number,
      default: 0.05,
    },

    rejectReason: {
      type: String,
      default: null,
    },

    rejectedAt: {
      type: Date,
      default: null,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Brand", BrandSchema);
