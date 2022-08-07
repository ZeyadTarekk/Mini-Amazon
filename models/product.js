const fs = require("fs");
const path = require("path");

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

  constructor(t) {
    this.title = t;
  }

  save() {
    getProductsFromFile((products) => {
      fs.writeFile(getPath(), JSON.stringify([...products, this]), (err) => {
        //that callback function attached to the readfile must be arrow function to make the this keyword point to the whole class
        if (err) console.log(err);
      });
    });
  }

  static fetchAll(callback) {
    getProductsFromFile(callback);
  }
};
