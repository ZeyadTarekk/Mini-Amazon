const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const mongoose = require("mongoose");

const User = require("./models/user");
const databaseObject = require("./util/database");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.use(async (req, res, next) => {
  const user = await User.findById("6311f39fc904d34aecd9a29c");
  req.user = new User(user.name, user.email, user.cart, user._id);
  req.user.getOrders();
  next();
});

// admin/anyRoute
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

const main = async () => {
  // await databaseObject.mongoConnect();
  await mongoose.connect(
    `mongodb+srv://${process.env.user}:${process.env.password}@cluster0.xbhna.mongodb.net/shop?retryWrites=true&w=majority`
  );
  app.listen(3000);
};

main();
