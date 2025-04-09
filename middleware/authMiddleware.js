const jwt = require("jsonwebtoken");
const User = require("../models/User"); 

const authMiddleware = async (req, res, next) => {
  // const token = req.header("Authorization");
  const userIdHeader = req.header("x-user-id"); 
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  if (!userIdHeader) {
    return res.status(400).json({ message: "User ID is required in header (x-user-id)" });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), "your-secret-key");

    
    if (decoded.userId !== userIdHeader) {
      return res.status(403).json({ message: "User ID mismatch with token" });
    }
    const user = await User.findById(userIdHeader);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = { userId: user._id }; 
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
