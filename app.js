const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const databaseObject = require("./util/database");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

// app.use(async (req, res, next) => {
// req.user = dummyUser;
// next();
// });

// admin/anyRoute
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

const main = async () => {
  await databaseObject.mongoConnect();
  console.log("Listen");
  app.listen(3000);
};

main();
