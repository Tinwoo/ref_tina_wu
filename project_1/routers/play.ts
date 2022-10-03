import express from "express";

export const play = express.Router();

play.use("/", (req, res) => {
  if (req.session["user"]) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});
