const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const path = require("path");

const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const User = require("./models/user");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const errorController = require("./controllers/error");

const app = express();
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(async (req, res, next) => {
  if (req.session.user) {
    const user = await User.findById(req.session.user._id);
    req.user = user;
  }
  next();
});

// admin/anyRoute
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

const main = async () => {
  // await databaseObject.mongoConnect();
  await mongoose.connect(process.env.MONGODB_URI);

  const user = await User.findOne();
  if (!user) {
    const newUser = new User({
      name: "zeyad",
      email: "zeyad@g.com",
      cart: {
        items: [],
      },
    });
    await newUser.save();
  }

  app.listen(3000);
};

main();
