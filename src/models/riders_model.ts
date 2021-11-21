import mongoose from "mongoose";
import { RiderInterface } from "../interfaces/interface";

const riderSchema = new mongoose.Schema<RiderInterface>({
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
const RiderModel = mongoose.model("rider", riderSchema);
export default RiderModel;
