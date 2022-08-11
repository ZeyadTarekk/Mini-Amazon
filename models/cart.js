const fs = require("fs");
const path = require("path");

const getPath = () => {
  return path.join(path.dirname(require.main.filename), "data", "cart.json");
};

module.exports = class Cart {
  static addProductToCart(prodId, prodPrice) {
    // Fetch The Previous Cart
    fs.readFile(getPath(), (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };

      if (!err) {
        cart = JSON.parse(fileContent);
      }
      // Analyze the cart => find existing product
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id == prodId
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty++;
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: prodId, qty: 1 };
        cart.products.push(updatedProduct);
      }
      cart.totalPrice += +prodPrice;
      fs.writeFile(getPath(), JSON.stringify(cart), (err) => {
        if (err) console.log(err);
      });
    });
  }

  static deleteItem(prodId, prodPrice) {
    fs.readFile(getPath(), (err, fileContent) => {
      if (!err) {
        const cartItems = JSON.parse(fileContent);
        const itemToDeleteIndex = cartItems.products.findIndex(
          (element) => element.id === prodId
        );
        if (itemToDeleteIndex != -1) {
          //That's to make sure that the deleted item is in the cart
          const updatedCartProducts = cartItems.products.filter(
            (item) => item.id !== prodId
          );
          const newCart = {
            products: updatedCartProducts,
            totalPrice:
              cartItems.totalPrice -
              cartItems.products[itemToDeleteIndex].qty * prodPrice,
          };
          fs.writeFile(getPath(), JSON.stringify(newCart), (err) => {
            if (err) console.log(err);
          });
        }
      } else {
        console.log(err);
      }
    });
  }
};
