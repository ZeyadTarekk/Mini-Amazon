const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");
class Product {
  title;
  price;
  description;
  imageUrl;
  _id;
  constructor(title, price, description, imageUrl, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id;
  }

  async save() {
    const db = getDb();
    if (this._id) {
      console.log("Entered save");
      return await db.collection("products").updateOne(
        { _id: mongodb.ObjectId(this._id) },
        {
          $set: {
            title: this.title,
            price: this.price,
            description: this.description,
            imageUrl: this.imageUrl,
          },
        }
      );
    } else {
      console.log("Entered insert");
      return await db.collection("products").insertOne(this);
    }
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
