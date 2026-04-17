import express from "express";
import authAdmin from "../middlewares/authAdmin.js";
import { generateReport } from "../controllers/reportController.js";

const reportRouter = express.Router();

reportRouter.get("/generate-report", authAdmin, generateReport);

export default reportRouter;
