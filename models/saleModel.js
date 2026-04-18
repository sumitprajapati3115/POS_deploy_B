import mongoose from "mongoose";

const saleItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  name: { type: String, required: true },
  barcode: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true }
});

const saleSchema = new mongoose.Schema(
  {
    billNumber: {
      type: String,
      required: true,
      unique: true, // 🌟 Ek bill number dobara repeat nahi hoga
      index: true   // 🌟 Bill number se search karna super fast ho jayega
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
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

// 🌟 Safe export for hot-reloading
export default mongoose.models.Sale || mongoose.model("Sale", saleSchema);