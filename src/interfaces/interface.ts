import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import { Request } from "express";

interface BusInterface {
  serial_no: string;
  seats: number;
  driver: mongoose.Schema.Types.ObjectId;
  plate_no: string;
}
interface TripInterface {
  destination: string;
  seats: number;
  rider: mongoose.Schema.Types.ObjectId;
  from: string;
  driver: mongoose.Schema.Types.ObjectId;
  status: string;
  paid: boolean;
}
interface DriverInterface {
  email: string;
  name: string;
  password: string;
}

interface RiderInterface {
  email: string;
  name: string;
  password: string;
}

interface riderRequestInterface extends Request {
  rider?: string | JwtPayload;
}

interface driverRequestInterface extends Request {
  driver?: string | JwtPayload;
}

export {
  TripInterface,
  BusInterface,
  DriverInterface,
  riderRequestInterface,
  driverRequestInterface,
  RiderInterface,
};
