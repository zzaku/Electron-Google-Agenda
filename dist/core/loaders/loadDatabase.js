"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = require("knex");
const dotenv = require("dotenv");
dotenv.config();
const myDb = (0, knex_1.default)({
    client: 'mysql',
    connection: {
        host: process.env.HOST_DB,
        port: 3306,
        user: process.env.USER_DB,
        password: process.env.PASSWORD_DB,
        database: process.env.BDD
    }
});
exports.default = myDb;
