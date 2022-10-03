import express from "express";
import { chatroomController } from "../server";
import { formidableMiddleware } from "../utils/formidable";

export const chatroomRoutes = express.Router();

chatroomRoutes.post("/form/:cid", formidableMiddleware, chatroomController.formMessage);

chatroomRoutes.post("/counter/:cid", chatroomController.counterMessage);
chatroomRoutes.post("/score/:cid", chatroomController.scoreMessage);
chatroomRoutes.post("/delete", chatroomController.deleteRoom);
chatroomRoutes.post("/createRoom", chatroomController.createRoom);

