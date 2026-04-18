import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true // 🌟 Fast search ke liye index add kiya gaya hai
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

// 🌟 Pre-save hook: Jab bhi product add ya update hoga, finalPrice apne aap calculate ho jayega
productSchema.pre("save", function (next) {
  if (this.isModified("sellingPrice") || this.isModified("discount")) {
    const discountAmount = (this.sellingPrice * this.discount) / 100;
    this.finalPrice = this.sellingPrice - discountAmount;
  }
  next();
});

export default mongoose.models.Product || mongoose.model("Product", productSchema);