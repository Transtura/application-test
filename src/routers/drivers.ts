import { Router } from "express";
import {
  register,
  login,
  registerBus,
  affirmTrip,
  completeTrip,
  tripStatus,
} from "../controllers/driver_controller";
import LoginAuthorization from "../Auth/driver_authorization";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/registerbus", LoginAuthorization, registerBus);
router.post("/affirmtrip/:tripId", LoginAuthorization, affirmTrip);
router.put("/completetrip/:tripId", LoginAuthorization, completeTrip);
router.get("/tripstatus/:tripId", LoginAuthorization, tripStatus);

export default router;
