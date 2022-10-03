//import express from "express";
//import type { Request, Response, NextFunction } from "express";
//import httpStatusCodes from "http-status-codes";
//import { logger } from "../utils/logger";
//import {io } from "../server";
//import { Chatroom } from "../models";
//import { Socket } from "socket.io";
//import formidable from "formidable";
//import { formidableMiddleware } from "../formidable";
import { Knex } from "knex";
import { Chatroom } from "../models";

export class ChatroomService {
  constructor(private knex: Knex) {}

  //checkChatroom
  async checkChatroom(host: string): Promise<Chatroom | undefined> {
    return (
      await this.knex
        .select("id", "host_id", "join_id")
        .from("chatroom")
        .where("host_id", "=", `${host}`)
    )[0];
  }

  //getHostNameById
  async getHostNameById(id: number) {
    return (await this.knex.select("player_name").from("users").where("id", "=", `${id}`))[0];
  }

  //insertChatroom
  async insertChatroom(host: string) {
    await this.knex.insert([{ host_id: `${host}` }]).into("chatroom");
  }

  //deleteChatroom
  async deleteChatroom(id: string) {
    await this.knex("chatroom").where("host_id", `${id}`).orWhere("join_id", `${id}`).del();
  }

  //lookforChatroom
  async searchChatroom(target: string, id: string) {
    await this.knex("chatroom")
      .where("host_id", "=", `${target}`)
      .update({
        join_id: `${id}`,
      });
  }
}

//export const chatroomRoutes = express.Router();
//
////chatroomRoutes.get("/", getUserAllChatroom);
////chatroomRoutes.get("/get/:cid", getUserMessage);
//chatroomRoutes.post("/form/:cid", formidableMiddleware, formMessage);
//chatroomRoutes.post("/play/:cid", sendMessage);
//chatroomRoutes.post("/counter/:cid", counterMessage);
//chatroomRoutes.post("/delete", deleteRoom);
//chatroomRoutes.post("/createRoom", createRoom);

