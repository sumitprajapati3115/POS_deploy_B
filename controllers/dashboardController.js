
import ProductModel from "../models/ProductModel.js";
import Sale from "../models/saleModel.js";


export const getDailyOrders = async (req, res) => {
  try {

    const start = new Date();
    start.setHours(0,0,0,0);

    const end = new Date();
    end.setHours(23,59,59,999);

    const orders = await Sale.countDocuments({
      createdAt: { $gte: start, $lte: end }
    });

    res.status(200).json({
      success: true,
      dailyOrders: orders
    });

  } catch (error) {
    res.status(500).json({ success:false, message:error.message });
  }
};

export const getDailyProductsSold = async (req, res) => {
  try {

    const start = new Date();
    start.setHours(0,0,0,0);

    const end = new Date();
    end.setHours(23,59,59,999);

    const sales = await Sale.find({
      createdAt: { $gte: start, $lte: end }
    });

    let totalProductsSold = 0;

    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        totalProductsSold += item.quantity;
      });
    });

    res.json({
      success: true,
      totalProductsSold
    });

  } catch (error) {
    res.status(500).json({ message:error.message });
  }
};


export const getLowStockProducts = async (req, res) => {
  try {

    const products = await Product.find({
      $expr: { $lte: ["$stockQuantity", "$lowStockAlert"] }
    }).select("name stockQuantity lowStockAlert barcode");

    res.json({
      success: true,
      products
    });

  } catch (error) {
    res.status(500).json({ message:error.message });
  }
};

export const getSalesChart = async (req, res) => {
  try {

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const sales = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          totalSales: { $sum: "$finalAmount" },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      success: true,
      sales
    });

  } catch (error) {
    res.status(500).json({ message:error.message });
  }
};



export const getDashboardStats = async (req, res) => {
  try {

    /* TODAY RANGE */

    const start = new Date();
    start.setHours(0,0,0,0);

    const end = new Date();
    end.setHours(23,59,59,999);


    /* DAILY ORDERS */

    const dailyOrders = await Sale.countDocuments({
      createdAt: { $gte: start, $lte: end }
    });


    /* TODAY SALES */

    const todaySales = await Sale.find({
      createdAt: { $gte: start, $lte: end }
    });


    /* PRODUCTS SOLD */

    let totalProductsSold = 0;

    todaySales.forEach((sale) => {
      sale.items.forEach((item) => {
        totalProductsSold += item.quantity;
      });
    });


    /* TODAY REVENUE */

    let todayRevenue = 0;

    todaySales.forEach((sale) => {
      todayRevenue += sale.finalAmount;
    });


    /* LOW STOCK PRODUCTS */

    const lowStockProducts = await ProductModel.find({
      $expr: { $lte: ["$stockQuantity", "$lowStockAlert"] }
    })
    .select("name stockQuantity barcode")
    .limit(5);


    /* SALES CHART (LAST 7 DAYS) */

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const salesChart = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          totalSales: { $sum: "$finalAmount" },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);


    /* RECENT SALES */

    const recentSales = await Sale.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("billNumber finalAmount createdAt");


    /* RESPONSE */

    res.status(200).json({
      success: true,

      summary: {
        dailyOrders,
        totalProductsSold,
        todayRevenue,
        lowStockItems: lowStockProducts.length
      },

      lowStockProducts,

      recentSales,

      salesChart

    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};