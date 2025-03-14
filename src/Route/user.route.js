import { Router } from "express";
import { registerUser, getApiKey } from "./src/Controllers/user.controllers.js";
import { validateApiKey } from "./src/middlewares/auth.middleware.js";

const router = Router();

router.post("/users", registerUser);
router.get("/users/cle", getApiKey);

export default router;
