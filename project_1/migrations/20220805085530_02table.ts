import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("exe_a");
  await knex.schema.dropTableIfExists("exe_b");
  await knex.schema.dropTableIfExists("exe_c");
  await knex.schema.dropTableIfExists("users");

  const hasTable = await knex.schema.hasTable("users");
  if (!hasTable) {
    await knex.schema.createTable("users", (table) => {
      table.increments();
      table.string("username").notNullable().unique();
      table.string("player_name").notNullable().unique();
      table.string("password").notNullable();
      table.string("photo_name");
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable("exe_a"))) {
    await knex.schema.createTable("exe_a", (table) => {
      table.increments();
      table.integer("users_id").unsigned();
      table.foreign("users_id").references("users.id");
      table.integer("point");
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable("exe_b"))) {
    await knex.schema.createTable("exe_b", (table) => {
      table.increments();
      table.integer("users_id").unsigned();
      table.foreign("users_id").references("users.id");
      table.integer("point");
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable("exe_c"))) {
    await knex.schema.createTable("exe_c", (table) => {
      table.increments();
      table.integer("users_id").unsigned();
      table.foreign("users_id").references("users.id");
      table.integer("point");
      table.timestamps(false, true);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("exe_a");
  await knex.schema.dropTableIfExists("exe_b");
  await knex.schema.dropTableIfExists("exe_c");
  await knex.schema.dropTableIfExists("users");
}
