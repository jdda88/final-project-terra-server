import express from 'express';
import {uploadImage} from "../middleware/cloudinary.middleware.js" 

const router = express.Router();

router.post('/upload', uploadImage.single('picture', 5), (req, res, next) => {

    if (!req.file) {
        next(new Error("No file uploaded!"));
        return;
      }
      console.log("this is file uploaded", req.file)
      res.json({ image: req.file.path });
})

export default router;