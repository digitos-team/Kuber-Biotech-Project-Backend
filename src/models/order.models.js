import mongoose, { Schema } from "mongoose";


const userproductSchema = new mongoose.Schema({
    quantity:{
        type:Number,
        required:true
    },
    price:{
        type:Schema.Types.ObjectId,
        ref:"Product"
    }
})

const orderSchema = new mongoose.Schema({
    orderId:{
        type:String,
        required:true
    },
    OrderStatus:{
        type:String,
        required:true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    products:[userproductSchema],
    totalamount:{
        type:Number,
        required:true
    },
    Status:{
        type:String,
        enum: ["PENDING", "PAID", "FAILED"],
        default:"PENDING"
    }
},{timestamps:true})

export const  Order = mongoose.model("Order",orderSchema)