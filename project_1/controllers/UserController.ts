import type { UserService } from "../services/UserService";
import type { Request, Response } from "express";
import { checkPassword } from "../hash";

export class UserController {
  constructor(private service: UserService) {}

  login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ success: false, message: "invalid username/password" });
      return;
    }
    console.log("username & password :", username, password);
    const user = await this.service.getUserByUsername(username);

    if (!user || !(await checkPassword(password, user.password))) {
      res.status(401).json({ message: "no such user or wrong password" });
      return;
    }

    req.session["user"] = { id: user.id, username: user.username, player_name: user.player_name };

    res.json({ success: true, message: "logged in successfully" });
  };

  getUserInfo = async (req: Request, res: Response) => {
    try {
      const user = req.session!["user"];

      console.log("getUserInfo", user);
      const { id, ...others } = user;

      res.json({ success: true, user: others, id: id, player_name: user.player_name });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, message: "internal server error" });
    }
  };

  logout = async (req: Request, res: Response) => {
    if (req.session) {
      console.log("===================session", req.session);
      await req.session.destroy(function (err) {
        if (err) {
          console.log("cannot logout");
          res.json({ success: false, message: "cannot logout" });
        } else {
          console.log("logout successfully");
          res.json({ success: true, message: "logout successfully" });
        }
      });
    } else {
      res.json({ success: false, message: "invalid request" });
    }
  };

  signup = async (req: Request, res: Response) => {
    try {
      const { player_name, username, password } = req.body;

      if (!player_name || !username || !password) {
        res.json({ success: false, message: "please enter all fields" });
        return;
      }
      //check username
      const existUserName = await this.service.searchSameUserName(username);
      const existPlayerName = await this.service.searchSamePlayerName(player_name);
      if (existUserName && existPlayerName) {
        res.json({ success: false, message: "Email and player name already exist" });
        return;
      }

      if (existUserName) {
        res.json({ success: false, message: "Email already exists" });
        return;
      }
      //check username

      if (existPlayerName) {
        res.json({ success: false, message: "Player name already exists" });
        return;
      } else {
        console.log(player_name, username, password);

        await this.service.insertUser(username, player_name, password);
        res.json({ success: true });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, message: "internal server error" });
    }
  };
}
