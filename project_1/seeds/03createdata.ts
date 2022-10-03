import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("exe_a").del();
  await knex("exe_b").del();
  await knex("exe_c").del();
  await knex("users").del();

  // Inserts seed entries

  const result: Array<{ id: number }> = await knex
    .insert([
      {
        username: "jason@tecky.io",
        player_name: "jason",
        password: "$2a$10$CBSB8spNGmlAYbB3vb/gUeMS23FBrIGqHcZ6fN8phvLzZm0L2miXm",
      },
      {
        username: "adams@tecky.io",
        player_name: "adams",
        password: "$2a$10$CBSB8spNGmlAYbB3vb/gUeMS23FBrIGqHcZ6fN8phvLzZm0L2miXm",
      },
    ])
    .into("users")
    .returning("id");
  console.log(result);

  await knex
    .insert([
      { users_id: result[0].id, point: 10 },
      { users_id: result[1].id, point: 20 },
    ])
    .into("exe_a");

  await knex
    .insert([
      { users_id: result[0].id, point: 10 },
      { users_id: result[1].id, point: 20 },
    ])
    .into("exe_b");

  await knex
    .insert([
      { users_id: result[0].id, point: 10 },
      { users_id: result[1].id, point: 20 },
    ])
    .into("exe_c");
}
