import { Router } from "express";
import {
  register,
  login,
  bookTrip,
  BusAvailability,
  tripStatus,
} from "../controllers/rider_controller";
import LoginAuthorization from "../Auth/rider_authorization";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/booktrip/:driverId", LoginAuthorization, bookTrip);
router.get("/busavailable", LoginAuthorization, BusAvailability);
router.get("/tripstatus/:tripId", LoginAuthorization, tripStatus);
export default router;
