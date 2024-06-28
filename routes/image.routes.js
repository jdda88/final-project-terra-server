import express from 'express';
import {uploadImage} from '../config/cloudinary.config.js'

const router = express.Router();

router.post('/upload', uploadImage.single('picture'), async (req, res, next) => {
try {
  if (!req.file) {
    console.log("no req file provided")
    return;
  }
  console.log("this is file uploaded", req.file)
  res.json({ image: req.file.path });
} catch (error) {
 console.log("error uploading images catch", error)
 return res.status(500).json(error) 
}


   
})

export default router;