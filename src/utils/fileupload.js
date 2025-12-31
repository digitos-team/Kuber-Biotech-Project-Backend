import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})



const uploadFile = async (localPath) => {
  try {
    if (!localPath) return "file path is not received";
    
    // Determine resource type based on file extension
    const isRawFile = localPath.match(/\.(pdf|doc|docx|txt|zip)$/i);
    
    const response = await cloudinary.uploader.upload(localPath, {
      resource_type: isRawFile ? "raw" : "auto",  // Use "raw" for PDFs
    });
    
    fs.unlinkSync(localPath);
    return response;
  } catch (err) {
    console.error("Cloudinary upload error:", err.message);
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }
    return null;
  }
};



export {uploadFile};