const Sequelize = require("sequelize");
require("dotenv").config();
const sequelize = new Sequelize(
  process.env.databasename,
  process.env.user,
  process.env.password,
  {
    dialect: "mysql",
    host: process.env.host,
  }
);

module.exports = sequelize;
