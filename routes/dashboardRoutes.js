import express from "express";
import {
  getDailyOrders,
  getDailyProductsSold,
  getDashboardStats,
  getLowStockProducts,
  getSalesChart
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/daily-orders", getDailyOrders);
router.get("/daily-products-sold", getDailyProductsSold);
router.get("/low-stock", getLowStockProducts);
router.get("/sales-chart", getSalesChart);
router.get("/dashboard-stats",getDashboardStats )

export default router;