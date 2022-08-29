const express = require("express");
const bodyParser = require("body-parser");

const path = require("path");

const Product = require("./models/product");
const User = require("./models/user");

const sequelize = require("./util/database");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

// admin/anyRoute
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// Define releations between models
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

sequelize
  .sync({ force: true })
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
