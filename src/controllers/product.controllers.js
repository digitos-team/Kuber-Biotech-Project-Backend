import { isValidObjectId } from "mongoose"
import { Product } from "../models/products.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadFile } from "../utils/fileupload.js"
import { translateToMarathi } from "../utils/translator.js"


const getAllProduct = asyncHandler(async (req, res) => {
  //add the page no ,skip and limit
  //get the product based on this
  //count the total number of product not neccessary optional but for Frontend
  //return the Product

  const limit = parseInt(req.query.limit)
  const page = parseInt(req.query.page)
  const skip = (page - 1) * limit

  const product = await Product.find().skip(skip).limit(limit)

  const totalproducts = await Product.countDocuments()

  if (!product) {
    throw new ApiError(403, "There is Something Went Wrong")
  }

  return res.status(200)
    .json(
      new ApiResponse(
        200,
        [page, totalproducts, product],
        "Product Fetched Succesfully"
      )
    )

})

const addProduct = asyncHandler(async (req, res) => {
  const { name, description, category } = req.body
  let imageUrl = []


  if (!req.files || req.files.length === 0) {
    throw new ApiError(404, "File not Uploaded")
  }

  for (const file of req.files) {
    const productimages = await uploadFile(file.path)
    if (productimages) imageUrl.push(productimages.url)
  }


  if (!name || !description  || !category) {
    throw new ApiError(403, "Every Field Is required")
  }

  // Category mapping for English to Marathi
  const categoryMap = {
    "Granule Products": "ग्रॅन्युल उत्पादने",
    "Liquid Products": "द्रव उत्पादने"
  };

  // Validate category
  if (!categoryMap[category]) {
    throw new ApiError(400, "Invalid category. Must be 'Granule Products' or 'Liquid Products'")
  }

  // Translate name and description to Marathi
  const nameMarathi = await translateToMarathi(name)
  const descriptionMarathi = await translateToMarathi(description)

  // Create bilingual product object
  const addedProduct = await Product.create({
    name: {
      en: name,
      mr: nameMarathi
    },
    description: {
      en: description,
      mr: descriptionMarathi
    },
   images: imageUrl,
    category: {
      en: category,
      mr: categoryMap[category]
    }
  })

  return res.status(200)
    .json(
      new ApiResponse(200, addedProduct, "Product Added Succesfully")
    )
})

const editProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!isValidObjectId(productId)) {
    throw new ApiError(400, "Invalid Product ID");
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    throw new ApiError(400, "At least one field is required to update");
  }

  // Category mapping for bilingual support
  const categoryMap = {
    "Granule Products": "ग्रॅन्युल उत्पादने",
    "Liquid Products": "द्रव उत्पादने"
  };

  const updateFields = {};

  // Handle name update (bilingual)
  if (req.body.newname) {
    const nameMarathi = await translateToMarathi(req.body.newname);
    updateFields["name.en"] = req.body.newname;
    updateFields["name.mr"] = nameMarathi;
  }

  // Handle description update (bilingual)
  if (req.body.newdescription) {
    const descriptionMarathi = await translateToMarathi(req.body.newdescription);
    updateFields["description.en"] = req.body.newdescription;
    updateFields["description.mr"] = descriptionMarathi;
  }


  // Handle category update (bilingual)
  if (req.body.newcategory) {
    if (!categoryMap[req.body.newcategory]) {
      throw new ApiError(400, "Invalid category. Must be 'Granule Products' or 'Liquid Products'");
    }
    updateFields["category.en"] = req.body.newcategory;
    updateFields["category.mr"] = categoryMap[req.body.newcategory];
  }

  if (Object.keys(updateFields).length === 0) {
    throw new ApiError(400, "No valid fields provided for update");
  }

  const editedProduct = await Product.findByIdAndUpdate(
    productId,
    { $set: updateFields },
    { new: true } // return updated document
  );

  if (!editedProduct) {
    throw new ApiError(404, "Product not found");
  }

  return res.status(200).json(
    new ApiResponse(200, editedProduct, "Product updated successfully")
  );
});

const deleteProduct = asyncHandler(async (req, res) => {

  const { productId } = req.params

  if (!isValidObjectId(productId)) {
    throw new ApiError(403, "Invalid Product Id")
  }

  const deletingProduct = await Product.findByIdAndDelete(productId)
  return res.status(200)
    .json(
      new ApiResponse(200, deletingProduct, "The Above Fetched Product deleted Succesfully")
    )
})




export { addProduct, editProduct, deleteProduct, getAllProduct }