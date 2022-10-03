import express from "express";
import { exeController } from "../server";

export const exeRoutes = express.Router();

exeRoutes.post("/exeA", exeController.insertExeA);
exeRoutes.get("/exeA", exeController.getPersonalAHighestRecord);
exeRoutes.get("/exeA/highest", exeController.getExeAHighestRecord);

exeRoutes.post("/exeB", exeController.insertExeB);
exeRoutes.get("/exeB", exeController.getPersonalBHighestRecord);
exeRoutes.get("/exeB/highest", exeController.getExeBHighestRecord);

exeRoutes.post("/exeC", exeController.insertExeC);
exeRoutes.get("/exeC", exeController.getPersonalCHighestRecord);
exeRoutes.get("/exeC/highest", exeController.getExeCHighestRecord);

// ####ranking routes####
exeRoutes.get("/exeA/rank", exeController.getExeARank);
exeRoutes.get("/exeB/rank", exeController.getExeBRank);
exeRoutes.get("/exeC/rank", exeController.getExeCRank);

