import express from "express";
import { jwtAuthMiddleware } from "../controllers/index.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: `Welcome ${req.user.username}` });
});

export default router;
