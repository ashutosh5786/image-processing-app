const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");
const authRoutes = require("./routes/auth");
const passportConfig = require("./config/passportConfig");

const app = express();

mongoose.connect("mongodb://localhost:27017/imageProcessingAppAuth", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passportConfig(passport);

app.use("/auth", authRoutes);

app.get("/dashboard", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  res.send("Welcome to Dashboard");
});

app.get("/login", (req, res) => {
  res.send("Login Page");
});

app.get("/register", (req, res) => {
  res.send("Register Page");
});

app.listen(4000, () => {
  console.log("Auth server started on port 4000");
});
