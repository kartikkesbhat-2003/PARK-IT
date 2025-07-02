
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";

import { Request } from "express";

interface CustomRequest extends Request {
  fileValidationError?: string;
}

const storage = multer.diskStorage({
  destination: (req: CustomRequest, file: Express.Multer.File, cb: any) => {
    cb(null, "uploads/");
  },
  filename: (req: CustomRequest, file, cb) => {
    try {
      const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
      const allowedExtensions = [
        ".pdf",
        ".docx",
        ".jpg",
        ".png",
        ".pptx",
        ".jpeg",
      ];
      const fileExt = path.extname(file.originalname).toLowerCase(); // Convert extension to lowercase

      if (!allowedExtensions.includes(fileExt)) {
        console.error(
          "Invalid file type. Only PDF, DOCX, JPG, JPEG, PNG, PPTX allowed."
        );

        req.fileValidationError =
          "Invalid file type. Only PDF, DOCX, JPG, JPEG, PNG, PPTX allowed.";
        return cb(new Error(req.fileValidationError), "false");
      }
      cb(null, uniqueFilename);
    } catch (error) {
      console.error("Error uploading file:", error);
      const msg = error instanceof Error ? error.message : "Unknown error";

      cb(new Error(msg), "false");
    }
  },
});

const upload = multer({ storage });

export default upload;
