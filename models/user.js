const mongodb = require("mongodb");
const { postDeleteCartItem } = require("../controllers/shop");
const getDb = require("../util/database").getDb;
class User {
  name;
  email;
  cart;
  constructor(name, email, cart, id) {
    this.name = name;
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

  async addOrder() {
    const products = await this.getCart();
    const order = {
      items: products,
      user: {
        _id: mongodb.ObjectId(this._id),
        name: this.name,
      },
    };
    const db = getDb();
    await db.collection("orders").insertOne(order);
    this.cart = { items: [] };
    await db
      .collection("users")
      .updateOne(
        { _id: mongodb.ObjectId(this._id) },
        { $set: { cart: this.cart } }
      );
  }

  async getOrders() {
    const db = getDb();
    // const orders = await db.collection("orders").find().toArray();
    // console.log(orders.items);
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
      items: this.cart.items.filter((el) => el.productId.toString() !== prodId),
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
