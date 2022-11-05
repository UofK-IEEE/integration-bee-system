const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// Authentication middleware
const auth = require("../../middleware/auth");
const config = require("config");

// Load the models
const User = require("../../models/user");

//@route    GET /api/users/all
//@access   public
//@desc     Gets all users
router.get("/all", async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    POST /api/users/register
//@access   admin
//@desc     Registers a participant
router.post("/register", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Forbidden" });
  }

  const { name, password, team, score } = req.body;

  try {
    // Checking for if the name already exists
    let user = await User.findOne({ name });
    if (user) {
      return res.status(400).json({ msg: "Name already exists" });
    }
    // Create new user with submitted fields
    user = new User({ name, password, team, score });

    await user.save();

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };
    jwt.sign(payload, config.get("JWTSecret"), (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    POST /api/users/login
//@access   public
//@desc     Registers user
router.post("/login", async (req, res) => {
  const { name, password } = req.body;

  try {
    // Search for user using name
    let user = await User.findOne({ name });

    if (!user) {
      return res.status(404).json({ msg: "Invalid Credentials" });
    }

    if (password !== user.password) {
      return res.status(404).json({ msg: "Invalid Credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(payload, config.get("JWTSecret"), (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
