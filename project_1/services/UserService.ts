import { hashPassword } from "../utils/hash";
import { User } from "../models";
import { Knex } from "knex";

export class UserService {
  constructor(private knex: Knex) {}

  async getUserByUsername(username: string): Promise<any> {
    const result = (
      await this.knex
        .select("id", "username", "player_name", "password")
        .from("users")
        .where("username", "=", `${username}`)
    )[0];
    return result;
  }

  async insertUser(username: string, player_name: string, password: string): Promise<User> {
    const hashedPassword = await hashPassword(password);
    return await this.knex
      .insert({
        username: `${username}`,
        password: `${hashedPassword}`,
        player_name: `${player_name}`,
      })
      .into("users")
      .returning(["username", "id"]);
  }

  async searchSameUserName(username: string): Promise<User> {
    return (
      await this.knex
        .select("id", "username", "player_name", "password")
        .from("users")
        .where("username", "=", `${username}`)
    )[0];
  }

  async searchSamePlayerName(playerName: string): Promise<User> {
    return (
      await this.knex
        .select("id", "username", "player_name", "password")
        .from("users")
        .where("player_name", "=", `${playerName}`)
    )[0];
  }
}
