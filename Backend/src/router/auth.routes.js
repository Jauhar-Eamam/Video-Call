import express from "express";
import {
  userRegister,
  userLogin,
  userLogout,
  getUserHistory,
  addToHistory
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", userRegister);
router.post("/login", userLogin);
router.post("/logout", userLogout);
router.get("/get_all_activity", getUserHistory);
router.post("/add_to_activity", addToHistory);

export default router;
