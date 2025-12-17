import { Router } from "express";
import {createContact,getallContact,deleteContact} from "../controllers/contact.controller.js"
import { IsAdmin } from "../middleware/isAdmin.middlerware.js"
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router()



router.route("/create-contact").post(createContact)
router.route("/getall-contact").get(verifyJWT,IsAdmin,getallContact)
router.route("/delete-contact/:id").delete(verifyJWT,IsAdmin,deleteContact)

export default router


