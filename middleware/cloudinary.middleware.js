import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import * as dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// configure options for cloudinary 

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const filename = file.originalname.replace(/\.[^/.]+$/, "");
    const type = req.params.category;

    console.log("This is the filename", filename);
    console.log("This is the type of the file", type);
    const allowedFormats = ["jpg", "png"];
    const format = allowedFormats.includes("png") ? "png" : "jpg";
    const url = cloudinary.url(filename, {
      public_id: `${type}/${filename}`,
      format: format,
      secure: true,
    });

    const folder = "final-project";
    
    console.log("This is the url of the picture===>", url);

    return {
      folder,
      format: format,
      public_id: filename,
      access_mode: "public",
      url: url,
    };
  },
});

const uploadImage = multer({ storage });

export { uploadImage };