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

app.use(async (req, res, next) => {
  const dummyUser = await User.findByPk(1);
  req.user = dummyUser;
  next();
});

// admin/anyRoute
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// Define releations between models
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

sequelize
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({
        name: "zeyad",
        email: "test@g.com",
      });
    }
    return user;
  })
  .then((user) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
