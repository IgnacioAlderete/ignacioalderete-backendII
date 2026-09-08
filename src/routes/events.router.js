import { Router } from "express";

import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  changeEventStatus
} from "../controllers/event.controller.js";

import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorization.middleware.js";

const router = Router();


router.get("/", getEvents);
router.get("/:id", getEventById);

router.post(
  "/",
  authenticateJWT,
  authorizeRoles("organizer", "admin"),
  createEvent
);

router.put(
  "/:id",
  authenticateJWT,
  authorizeRoles("organizer", "admin"),
  updateEvent
);

router.patch(
  "/:id/status",
  authenticateJWT,
  authorizeRoles("organizer", "admin"),
  changeEventStatus
);

export default router;