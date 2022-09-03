const mongodb = require("mongodb");
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
    return await db.collection("users").insertOne(this);
  }

  static async findById(userId) {
    const db = getDb();
    return await db
      .collection("users")
      .find({ _id: mongodb.ObjectId(userId) })
      .next();
  }
}
module.exports = User;
