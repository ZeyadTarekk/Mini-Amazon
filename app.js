const express = require("express");
const bodyParser = require("body-parser");
const expressHbs = require("express-handlebars");

const path = require("path");

const adminExports = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

// admin/anyRoute
app.use("/admin", adminExports.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).render("404", { pageTitle: "Page Not Found", path: "" });
});

app.listen(3000);
