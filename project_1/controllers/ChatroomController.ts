import type { ChatroomService } from "../services/ChatroomService";
import type { Request, Response } from "express";
import type { Server as SocketIO } from "socket.io";
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

export class ChatroomController {
  constructor(private service: ChatroomService, private io: SocketIO) {}

  //host createroom first
  createRoom = async (req: Request, res: Response) => {
    try {
      const id = req.session!["user"]["id"];
      console.log("createroom", id);
      const result = await this.service.checkChatroom(id.toString());

      if (result) {
        res.status(500).json({ message: "internal server error" });
        return;
      }
      await this.service.insertChatroom(id.toString());
      res.json({ success: true, message: "success" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "internal server error" });
    }
  };

  //final delete room
  deleteRoom = async (req: Request, res: Response) => {
    try {
      const id = req.session!["user"]["id"];
      console.log("deleteid", id);
      await this.service.deleteChatroom(id.toString());

      res.json({ success: true, message: "success" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "internal server error" });
    }
  };

  //send counter to opponent for push up game
  counterMessage = async (req: Request, res: Response) => {
    try {
      const chatroomId = parseInt(req.params.cid, 10);

      const counter = req.body.counter;

      this.io.to(`room-${chatroomId}`).emit("counter", { counter });
      res.json({ success: true, message: "success" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "internal server error" });
    }
  };

  //send counter to opponent for balloon games
  scoreMessage = async (req: Request, res: Response) => {
    try {
      const chatroomId = parseInt(req.params.cid, 10);
      console.log("chatroomId", chatroomId);
      const scores = req.body.scores;
      console.log("scores", scores);

      this.io.to(`room-${chatroomId}`).emit("scores", { scores });
      res.json({ success: true, message: "success" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "internal server error" });
    }
  };

  //init send to host messages
  formMessage = async (req: Request, res: Response) => {
    try {
      const form = req.form!;
      const target = form.fields.nick_name as string;

      //to joiner itself
      const hostName = (await this.service.getHostNameById(parseInt(target))).player_name;

      //to host
      const id = req.session!["user"]["id"];
      const player_name = req.session!["user"]["player_name"];

      if (id.toString() === target) {
        res.status(500).json({ message: "internal server error" });
        return;
      }
      const result = await this.service.checkChatroom(target);

      console.log("join result", result);
      if (result && result.join_id == null) {
        await this.service.searchChatroom(target, id.toString());

        console.log("someone has joined", target);

        this.io.to(`room-${target}`).emit("message", { id, player_name });
        res.json({ success: true, message: "success", hostname: `${hostName}` });
      } else {
        res.status(500).json({ message: "internal server error", hostname: `${hostName}` });
        return;
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "internal server error" });
    }
  };
}
