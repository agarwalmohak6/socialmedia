import express from "express";
import {
  loginUser,
  signUpUser,
  logoutUser,
  followUnfollowUser,
  updateUser,
  getUserProfile,
  getFriends
} from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";
const router = express.Router();

router.get("/profile/:username", getUserProfile);
router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.post("/update/:id", protectRoute, updateUser);
router.get("/friends/:id",protectRoute,getFriends);


export default router;
