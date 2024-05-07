import { User } from "../models/User.model.js";
import jwt from "jsonwebtoken";
import StatusCodes from "../utils/statusCodes.js";
// Checking if user is logged in to do actions
const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    req.user = user;
    next();
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: err.message });
    console.log("Error in ProtectRoute ");
  }
};

export default protectRoute;
