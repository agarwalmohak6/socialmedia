import express from "express";
import {
  loginUser,
  signUpUser,
  logoutUser,
  followUnfollowUser,
} from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";
const router = express.Router();

router.post("/signup", signUpUser);
router.get("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id",protectRoute, followUnfollowUser);

export default router;