//host createroom first
//async function createRoom(req: Request, res: Response, next: NextFunction) {
//    try{const id = req.session!["user"]["id"];
//    console.log("createroom", id)
//    const result = await knex
//      .select("*")
//      .from("chatroom")
//      .where("host_id", "=", `${id.toString()}`)
//      if(result){
//        res.status(500).json({ message: "internal server error" });
//        return;
//      }
//      await knex.insert([
//        {host_id: `${id.toString()}`,
//        }
//
//    ]).into("chatroom")
//
//}
//    catch (err) {
//        console.log(err);
//        res.status(500).json({ message: "internal server error" });
//      }
//}
////final delete room
//async function deleteRoom(req: Request, res: Response, next: NextFunction) {
//    try {
//        //const form = req.form!;
//        //const target = form.fields.nick_name as String;
//        const id = req.session!["user"]["id"];
//        //const host = req.body.host;
//        console.log("deleteid", id)
//        //console.log("deletehost", host)
//        await knex("chatroom")
//        .where("host_id", `${id.toString()}`)
//        .orWhere("join_id", `${id.toString()}`)
//        .del()
//        //const chatroomId = parseInt(req.params.cid, 10);
//        //console.log("chatroomId", chatroomId)
//        //const counter = req.body.counter;
//        //console.log("counter", counter)
//        //console.log("target", target)
//      //const id = req.session!["user"]["id"];
//      //console.log("type", typeof id)
//      //console.log("type", typeof target)
//      //if(id.toString() === target){
//      //  res.status(500).json({ message: "internal server error" });
//      //  return;
////
//      //}
//      //const { content, sentTime } = req.body;
//      //const chatroomId = parseInt(req.params.cid, 10);
//      //console.log(content)
//      //console.log(sentTime)
//      //console.log("someone has joined", target)
//      //const content = `jo
//      //io.to(`room-${chatroomId}`).emit("message", {counter});
//      res.json({ success: true, message: "success" });
//      //if (isNaN(target)) {
//      //  res.status(400).json({ message: "invalid user id" });
//      //  return;
//
//
// //    const chatroom = (await dbUser.query<Chatroom>(
// //        /*sql */ `SELECT * FROM chatroom
// //        WHERE id = $1 AND (user_id_left = $2 OR user_id_right = $3)`,
// //        [chatroomId, user.id, user.id]
// //      )
// //    ).rows[0];
// //    if (!chatroom) {
// //      res.status(400).json({ message: "invalid chatroom" });
//
//      }
//
//     catch (err) {
//      console.log(err);
//      res.status(500).json({ message: "internal server error" });
//    }
//  }
////send counter to opponent
//async function counterMessage(req: Request, res: Response, next: NextFunction) {
//    try {
//        //const form = req.form!;
//        //const target = form.fields.nick_name as String;
//        const chatroomId = parseInt(req.params.cid, 10);
//        console.log("chatroomId", chatroomId)
//        const counter = req.body.counter;
//        console.log("counter", counter)
//        //console.log("target", target)
//      //const id = req.session!["user"]["id"];
//      //console.log("type", typeof id)
//      //console.log("type", typeof target)
//      //if(id.toString() === target){
//      //  res.status(500).json({ message: "internal server error" });
//      //  return;
////
//      //}
//      //const { content, sentTime } = req.body;
//      //const chatroomId = parseInt(req.params.cid, 10);
//      //console.log(content)
//      //console.log(sentTime)
//      //console.log("someone has joined", target)
//      //const content = `jo
//      io.to(`room-${chatroomId}`).emit("message", {counter});
//      res.json({ success: true, message: "success" });
//      //if (isNaN(target)) {
//      //  res.status(400).json({ message: "invalid user id" });
//      //  return;
//
//
// //    const chatroom = (await dbUser.query<Chatroom>(
// //        /*sql */ `SELECT * FROM chatroom
// //        WHERE id = $1 AND (user_id_left = $2 OR user_id_right = $3)`,
// //        [chatroomId, user.id, user.id]
// //      )
// //    ).rows[0];
// //    if (!chatroom) {
// //      res.status(400).json({ message: "invalid chatroom" });
//
//      }
//
//     catch (err) {
//      console.log(err);
//      res.status(500).json({ message: "internal server error" });
//    }
//  }
////init send to host messages
//async function sendMessage(req: Request, res: Response, next: NextFunction) {
//    try {
//        //const form = req.form!;
//        //const target = form.fields.nick_name as String;
//        const sentmeid = req.body.msg;
//        console.log("sentmeid", sentmeid)
//        //console.log("target", target)
//      //const id = req.session!["user"]["id"];
//      //console.log("type", typeof id)
//      //console.log("type", typeof target)
//      //if(id.toString() === target){
//      //  res.status(500).json({ message: "internal server error" });
//      //  return;
////
//      //}
//      //const { content, sentTime } = req.body;
//      //const chatroomId = parseInt(req.params.cid, 10);
//      //console.log(content)
//      //console.log(sentTime)
//      //console.log("someone has joined", target)
//      //const content = `jo
//      io.to(`room-${sentmeid}`).emit("message", {sentmeid});
//      res.json({ success: true, message: "success" });
//      //if (isNaN(target)) {
//      //  res.status(400).json({ message: "invalid user id" });
//      //  return;
//
//
// //    const chatroom = (await dbUser.query<Chatroom>(
// //        /*sql */ `SELECT * FROM chatroom
// //        WHERE id = $1 AND (user_id_left = $2 OR user_id_right = $3)`,
// //        [chatroomId, user.id, user.id]
// //      )
// //    ).rows[0];
// //    if (!chatroom) {
// //      res.status(400).json({ message: "invalid chatroom" });
//
//      }
//
//     catch (err) {
//      console.log(err);
//      res.status(500).json({ message: "internal server error" });
//    }
//  }
////init send to host messages
//async function formMessage(req: Request, res: Response, next: NextFunction) {
//    try {
//        const form = req.form!;
//        const target = form.fields.nick_name as String;
//        console.log("target", target)
//      const id = req.session!["user"]["id"];
//      //console.log("type", typeof id)
//      //console.log("type", typeof target)
//
//      if(id.toString() === target){
//        res.status(500).json({ message: "internal server error" });
//        return;
//
//      }
//      const result = await knex
//      .select("*")
//      .from("chatroom")
//      .where("host", "=", `${target}`)
//      //.orWhere("users_left_id", "=", `${id.toString()}`)
//      //.orWhere("users_right_id", "=", `${id.toString()}`)
//      console.log("join result", result)
//      if(result && result[0].join_id == null){
//        knex('chatroom')
//  .where('host_id', '=', "target")
//  .update({
//    join_id: `${id.toString()}`
//
//
//  })
//  console.log("someone has joined", target)
//  //const content = `jo
//
//  io.to(`room-${target}`).emit("message", {id  });
//  res.json({ success: true, message: "success" });
//
//
//      } else { res.status(500).json({ message: "internal server error" });
//      return;}
//
//      //const { content, sentTime } = req.body;
//      //const chatroomId = parseInt(req.params.cid, 10);
//      //console.log(content)
//      //console.log(sentTime)
//
//      //if (isNaN(target)) {
//      //  res.status(400).json({ message: "invalid user id" });
//      //  return;
//
//
// //    const chatroom = (await dbUser.query<Chatroom>(
// //        /*sql */ `SELECT * FROM chatroom
// //        WHERE id = $1 AND (user_id_left = $2 OR user_id_right = $3)`,
// //        [chatroomId, user.id, user.id]
// //      )
// //    ).rows[0];
// //    if (!chatroom) {
// //      res.status(400).json({ message: "invalid chatroom" });
//
//      }
//
//
//     catch (err) {
//      console.log(err);
//      res.status(500).json({ message: "internal server error" });
//    }
//  }
//
// //     await dbUser.query(
// //       /*sql */ `INSERT INTO message (content, chatroom_id, sender, time_started) VALUES ($1, $2, $3, $4);`,
// //       [content, chatroomId, user.id, sentTime]
// //     );
// //
// //     const time = (await dbUser.query(
// //       /*sql */ `SELECT time_started from message where content = $1 and chatroom_id = $2 and sender= $3 and time_started = $4;`,
// //       [content, chatroomId, user.id, sentTime]
// //     )).rows[0];
//
//  //    const targetUserId = chatroom.user_id_left === user.id ? chatroom.user_id_right : chatroom.user_id_left;
//
//
//
//     //target and myself
//
//      //io.to(`room-${user.id}`).emit("message", { chatroom_id: chatroomId, content });
//
//
//
//
//////load messages
////async function getUserMessage(req: Request, res: Response, next: NextFunction) {
////  const chatroomId = parseInt(req.params.cid, 10);
////  console.log("Someone has joined", chatroomId)
////  const result = (await dbUser.query('SELECT * FROM message where chatroom_id = $1', [chatroomId])).rows
////  //console.log(result)
////  res.json(result)
////}
////
////
//////load rooms
////async function getUserAllChatroom(req: Request, res: Response, next: NextFunction) {
////  try {
////    const user = req.session["user"];
////    const chatroomArr = (
////      await dbUser.query(
////        /*sql*/ `SELECT * FROM chatroom WHERE user_id_left = $1 OR user_id_right = $2`,
////        [user.id, user.id]
////      )
////    ).rows;
////    //console.log(chatroomArr)
////
////    for(let i of chatroomArr) {
////    let targetUserId = i.user_id_left === user.id ? i.user_id_right : i.user_id_left;
////    //console.log("targetUserId", targetUserId)
////    const name = (await dbUser.query('SELECT username FROM users where id = $1', [targetUserId])).rows[0].username;
////    //console.log("name", name)
////    const image = (await (await dbUser.query('SELECT file_name FROM user_photo where user_id = $1', [targetUserId])).rows[0].file_name);
////    //console.log("image", image)
////    i.name = name;
////    i.image = image;
////
////    }
////
////    res.json({chatroomArr, user});
////  } catch (err) {
////    console.log(err);
////    res.status(500).json({ message: "internal server error" });
////  }
////}
////
