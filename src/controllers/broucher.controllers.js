import {ApiError} from '../utils/ApiError.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {Broucher} from '../models/broucher.model.js';
import {uploadFile} from '../utils/fileupload.js';


const addbroucher = asyncHandler(async(req,res,next)=>{
    const file = req.file;
    
    if(!file){
        return next(new ApiError(400,'Please upload a file'));
    }
    const result = await uploadFile(file.path);
    const broucher = await Broucher.create({
        title: req.body.title,
        fileurl: result.url,
    })
    return res.json(new ApiResponse(200,broucher,'Broucher added successfully'));

})

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
      throw new ApiError(404,"broucher Not Found")
    }

    res.status(200).json(new ApiResponse(200,brochure,'Broucher downloaded successfully'));
})

const getallbroucher = asyncHandler(async (req, res) => {
    const broucher = await Broucher.find();
    return res.json(new ApiResponse(200,broucher,'Broucher fetched successfully'));
})

export {addbroucher,deletebroucher,downloadBrochure,getallbroucher};