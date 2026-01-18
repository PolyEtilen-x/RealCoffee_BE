const mongoose = require("mongoose");
const product = require("./product");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: true,
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: Number,
            price: Number,
        },
    ],
    totalAmount: Number,
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
