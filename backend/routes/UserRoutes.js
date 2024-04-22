import express from "express";
import {
  loginUser,
  signUpUser,
  logoutUser,
} from "../controllers/userController.js";
const router = express.Router();

router.post("/signup", signUpUser);
router.get("/login", loginUser);
router.get("/logout", logoutUser);

export default router;
