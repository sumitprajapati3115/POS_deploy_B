import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
 {
    name: {
      type: String,
      required: true,
      trim: true
    },

    barcode: {
      type: String,
      required: true,
      unique: true
    },

    category: {
      type: String,
      required: true
    },

    subCategory: {
      type: String
    },

    brand: {
      type: String
    },

    costPrice: {
      type: Number,
      required: true
    },

    sellingPrice: {
      type: Number,
      required: true
    },

    discount: {
      type: Number,
      default: 0
    },

    finalPrice: {
      type: Number
    },

    stockQuantity: {
      type: Number,
      required: true,
      default: 0
    },

    expiryDate: {
      type: Date
    },

    description: {
      type: String
    },

    unit: {
      type: Number,
      default: 1
    },

    lowStockAlert: {
      type: Number,
      default: 5
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", productSchema);