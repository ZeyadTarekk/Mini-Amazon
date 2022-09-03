const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");
class Product {
  title;
  price;
  description;
  imageUrl;
  _id;
  userId;
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    if (id) this._id = mongodb.ObjectId(id);
    this.userId = userId;
  }

  async save() {
    const db = getDb();
    if (this._id)
      return await db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    else return await db.collection("products").insertOne(this);
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

  static async deleteById(prodId) {
    return await getDb()
      .collection("products")
      .deleteOne({ _id: mongodb.ObjectId(prodId) });
  }
}

module.exports = Product;
