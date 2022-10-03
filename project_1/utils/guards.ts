import type { Request, Response, NextFunction } from "express";

export const isLoggedInStatic = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session["user"]) {
    res.redirect("/");
    return;
  }
  next();
};

export const isLoggedInAPI = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session["user"]) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }
  next();
};
