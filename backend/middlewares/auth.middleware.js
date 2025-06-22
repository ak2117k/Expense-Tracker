const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies["jwt-User"];
    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized access. Invalid token" });
    const decodeduser = jwt.verify(token, process.env.JWTSECRETKEY);
    if (!decodeduser) return res.status(401).json({ message: "Invalid token" });
    const user = await User.findById(decodeduser.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protect Route middleware", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

module.exports = protectRoute;
