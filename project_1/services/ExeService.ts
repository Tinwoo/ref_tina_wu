import { Knex } from "knex";

export class ExeService {
  constructor(private knex: Knex) {}
  
  // ########
  //push up
  // ########
  async insertExeA(users_id: number, point: number) { 
    return await this.knex
      .insert<Array<{ id: number }>>({
        users_id: `${users_id}`,
        point: `${point}`,
      })
      .into("exe_a")
      .returning("id"); 
  }

  // get personal highest score in ExeA
  async getPersonalAHighestRecord(users_id: number) {
    const result = (
      await this.knex.raw(
        "SELECT * FROM users join exe_a on users.id = exe_a.users_id WHERE users_id =?  and exe_a.point = (SELECT MAX (point) FROM exe_a WHERE exe_a.users_id = users.id)",
        [`${users_id}`]
      )
    ).rows[0];
    return result;
  }

  //get highest score of the ExeA
  async getExeAHighestRecord() {
    const result = (await this.knex("exe_a").max("point").returning("point"))[0];
    return result;
  }

  // ########
  //button
  // ########
  async insertExeB(users_id: number, point: number) {
    return await this.knex
      .insert<Array<{ id: number }>>({
        users_id: `${users_id}`,
        point: `${point}`,
      })
      .into("exe_b")
      .returning("id");
  }

  // get personal highest score in ExeA
  async getPersonalBHighestRecord(users_id: number) {
    const result = (
      await this.knex.raw(
        "SELECT * FROM users join exe_b on users.id = exe_b.users_id WHERE users_id =?  and exe_b.point = (SELECT MAX (point) FROM exe_b WHERE exe_b.users_id = users.id)",
        [`${users_id}`]
      )
    ).rows[0];
    return result;
  }

  //get highest score of the ExeB
  async getExeBHighestRecord() {
    const result = (await this.knex("exe_b").max("point").returning("point"))[0];
    return result;
  }

// ########
  //bubble
// ########  
  // insert ExeC: scores
  async insertExeC(users_id: number, point: number) {
    return await this.knex
      .insert<Array<{ id: number }>>({
        users_id: `${users_id}`,
        point: `${point}`,
      })
      .into("exe_c")
      .returning("id");
  }

  // get personal highest score in ExeC
  async getPersonalCHighestRecord(users_id: number) {
    const result = (
      await this.knex.raw(
        "SELECT * FROM users join exe_c on users.id = exe_c.users_id WHERE users_id =?  and exe_c.point = (SELECT MAX (point) FROM exe_c WHERE exe_c.users_id = users.id)",
        [`${users_id}`]
      )
    ).rows[0];
    return result;
  }

  //get highest score of the ExeC
  async getExeCHighestRecord() {
    const result = (await this.knex("exe_c").max("point").returning("point"))[0];
    return result;
  }

  async getExeARank() {
    const result = (
      await this.knex.raw(
        "SELECT player_name , MAX(exe_a.point) FROM users JOIN exe_a on users.id = exe_a.users_id GROUP BY player_name Order BY max DESC LIMIT 5"
      )
    ).rows;
    return result;
  }

  async getExeBRank() {
    const result = (
      await this.knex.raw(
        "SELECT player_name , MAX(exe_b.point) FROM users JOIN exe_b on users.id = exe_b.users_id GROUP BY player_name Order BY max DESC LIMIT 5"
      )
    ).rows;
    return result;
  }

  async getExeCRank() {
    const result = (
      await this.knex.raw(
        "SELECT player_name , MAX(exe_c.point) FROM users JOIN exe_c on users.id = exe_c.users_id GROUP BY player_name Order BY max DESC LIMIT 5"
      )
    ).rows;
    return result;
  }
}
