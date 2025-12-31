import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "file") {
      cb(null, './public/uploads/brochures')
    } else {
      cb(null, './public/temp')
    }
  },
  filename: function (req, file, cb) {
    if (file.fieldname === "file") {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'brochure-' + uniqueSuffix + path.extname(file.originalname));
    } else {
      cb(null, file.originalname)
    }
  }
})

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB max
  }
})