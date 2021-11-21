import mongoose from "mongoose";
import { TripInterface } from "../interfaces/interface";

const tripSchema = new mongoose.Schema<TripInterface>({
  destination: {
    type: String,
    required: true,
  },
  seats: {
    type: Number,
    required: true,
  },
  rider: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "rider",
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "driver",
  },
  from: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "transit in progress", "completed", "cancelled"],
    required: true,
    default: "pending",
  },
  paid: {
    type: Boolean,
    required: true,
    default: false,
  },
});
const TripModel = mongoose.model("trip", tripSchema);
export default TripModel;
