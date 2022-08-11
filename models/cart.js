const fs = require("fs");
const path = require("path");

const getPath = () => {
  return path.join(path.dirname(require.main.filename), "data", "cart.json");
};

module.exports = class Cart {
  static AddProductToCart(prodId, prodPrice) {
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
};
