import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {createOrder,verifyPayment} from "../controllers/order.controllers.js"

const router = Router()
router.use(verifyJWT)
router.route("/createOrder").post(createOrder)
router.route("/verify-payment").post(verifyPayment)
router.route("/get-orders").get(GetUserOrders)

export default router
