import { Router } from "express";
import { 
    login, 
    register,
    current, 
    logout
} from "../controllers/session.controller.js";

import {auth} from "../middleware/auth.js"
const router = Router();

router.post("/register", register);

router.post("/login", login);

router.get("/current", auth, current);
router.post("/logout", logout);


export default router;