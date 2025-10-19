import { Router } from "express";
import {verifyJWT} from "../middleware/auth.middleware.js"
import {addtocart,removeItemfromCart,getUserCartList} from "../controllers/cart.controllers.js"

const router = Router()

router.use(verifyJWT)
router.route("/add-to-cart/:productId").post(addtocart)
router.route("/remove-from-cart/:productId").delete(removeItemfromCart)
router.route("/User-cart").get(getUserCartList)

export default router