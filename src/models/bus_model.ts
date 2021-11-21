import mongoose from "mongoose";
import { BusInterface } from "../interfaces/interface";

const busSchema = new mongoose.Schema<BusInterface>({
  serial_no: {
    type: String,
    required: true,
    unique: true,
  },
  seats: {
    type: Number,
    required: true,
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "driver",
  },
  plate_no: {
    type: String,
    unique: true,
    required: true,
  },
});
const BusModel = mongoose.model("bus", busSchema);
export default BusModel;
