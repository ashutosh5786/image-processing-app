const express = require("express");
const passport = require("passport");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  try {
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate username
      res.status(400).json({ message: "Username already exists" });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Error during authentication', err });
    }
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error during login', err });
      }
      return res.status(200).json({ message: 'Login successful', user });
    });
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

router.get('/check-auth', (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({ message: 'Authenticated', user: req.user });
  } else {
    return res.status(401).json({ message: 'Not authenticated' });
  }
});

module.exports = router;
