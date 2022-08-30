const express = require("express");
const bodyParser = require("body-parser");

const path = require("path");

const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

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
User.hasOne(Cart);
Cart.belongsTo(User);
Order.belongsTo(User);
User.hasMany(Order);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

// let user;

const main = async () => {
  await sequelize.sync();
  let user = await User.findByPk(1);
  if (!user)
    user = await User.create({
      name: "zeyad",
      email: "test@g.com",
    });

  let cart = await Cart.findByPk(1);
  if (!cart) cart = await user.createCart();

  app.listen(3000);
};

main();
