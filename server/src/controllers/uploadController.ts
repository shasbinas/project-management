import { Request, Response } from "express";

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    // req.file.path is the Cloudinary URL when using multer-storage-cloudinary
    res.json({
      message: "Image uploaded successfully",
      imageUrl: (req.file as any).path,
    });
  } catch (error: any) {
    res.status(500).json({ message: `Error uploading image: ${error.message}` });
  }
};
