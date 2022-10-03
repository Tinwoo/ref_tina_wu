import { UserController } from "./UserController";
import { UserService } from "../services/UserService";
import { Request, Response } from "express";
import { knex } from "../db_knex";

jest.mock("../services/UserService");

describe("MemoController", () => {
  let controller: UserController;
  let service: UserService;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    service = new UserService(knex);

    service.getUserByUsername = jest.fn((username: string) =>
      Promise.resolve({
        id: 162,
        player_name: "jason",
        username: "jason@tecky.io",
        password: "$2a$10$CBSB8spNGmlAYbB3vb/gUeMS23FBrIGqHcZ6fN8phvLzZm0L2miXm",
      })
    );

    controller = new UserController(service);
    req = {
      params: {},
      query: {},
      body: {},
      session: {},
    } as Request;
    res = { status: jest.fn(() => res), json: jest.fn() } as any as Response;
  });

  it("Login", async () => {
    req.body.username = "jason";
    req.body.password = "1234";
    await controller.login(req, res);

    expect(res.json).toBeCalledTimes(1);
  });
});
