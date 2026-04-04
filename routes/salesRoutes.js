import express from "express";
import {
  createSale,
  dailySalesReport,
  weeklySalesReport,
  monthlySalesReport,
  getAllSales,
  getSalesByDate
} from "../controllers/saleController.js";

const router = express.Router();

router.post("/create", createSale);

router.get("/daily", dailySalesReport);

router.get("/weekly", weeklySalesReport);

router.get("/monthly", monthlySalesReport);

router.get("/all", getAllSales);

router.get("/by-date", getSalesByDate);

export default router;