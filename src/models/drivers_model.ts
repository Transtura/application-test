import mongoose from "mongoose";
import { DriverInterface } from "../interfaces/interface";

const driverSchema = new mongoose.Schema<DriverInterface>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
});
const DriverModel = mongoose.model("driver", driverSchema);
export default DriverModel;
