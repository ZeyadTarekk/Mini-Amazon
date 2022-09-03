const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
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
  const userState = await User.checkZeyad();
  if (!userState) {
    const user = new User("zeyad", "zeyad@g.com");
    user.save();
  }
  next();
});

// admin/anyRoute
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

const main = async () => {
  await databaseObject.mongoConnect();
  app.listen(3000);
};

main();
