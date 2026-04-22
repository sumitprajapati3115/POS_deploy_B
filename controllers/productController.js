import Product from "../models/ProductModel.js";
import bwipjs from "bwip-js";

// Add product
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      barcode,
      category,
      subCategory,
      brand,
      costPrice,
      sellingPrice,
      discount,
      stockQuantity,
      expiryDate,
      description
    } = req.body;

    if (!name || !barcode || !category || !costPrice || !sellingPrice) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing"
      });
    }

    const existingProduct = await Product.findOne({ barcode });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product with this barcode already exists"
      });
    }

    // .create() automatically triggers the pre("save") hook
    const product = await Product.create({
      name,
      barcode,
      category,
      subCategory,
      brand,
      costPrice,
      sellingPrice,
      discount,
      stockQuantity,
      expiryDate,
      description
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update/Edit Product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { barcode } = req.body;

    if (barcode) {
      const existingProduct = await Product.findOne({
        barcode,
        _id: { $ne: id },
      });

      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: "Another product already uses this barcode",
        });
      }
    }

    // 🌟 FIX: Find the product first, update it, then save() to trigger the auto-calculate hook
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // req.body ka data product mein daal dein
    Object.assign(product, req.body);
    
    // .save() run hoga toh finalPrice apne aap calculate ho jayega!
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Search products
export const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.query;

    const products = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { barcode: { $regex: keyword, $options: "i" } },
        { brand: { $regex: keyword, $options: "i" } }
      ]
    }).limit(20);

    res.status(200).json({
      success: true,
      products
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get product by barcode (scanner)
export const getProductByBarcode = async (req, res) => {
  try {
    const { barcode } = req.params;

    const product = await Product.findOne({ barcode });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      product
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Generate Barcode Image
export const generateBarcodeImage = async (req, res) => {
  const { barcode } = req.params;

  try {
    const png = await bwipjs.toBuffer({
      bcid: "code128",
      text: barcode,
      scale: 3,
      height: 10
    });

    res.set("Content-Type", "image/png");
    res.send(png);

  } catch (err) {
    res.status(500).send(err);
  }
};