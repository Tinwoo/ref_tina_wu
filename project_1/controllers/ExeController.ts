import type { ExeService } from "../services/ExeService";
import type { Request, Response } from "express";

export class ExeController {
  constructor(private service: ExeService) {}

  insertExeA = async (req: Request, res: Response) => {
    try {
      const users_id = req.session["user"]["id"];

      const point = parseInt(req.body.score);
      console.log("score", point);
      if (users_id && point) {
        await this.service.insertExeA(users_id, point);
      }
      res.json({ success: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "internal server error" });
    }
  };

  getPersonalAHighestRecord = async (req: Request, res: Response) => {
    try {
      const users_id = req.session!["user"]["id"];

      const result = await this.service.getPersonalAHighestRecord(users_id);

      if (result) {
        res.json(result);
      } else {
        res.json({ point: "0" });
      }
    } catch (err) {
      res.status(500).json({ message: "internal server error" });
    }
  };
  getExeAHighestRecord = async (req: Request, res: Response) => {
    try {
      const result = await this.service.getExeAHighestRecord();

      if (result) {
        res.json(result);
      } else {
        res.json({ point: "0" });
      }
    } catch (err) {
      res.status(500).json({ message: "internal server error" });
    }
  };

  insertExeB = async (req: Request, res: Response) => {
    try {
      const users_id = req.session["user"]["id"];

      const point = parseInt(req.body.scores);

      if (users_id && point) {
        await this.service.insertExeB(users_id, point);
      }
      res.json({ success: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "internal server error" });
    }
  };

  getPersonalBHighestRecord = async (req: Request, res: Response) => {
    try {
      const users_id = req.session!["user"]["id"];

      const result = await this.service.getPersonalBHighestRecord(users_id);
      console.log("getPersonalBHighestRecord:", result);

      if (result) {
        res.json(result);
      } else {
        res.json({ point: "0" });
      }
    } catch (err) {
      res.status(500).json({ message: "internal server error" });
    }
  };
  getExeBHighestRecord = async (req: Request, res: Response) => {
    try {
      const result = await this.service.getExeBHighestRecord();
      if (result) {
        res.json(result);
      } else {
        res.json({ point: "0" });
      }
    } catch (err) {
      res.status(500).json({ message: "internal server error" });
    }
  };

  insertExeC = async (req: Request, res: Response) => {
    try {
      const users_id = req.session["user"]["id"];

      const point = parseInt(req.body.scores);

      if (users_id && point) {
        await this.service.insertExeC(users_id, point);
      }
      res.json({ success: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "internal server error" });
    }
  };

  getPersonalCHighestRecord = async (req: Request, res: Response) => {
    try {
      const users_id = req.session!["user"]["id"];
      const result = await this.service.getPersonalCHighestRecord(users_id);
      console.log("getPersonalCHighestRecord", result);
      if (result) {
        res.json(result);
      } else {
        res.json({ point: "0" });
      }
    } catch (err) {
      res.status(500).json({ message: "internal server error" });
    }
  };

  getExeCHighestRecord = async (req: Request, res: Response) => {
    try {
      const result = await this.service.getExeCHighestRecord();

      if (result) {
        res.json(result);
      } else {
        res.json({ point: "0" });
      }
    } catch (err) {
      res.status(500).json({ message: "internal server error" });
    }
  };

  // ####ranking records####
  getExeARank = async (req: Request, res: Response) => {
    try {
      const result = await this.service.getExeARank();
      console.log("getExeARank", result);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "internal server error" });
    }
  };

  getExeBRank = async (req: Request, res: Response) => {
    try {
      const result = await this.service.getExeBRank();
      console.log("getExeARank", result);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "internal server error" });
    }
  };

  getExeCRank = async (req: Request, res: Response) => {
    try {
      const result = await this.service.getExeCRank();
      console.log("getExeARank", result);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "internal server error" });
    }
  };
}
