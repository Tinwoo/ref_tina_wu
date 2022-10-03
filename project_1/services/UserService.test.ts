import Knex from "knex";
const knexfile = require("../knexfile"); 
const knex = Knex(knexfile["test"]); 
import { UserService } from "./UserService";

describe("UserService", () => {
  let userService: UserService;

  beforeEach(async () => {
    userService = new UserService(knex);
    await knex.raw(`TRUNCATE exe_a CASCADE;`);
    await knex.raw(`TRUNCATE exe_b CASCADE;`);
    await knex.raw(`TRUNCATE exe_c CASCADE;`);
    await knex.raw(`TRUNCATE users CASCADE;`);
    await knex
      .insert({
        username: "adams@tecky.io",
        player_name: "adams",
        password: "$2a$10$CBSB8spNGmlAYbB3vb/gUeMS23FBrIGqHcZ6fN8phvLzZm0L2miXm",
      })
      .into("users");
  });

  it("insertUser", async () => {
    await knex("exe_a").del();
    await knex("exe_b").del();
    await knex("exe_c").del();
    await knex("users").del();
    const result = await userService.insertUser("john@tecky.io", "john", "1234");
    expect(result![0]["username"]).toEqual("john@tecky.io");
  });
  it("getUser", async () => {
    const result = await userService.getUserByUsername("adams@tecky.io");
    expect(result!["username"]).toEqual("adams@tecky.io");
  });

  afterAll(async () => {
    await knex.destroy();
  });
});
