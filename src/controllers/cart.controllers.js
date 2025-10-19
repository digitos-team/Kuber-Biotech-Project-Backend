import { isValidObjectId } from "mongoose"
import {Cart} from "../models/cart.models.js"
import {Product} from "../models/products.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const addtocart = asyncHandler(async (req,res) => {
     //get the user Id from req parameter
     const userId = req.user._id
     const {productId} = req.params

     if (!isValidObjectId(productId)) {
          throw new ApiError(403,"Invallid Product Id Found")
     }

     const product = await Product.findById(productId)
     if (!product) {
          throw new ApiError(404,"Product not Found")
     }
     
     let cart = await Cart.findOne({user:userId})
     if (!cart) {
          cart = await Cart.create({
               user:userId,
               item:[{productId}],
               total:product.price
          })
          return res
      .status(200)
      .json(new ApiResponse(200, cart, "Cart created successfully"))
     }

     

     const cartproduct = cart.item.find((p)=>p.productId.toString() == productId)

     if (cartproduct) {
          cartproduct.quantity += 1
          cart.total += product.price

     }else{
          cart.item.push({productId})
          cart.total += product.price
     }

     await cart.save()

     return res
     .status(200)
     .json(
          new ApiResponse(
               200,
               cart,
               "Cart update Succesfully"
          )
     )
})

const removeItemfromCart = asyncHandler(async (req,res) => {
    //taking product Id from the request 
    const {productId} = req.params

    const userId = req.user._id
    if (!isValidObjectId(productId)) {
          throw new ApiError(403,"Invalid Object Id")
     }

    const product = await Product.findById(productId)
     if (!product) {
          throw new ApiError(403,"Product Not Found")
     }

    let cart = await Cart.findOne({user:userId})

    if (!cart) {
         throw new ApiError(404,"Cart Is Empty")
    }

     const cartproduct = cart.item.find((p)=>p.productId.toString() === productId)


     if (!cartproduct) {
          throw new ApiError(404,"Product is not in cart")
     }

     if (cartproduct.quantity > 1) {
        // Just decrease the quantity
        cartproduct.quantity -= 1;
    } else {
        // Remove the product from the array
        cart.item = cart.item.filter(
            (p) => p.productId.toString() !== productId
        );
    }

     cart.total -= product.price

     if (cart.total<0)cart.total=0
     await cart.save();

    
    //return the response 
    return res
    .status(200)
    .json(
     new ApiResponse(
          200,
          cart,
          "Product Remove Succesfully from the Cart"
     )
    )
})

const getUserCartList = asyncHandler(async (req,res) => {
     //get the User Id From the Requested User
     const UserId = req.user._id

     if (!UserId) {
          throw new ApiError(404,"User not Found")
     }
     //Call Cart the data base 
     const userCart = await Cart.find({
          user:UserId
     })

     if (!userCart) {
          throw new ApiError(401,"Cart is Empty")
     }
     //return the response
     return res
     .status(200)
     .json(
          new ApiResponse(
               200,
               userCart,
               "User Cart Fetched Succesfully"
          )
     )
})






export {addtocart,removeItemfromCart,getUserCartList}