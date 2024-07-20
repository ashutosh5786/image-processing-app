const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");
const authRoutes = require("./routes/auth");
const passportConfig = require("./config/passportConfig");
const cors = require("cors"); // Import the cors middleware
const bodyParser = require("body-parser");

const app = express();

mongoose.connect(
  "mongodb+srv://admin:admin@imageprocessing.0i18t1c.mongodb.net/?retryWrites=true&w=majority&appName=imageprocessing"
);


app.use(cors({
  origin: '*', // Replace with your React app's URL
  credentials: true // Enable credentials (cookies, authorization headers, etc.)
}));
app.use(bodyParser.json()); // Add this line to parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: false })); // Add this line to parse URL-encoded request bodies

app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true if using https
      maxAge: 3600000 // 1 hour
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passportConfig(passport);

app.use("/auth", authRoutes);

app.get("/dashboard", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.send("Not Authenticated");
  }
  res.send("Welcome to Dashboard");
});

app.listen(4000, "0.0.0.0",() => {
  console.log("Auth server started on port 4000");
});
