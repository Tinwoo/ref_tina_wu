import Knex from "knex";
const knexConfig = require("./knexfile");

export const knex = Knex(knexConfig["development" || process.env.NODE_ENV]);


