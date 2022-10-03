import Knex from "knex";
const knexfile = require("../knexfile"); 
const knex = Knex(knexfile["test"]); 
import { ExeService } from "./ExeService";
import { UserService } from "./UserService";

describe("ExeService", () => {
  let exeService: ExeService;
  let userService: UserService;

  beforeEach(async () => {
    exeService = new ExeService(knex);
    userService = new UserService(knex);
    await knex.raw(`TRUNCATE exe_a CASCADE`);
    await knex.raw(`TRUNCATE exe_b CASCADE`);
    await knex.raw(`TRUNCATE exe_c CASCADE`);
    await knex.raw(`TRUNCATE users CASCADE`);

    const result: Array<{ id: number }> = await knex
      .insert([
        {
          username: "jason@tecky.io",
          player_name: "jason",
          password: "$2a$10$CBSB8spNGmlAYbB3vb/gUeMS23FBrIGqHcZ6fN8phvLzZm0L2miXm",
        },
      ])
      .into("users")
      .returning("id");
    

    await knex.insert([{ users_id: result[0].id, point: "10" }]).into("exe_a");
    await knex.insert([{ users_id: result[0].id, point: "10" }]).into("exe_b");
    await knex.insert([{ users_id: result[0].id, point: "10" }]).into("exe_c");
  });

  it("create exe A", async () => {
    const user = await userService.insertUser("Peter@tecky.io", "Peter", "1234");
    const result = await exeService.insertExeA(user[0].id, 15);
    expect(result.length).toEqual(1);
  });
  it("create exe B", async () => {
    const user = await userService.insertUser("Peter@tecky.io", "Peter", "1234");
    const result = await exeService.insertExeB(user[0].id, 15);
    expect(result.length).toEqual(1);
  });
  it("create exe C", async () => {
    const user = await userService.insertUser("Peter@tecky.io", "Peter", "1234");
    const result = await exeService.insertExeC(user[0].id, 15);
    expect(result.length).toEqual(1);
  });
  afterAll(async () => {
    await knex.destroy();
  });
});
