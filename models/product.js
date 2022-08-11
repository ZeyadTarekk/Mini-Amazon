const fs = require("fs");
const path = require("path");
const Cart = require("./cart");
const getPath = () => {
  return path.join(
    path.dirname(require.main.filename),
    "data",
    "products.json"
  );
};

const getProductsFromFile = (callback) => {
  fs.readFile(getPath(), (err, fileContent) => {
    if (err) callback([]);
    else callback(JSON.parse(fileContent));
  });
};

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
    getProductsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (prod) => prod.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(getPath(), JSON.stringify(updatedProducts), (err) => {
          //that callback function attached to the readfile must be arrow function to make the this keyword point to the whole class
          if (err) console.log(err);
        });
      } else {
        this.id = Math.random().toString();
        fs.writeFile(getPath(), JSON.stringify([...products, this]), (err) => {
          //that callback function attached to the readfile must be arrow function to make the this keyword point to the whole class
          if (err) console.log(err);
        });
      }
    });
  }

  static fetchAll(callback) {
    getProductsFromFile(callback);
  }

  static fetchProductById(prodId, callback) {
    getProductsFromFile((products) => {
      products.forEach((element) => {
        if (element.id == prodId) callback(element);
        return;
      });
    });
  }

  static deleteProduct(prodId) {
    this.fetchProductById(prodId, (element) => {
      Cart.deleteItem(prodId, element.price);
    });
    getProductsFromFile((products) => {
      const newProducts = products.filter((prod) => prod.id != prodId);
      fs.writeFile(getPath(), JSON.stringify(newProducts), (err) => {
        if (err) console.log(err);
      });
    });
  }
};
