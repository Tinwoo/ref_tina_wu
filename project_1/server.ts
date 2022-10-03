import http from "http";
import express from "express";
import path from "path";
import expressSession from "express-session";

import { Server as SocketIO } from "socket.io";
import { isLoggedInStatic } from "./utils/guards";
import { knex } from "./db_knex";
import grant from "grant";

const grantExpress = grant.express({
  defaults: {
    origin: "http://localhost:8080",
    transport: "session",
    state: true,
  },
  google: {
    key: process.env.GOOGLE_CLIENT_ID || "",
    secret: process.env.GOOGLE_CLIENT_SECRET || "",
    scope: ["profile", "email"],
    callback: "/login/google",
  },
});

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const sessionMiddleware = expressSession({
  secret: "BADPROJECT",
  resave: true,
  saveUninitialized: true,
});
app.use(sessionMiddleware);
app.use(grantExpress as express.RequestHandler);

const server = new http.Server(app);
export const io = new SocketIO(server);

io.use((socket, next) => {
  let req = socket.request as express.Request;
  let res = req.res as express.Response;
  sessionMiddleware(req, res, next as express.NextFunction);
});


io.on("connection", function (socket) {
  console.log(`${socket.id} is connected !!!`);
  socket.on("message", (data) => {
    console.log(console.log(data));
  });
  const req = socket.request as express.Request;
  if (req.session["user"]) {
    const userId = req.session["user"].id;
    socket.join(`room-${userId}`);
  }

});

app.use((req, res, next) => {
  console.log(`req path: ${req.path}, method: ${req.method}`);
  next();
});

import { ExeService } from "./services/ExeService";
import { ExeController } from "./controllers/ExeController";
import { UserService } from "./services/UserService";
import { UserController } from "./controllers/UserController";
import { ChatroomController } from "./controllers/ChatroomController";
import { ChatroomService } from "./services/ChatroomService";

const exeService = new ExeService(knex);
const userService = new UserService(knex);
const chatroomService = new ChatroomService(knex);

export const exeController = new ExeController(exeService);
export const userController = new UserController(userService);
export const chatroomController = new ChatroomController(chatroomService, io);

import { exeRoutes } from "./routers/exeRoutes";
import { userRoutes } from "./routers/userRoutes";
import { chatroomRoutes } from "./routers/chatroomRoutes";

app.use("/exes", exeRoutes);
app.use(userRoutes);
app.use(chatroomRoutes);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "image")));
app.use("/image", express.static(path.join(__dirname, "uploads")));
app.use(isLoggedInStatic, express.static(path.join(__dirname, "private")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "404.html"));
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`listening at http://localhost:${PORT}`);
});
