const getDb = require("../util/database").getDb;
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
}

module.exports = Product;
