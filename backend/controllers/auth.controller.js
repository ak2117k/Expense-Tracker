const User = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const token = jwt.sign({ id: user._id }, process.env.JWTSECRETKEY, {
      expiresIn: "7d",
    });

    res.status(201).json({ user, token });
  } catch (err) {
    console.log("Error in auth sign up", err);
    res.status(500).json({ error: "Signup failed" });
  }
};

const login = async (req, res) => {
  console.log("login route hitted");
  const { email, password } = req.body;
  console.log("email", email, "password", password);
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWTSECRETKEY, {
      expiresIn: "7d",
    });

    await res.cookie("jwt-User", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ user, token });
  } catch (err) {
    console.log("Error in auth controller loggiin function", err);
    res.status(500).json({ error: "Login failed" });
  }
};

module.exports = { signup, login };
