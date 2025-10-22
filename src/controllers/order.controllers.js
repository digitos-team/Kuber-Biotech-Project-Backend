import { Order } from "../models/order.models.js";
import {Product} from  "../models/products.models.js"
import { Cart } from "../models/cart.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { razorpayInstance } from "../utils/Razorpay.js";
import Crypto from "crypto"


const createOrder = asyncHandler(async (req,res) => {
    const Instance = razorpayInstance()
    //get the Total amount To Create A Order
    const userId = req.user._id
    const cart = await Cart.findOne({user:userId})

    if (!cart) {
        throw new ApiError(404,"Cart Cannot Be Empty")
    }
    const totalamount = cart.total
    
    if (totalamount === 0 || !totalamount) {
        throw new ApiError(403,"Cannot make Payment of 0rs ")
    }

    const razropayOrder = await Instance.orders.create({
        amount:totalamount*100,
        currency:"INR",
        receipt:"receipt#1"
    })

    
    
    const OrderSavedInDB = await Order.create({
        orderId:razropayOrder.id,
        OrderStatus:razropayOrder.status,
        user:userId,
        products:cart.item,
        totalamount:razropayOrder.amount,
    })

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        OrderSavedInDB,
        "Order Created Sucessfully"
    ))
})
    

const verifyPayment = asyncHandler(async (req,res) => {
    
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const userId = req.user._id

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new ApiError(400, "Missing payment details");
    }

    // Generate your own signature using the Razorpay secret key
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    // Compare both signatures
    if (expectedSignature === razorpay_signature) {
        const order = await Order.findOne({user:userId})
        order.Status = "PAID"
        await order.save()
      return res
        .status(200)
        .json(new ApiResponse(200,order.Status, "Payment verified successfully"));
    } else {
      throw new ApiError(400, "Invalid payment signature");
    }
  
 
})

const GetUserOrders = asyncHandler(async (req,res) => {
    const userId = req.user._id
    const order = await Order.find({user:userId,Status:"PAID"})

    return res
    .status(200)
    .json(
        new ApiResponse(200,order,"Users Order Fetched Sucessfully")
    )
})

export {createOrder,verifyPayment,GetUserOrders}