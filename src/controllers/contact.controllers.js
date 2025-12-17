import {Contact} from "../models/contact.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

//------------------------Create Contact----------------------------------
const createContact = asyncHandler(async (req,res) => {
    const {name,email,message} = req.body
    if (!name || !email || !message) {
        throw new ApiError(403,"All fields are required")
    }
    const contact = await Contact.create({name,email,message})
    return res.status(200).json(new ApiResponse(200,contact,"Contact Created Successfully"))
})
//_-------------------------------GEt All Contact---------------------------------
const getallContact = asyncHandler(async (req,res) => {
    const contact = await Contact.find()
    return res.status(200).json(new ApiResponse(200,contact,"All Contact Fetched Successfully"))
})
//---------------------------------Delete contact -----------------------------------
const deleteContact = asyncHandler(async (req,res) => {
    const contact = await Contact.findByIdAndDelete(req.params.id)
    return res.status(200).json(new ApiResponse(200,contact,"Contact Deleted Successfully"))
})


export {createContact,getallContact,deleteContact}