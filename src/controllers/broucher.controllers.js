import {ApiError} from '../utils/ApiError.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {Broucher} from '../models/broucher.model.js';
import path from 'path';
import fs from 'fs';



const addbroucher = asyncHandler(async(req, res, next) => {
    const file = req.file;
    
    if (!file) {
        return next(new ApiError(400, 'Please upload a file'));
    }
    
    // Generate public URL for the uploaded file
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/brochures/${file.filename}`;
    
    console.log("File uploaded:", file.filename);
    console.log("Public URL:", fileUrl);
    console.log("File size:", file.size);
    
    const broucher = await Broucher.create({
        title: req.body.title,
        fileurl: fileUrl,  // ✅ Save public URL
        filename: file.filename  // Optional: save filename for deletion later
    });
    
    return res.json(new ApiResponse(200, broucher, 'Brochure added successfully'));
});

const deletebroucher = asyncHandler(async(req,res,next)=>{
    const broucher = await Broucher.findByIdAndDelete(req.params.id);
    if(!broucher){
        return next(new ApiError(404,'Broucher not found'));
    }
    return res.json(new ApiResponse(200,broucher,'Broucher deleted successfully'));
})

const downloadBrochure = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const brochure = await Broucher.findById(id);
  
  

  if (!brochure) {
    throw new ApiError(404, "Brochure Not Found");
  }

  // Extract filename from the URL
  // Example: "http://localhost:3000/uploads/brochures/brochure-123456.pdf"
  // We need: "brochure-123456.pdf"
  const filename = brochure.fileurl.split('/').pop();

  // Build the file path
  const filePath = path.join(process.cwd(), 'public', 'uploads', 'brochures', filename);

  console.log('Filename:', filename);
  console.log('File path:', filePath);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    throw new ApiError(404, "File not found on server");
  }

  // Get original filename from title or use the stored filename
  const downloadFilename = brochure.title ? `${brochure.title}.pdf` : filename;

  // Set headers for file download
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${downloadFilename}"`);
  
  // Send the actual file
  return res.sendFile(filePath);
});

const getallbroucher = asyncHandler(async (req, res) => {
    const broucher = await Broucher.find();
    return res.json(new ApiResponse(200,broucher,'Broucher fetched successfully'));
})

export {addbroucher,deletebroucher,downloadBrochure,getallbroucher};