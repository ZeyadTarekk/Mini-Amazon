const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");
class Product {
  title;
  price;
  description;
  imageUrl;
  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  async save() {
    const db = getDb();
    return await db.collection("products").insertOne(this);
  }

  static async fetchAll() {
    return await getDb().collection("products").find().toArray();
  }

  static async findById(prodId) {
    return await getDb()
      .collection("products")
      .find({ _id: mongodb.ObjectId(prodId) })
      .next();
  }
}

module.exports = Product;
