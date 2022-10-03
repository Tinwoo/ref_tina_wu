import formidable from "formidable";
import fs from "fs";
import type { Request, Response, NextFunction } from "express";
import type { Fields, Files } from "formidable";

declare global {
  namespace Express {
    interface Request {
      form?: {
        fields: Fields;
        files: Files;
      };
    }
  }
}

const uploadDir = "uploads";
fs.mkdirSync(uploadDir, { recursive: true });

const form = formidable({
  uploadDir,
  keepExtensions: true,
  maxFiles: 1,
  maxFileSize: 200 * 1024 ** 2, // the default limit is 200KB
  filter: (part) => part.mimetype?.startsWith("image/") || false,
});

export const formidableMiddleware = (req: Request, res: Response, next: NextFunction) => {
  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(400).json({ success: false, message: "failed to upload file" });
      return;
    }
    req.form = { fields, files };
    next();
  });
};
