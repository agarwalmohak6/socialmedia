import express from "express";
import {
  loginUser,
  signUpUser,
  logoutUser,
  followUser,
  unfollowUser,
  updateUser,
  getUserProfile,
  getFriends,
} from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";
const router = express.Router();

router.get("/profile/:username", getUserProfile);
router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUser);
router.post("/unfollow/:id",protectRoute,unfollowUser);
router.post("/update/:id", protectRoute, updateUser);
router.get("/friends/:id", getFriends);

export default router;
