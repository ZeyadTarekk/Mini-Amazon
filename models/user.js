const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = async function (product) {
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

  this.cart = updatedCart;
  return await this.save();
};

userSchema.methods.removeFromCart = async function (prodId) {
  const updatedCart = {
    items: this.cart.items.filter((el) => el.productId.toString() !== prodId),
  };
  this.cart = updatedCart;
  return await this.save();
};

userSchema.methods.clearCart = async function () {
  this.cart = { items: [] };
  await this.save();
};

module.exports = mongoose.model("User", userSchema);
