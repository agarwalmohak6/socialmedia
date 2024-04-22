import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
// Checking if user is logged in to do actions
const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("Error in ProtectRoute ");
  }
};

export default protectRoute;
