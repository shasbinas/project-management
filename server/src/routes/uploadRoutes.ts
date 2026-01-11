import { Router } from "express";
import { upload } from "../config/s3";
import { uploadImage } from "../controllers/uploadController";

const router = Router();

// "file" is the field name which should match the key in your FormData on the frontend
router.post("/", upload.single("file"), uploadImage);

export default router;
