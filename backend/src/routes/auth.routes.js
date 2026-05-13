import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/", (req, res) => {
  res.send("Auth funcionando");
});

export default router;