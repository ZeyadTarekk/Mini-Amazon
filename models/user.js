const e = require("express");

const getDb = require("../util/database").getDb;
class User {
  username;
  email;
  constructor(username, email) {
    this.username = username;
    this.email = email;
  }

  async save() {
    const db = getDb();
    await db.collection("users").insertOne(this);
  }

  async findById(userId) {
    // const db = getDb();
    // await db.collection("users").find();
  }

  static async checkZeyad() {
    const db = getDb();
    const users = await db
      .collection("users")
      .find({ username: "zeyad" })
      .next();
    if (users) return true;
    else return false;
  }
}
module.exports = User;
