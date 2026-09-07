import { Router } from "express";
import passport from "../config/passport.config.js";

import { 
    login, 
    register,
    current, 
    logout
} from "../controllers/session.controller.js";

import { authorizeRoles } from "../middleware/authorize.middleware.js";

import {auth} from "../middleware/auth.js"
const router = Router();

router.post("/register",
    passport.authenticate(
        "register",
        { session:false}
    ),
    register);

router.post("/login",passport.authenticate("login",
{
    session:false
}),
    
    login);


router.get("/current", passport.authenticate("current",{session: false}), authorizeRoles("user"),  current);

router.post("/logout", logout);


export default router;