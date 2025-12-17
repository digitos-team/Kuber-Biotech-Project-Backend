import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        en: {
            type: String,
            required: true
        },
        mr: {
            type: String,
            required: true
        }
    },
    description:{
        en: {
            type: String,
            required: true
        },
        mr: {
            type: String,
            required: true
        }
    },
    price:{
        type:Number,
        required:true
    },
    images:
    [
    {
        type:String
    }
    ],
    category:{
        en: {
            type: String,
            required: true,
            enum: ["Granule Products", "Liquid Products"]
        },
        mr: {
            type: String,
            required: true,
            enum: ["ग्रॅन्युल उत्पादने", "द्रव उत्पादने"]
        }
    }
},{timestamps:true})

export const Product = mongoose.model('Product',productSchema)