import { Router } from "express";
import {addbroucher,deletebroucher,downloadBrochure,getallbroucher} from "../controllers/broucher.controllers.js"
import { IsAdmin } from "../middleware/isAdmin.middlerware.js"
import { verifyJWT } from "../middleware/auth.middleware.js";
import {upload}from "../middleware/multer.middleware.js"

const router = Router()


router.route("/add-broucher").post(verifyJWT,IsAdmin,upload.single("file"),addbroucher)
router.route("/delete-broucher/:id").delete(verifyJWT,IsAdmin,deletebroucher)
router.route("/download-broucher/:id").get(downloadBrochure)
router.route("/getall-broucher").get(getallbroucher)

export default router
