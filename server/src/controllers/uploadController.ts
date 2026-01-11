import { Request, Response } from "express";

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    // req.file.location is the S3 URL when using multer-s3
    res.json({
      message: "Image uploaded successfully",
      imageUrl: (req.file as any).location,
    });
  } catch (error: any) {
    res.status(500).json({ message: `Error uploading image: ${error.message}` });
  }
};
