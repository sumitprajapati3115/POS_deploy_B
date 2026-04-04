import Sale from "../models/saleModel.js";
import Product from "../models/ProductModel.js";


export const createSale = async (req, res) => {
  console.log(res.body)
  try {
    console.log("xcvb")

    const { items, paymentMethod, discount = 0 } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty"
      });
    }

    let totalAmount = 0;
    let saleItems = [];

    for (const item of items) {

      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found"
        });
      }

      // Check stock availability
      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} only ${product.stockQuantity} left in stock`
        });
      }

      const itemTotal = product.sellingPrice * item.quantity;

      totalAmount += itemTotal;

      // Reduce stock
      product.stockQuantity -= item.quantity;
      await product.save();

      saleItems.push({
        productId: product._id,
        name: product.name,
        barcode: product.barcode,
        price: product.sellingPrice,
        quantity: item.quantity,
        total: itemTotal
      });
    }

    const finalAmount = totalAmount - discount;

    const billNumber = "BILL-" + Date.now();

    const sale = await Sale.create({
      billNumber,
      items: saleItems,
      totalAmount,
      discount,
      finalAmount,
      paymentMethod
    });

    res.status(201).json({
      success: true,
      message: "Sale completed successfully",
      sale
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



export const dailySalesReport = async (req, res) => {
  try {

    const start = new Date();
    start.setHours(0,0,0,0);

    const end = new Date();
    end.setHours(23,59,59,999);

    const sales = await Sale.find({
      createdAt: { $gte: start, $lte: end }
    });

    const total = sales.reduce((sum, s) => sum + s.finalAmount, 0);

    res.json({
      success: true,
      totalSales: total,
      orders: sales.length,
      sales
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const monthlySalesReport = async (req, res) => {
  try {

    const { year, month } = req.query;

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const sales = await Sale.find({
      createdAt: { $gte: start, $lte: end }
    });

    const total = sales.reduce((sum, s) => sum + s.finalAmount, 0);

    res.json({
      success: true,
      totalSales: total,
      orders: sales.length,
      sales
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const weeklySalesReport = async (req, res) => {
  try {

    const today = new Date();

    const start = new Date(today);
    start.setDate(today.getDate() - 7);

    const sales = await Sale.find({
      createdAt: { $gte: start, $lte: today }
    });

    const total = sales.reduce((sum, s) => sum + s.finalAmount, 0);

    res.json({
      success: true,
      totalSales: total,
      orders: sales.length,
      sales
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllSales = async (req, res) => {
  try {

    const sales = await Sale.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      sales
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getSalesByDate = async (req,res)=>{

  try {
    const { date } = req.query;

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const sales = await Sale.find({
      createdAt: { $gte: start, $lte: end },
    });

    res.json({ sales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
