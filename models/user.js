const mongodb = require("mongodb");
const { postDeleteCartItem } = require("../controllers/shop");
const getDb = require("../util/database").getDb;
class User {
  username;
  email;
  cart;
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart ? cart : [];
    this._id = id;
  }

  async save() {
    const db = getDb();
    return await db.collection("users").insertOne(this);
  }

  async addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(
      (prod) => prod.productId.toString() === product._id.toString()
    );
    let updatedCart;
    if (cartProductIndex != -1) {
      this.cart.items[cartProductIndex].quantity++;
      updatedCart = this.cart;
    } else
      updatedCart = {
        items: [...this.cart.items, { productId: product._id, quantity: 1 }],
      };

    const db = getDb();
    return await db
      .collection("users")
      .updateOne(
        { _id: mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  async getCart() {
    const db = getDb();
    const productIds = this.cart.items.map((prod) => prod.productId);
    const cartProducts = await db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray();
    const cartProductsWithQuantity = cartProducts.map((el) => {
      return {
        ...el,
        quantity: this.cart.items.find(
          (i) => i.productId.toString() === el._id.toString()
        ).quantity,
      };
    });
    return cartProductsWithQuantity;
  }

  async deleteCartItem(prodId) {
    const db = getDb();
    const updatedCart = {
      items: this.cart.items.filter((el) => el.productId.toString() != prodId),
    };

    db.collection("users").updateOne(
      { _id: mongodb.ObjectId(this._id) },
      { $set: { cart: updatedCart } }
    );
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
