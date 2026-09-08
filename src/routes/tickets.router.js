
import {Router} from "express"
import { authenticateJWT } from "../middleware/auth.middleware"
import { authorizeRoles } from "../middleware/authorize.middleware"
import { authorization } from "../middlewares/auth.js";

import {createTicket} from "../controllers/ticket.controller"

const router = Router()


router.post("/", authenticateJWT,
    authorizeRoles("user","organizer", "admin"),
    createTicket
)

// GET /api/tickets/my-tickets
router.get(
  "/tickets/my-tickets",
  passport.authenticate("jwt", { session: false }),
  getMyTickets
);

// GET /api/events/:eid/tickets
router.get(
  "/events/:eid/tickets",
  passport.authenticate("jwt", { session: false }),
  authorization("organizer", "admin"),
  getEventTickets
);

// PATCH /api/tickets/:tid/cancel
router.patch(
  "/tickets/:tid/cancel",
  passport.authenticate("jwt", { session: false }),
  cancelTicket
);


export default router;