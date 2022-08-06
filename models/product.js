const fs = require("fs");
const path = require("path");
const p = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);
module.exports = class Product {
  title;

  constructor(t) {
    this.title = t;
  }

  save() {
    console.log(p);
    fs.readFile(p, (err, fileContent) => {
      let products = [];
      if (!err) {
        console.log(fileContent);
        products = JSON.parse(fileContent);
      }
      products.push(this); //that callback function attached to the readfile must be arrow function to make the this keyword point to the whole class
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll(callback) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        callback([]);
      }
      callback(JSON.parse(fileContent));
    });
  }
};
