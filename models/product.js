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
  price;
  description;
  photo;
  
  constructor(tit, pr, desc, photo) {
    this.title = tit;
    this.price = pr;
    this.description = desc;
    this.photo = photo;
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
