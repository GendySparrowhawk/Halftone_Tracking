const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const userRoutes = require("./controllers/userRoutes");
const viewRoutes = require("./controllers/viewRoutes");
const customerRoutes = require("./controllers/customerRoutes");
const comicRoutes = require("./controllers/comicRoutes");
const { connectDB } = require("./config/connection");
const PORT = process.env.PORT || 3333;
require("dotenv").config();

connectDB().then(() => {
  console.log("DB connection tested");
});

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const hbs = exphbs.create({});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "../views"));

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.render("home", { title: "Halftone Tracking" });
});

app.use("/", viewRoutes);
app.use("/auth", userRoutes);
app.use("/cust", customerRoutes);
app.use("/comics", comicRoutes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log("grpahql ready to go @Halftone");
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("DB_URL:", process.env.MONGODB_URI);
});
