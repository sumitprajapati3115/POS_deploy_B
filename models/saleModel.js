import mongoose from "mongoose";

const saleItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  name: String,
  barcode: String,
  price: Number,
  quantity: Number,
  total: Number
});

const saleSchema = new mongoose.Schema(
  {
    billNumber: {
      type: String,
      required: true
    },

    items: [saleItemSchema],

    totalAmount: {
      type: Number,
      required: true
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi"],
      default: "cash"
    },

    discount: {
      type: Number,
      default: 0
    },

    finalAmount: {
      type: Number
    }
  },
  { timestamps: true }
);

export default mongoose.model("Sale", saleSchema);