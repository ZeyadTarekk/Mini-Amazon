const Cart = require("./cart");
const db = require("../util/database");
module.exports = class Product {
  title;
  price;
  description;
  photo;
  id;
  constructor(id, tit, pr, desc, photo) {
    this.id = id;
    this.title = tit;
    this.price = pr;
    this.description = desc;
    this.photo = photo;
  }

  save() {
    const query = `INSERT INTO products (title, price, description, photoUrl) VALUES ("${this.title}", "${this.price}", "${this.description}", "${this.photo}")`;
    db.execute(query);
  }

  static fetchAll() {
    return db.execute("SELECT * from products");
  }

  static fetchProductById(prodId) {
    return db.execute(`SELECT * from products WHERE id=${prodId}`);
  }

  static deleteProduct(prodId) {}
};
