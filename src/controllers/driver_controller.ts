import Driver from "../models/drivers_model";
import Trip from "../models/trip_model";
import express, { Request, Response } from "express";
import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Bus from "../models/bus_model";
import mongoose from "mongoose";
dotenv.config();
type customRequest = Request & {
  driver?: { driver_id?: string; email?: string; name?: string };
};

// Function to register drivers
export async function register(req: Request, res: Response) {
  try {
    const ValidateSchema = Joi.object({
      name: Joi.string().required().min(3).max(30),
      email: Joi.string().required().min(6).max(225).email(),
      password: Joi.string().required().min(6).max(225),
    });

    //Validating Driver
    const validationValue = ValidateSchema.validate(req.body);
    if (validationValue.error) {
      return res.status(400).json({
        message: validationValue.error.details[0].message,
      });
    }
    //check for existing email
    const existingDriver = await Driver.findOne({ email: req.body.email });
    if (existingDriver) {
      return res.status(400).json({
        message: "driver with this email already exists!",
      });
    }

    //Hash user password
    const hashPassword = bcrypt.hashSync(req.body.password, 12);
    // Register user
    const value = await Driver.create({
      name: req.body.name,
      email: req.body.email.toLowerCase(),
      password: hashPassword,
    });

    res.status(201).json({
      data: value,
    });
  } catch (err: any) {
    res.status(400).json({ msg: "Something went wrong.. try again" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const validateSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });

    //validate body
    const validationResult = await validateSchema.validate(req.body);
    //check for errors
    if (validationResult.error) {
      return res.status(400).json({
        msg: validationResult.error.details[0].message,
      });
    }
    //check for existing email
    const existingDriver = await Driver.findOne({
      email: req.body.email.toLowerCase(),
    });
    if (!existingDriver) {
      return res.status(404).json({
        message: "Account with this driver does not exist!",
      });
    }
    //check if the password is wrong or doesn't match
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      existingDriver.password
    );
    if (!passwordIsValid) {
      //invalid password
      return res.status(400).json({
        message: "Invalid password",
      });
    }
    //email exist and password matches, proceed to create token
    // Create token
    const token = jwt.sign(
      { driver_id: existingDriver._id, driver_email: existingDriver.email },
      process.env.TOKEN_KEY as string,
      {
        expiresIn: process.env.TOKEN_EXPIRATION,
      }
    );
    res.cookie("token", token, { httpOnly: true });

    res.status(200).json({
      status: "signed in successfully!",
      token,
    });
  } catch (err: any) {
    res.status(400).json({ msg: "Something went wrong.. try again" });
  }
}

export async function registerBus(req: customRequest, res: Response) {
  const driverId = req.driver!.driver_id;
  const { serial_no, seats, plate_no } = req.body;

  try {
    const validateSchema = Joi.object({
      serial_no: Joi.string().required(),
      seats: Joi.number().required(),
      plate_no: Joi.string().min(6).required(),
    });

    //validate body
    const validationResult = await validateSchema.validate(req.body);
    //check for errors
    if (validationResult.error) {
      return res.status(400).json({
        msg: validationResult.error.details[0].message,
      });
    }

    //check for valid driver
    const existingDriver = await Driver.findOne({
      _id: driverId,
    });
    if (!existingDriver) {
      return res.status(404).json({
        message:
          "Driver Account does not exist...   Please register to become a driver",
      });
    }

    //check for existing driver with a bus
    const existingBusDriver = await Bus.findOne({
      driver: existingDriver._id,
    });
    if (existingBusDriver) {
      return res.status(404).json({
        message: "Driver has a bus already registered",
      });
    }

    //check for existing plate no
    const existingPlateno = await Bus.findOne({
      plate_no: plate_no,
    });
    if (existingPlateno) {
      return res.status(404).json({
        message: "Bus with this plate_no already exist!",
      });
    }

    //check for existing plate no
    const existingSerialno = await Bus.findOne({
      serial_no: serial_no,
    });
    if (existingSerialno) {
      return res.status(404).json({
        message: "Bus with this serial_no already exist!",
      });
    }

    const newBus = await Bus.create({
      serial_no,
      seats,
      driver: driverId,
      plate_no,
    });

    res.status(200).json({
      status: "Bus registered successfully!",
      newBus,
    });
  } catch (err: any) {
    res.status(400).json({ msg: "Something went wrong.. try again" });
  }
}

export async function affirmTrip(req: customRequest, res: Response) {
  const { tripId } = req.params;
  const driverId = req.driver?.driver_id;

  try {
    //check for existing driver
    const existingDriver = await Driver.findOne({
      _id: driverId,
    });
    if (!existingDriver) {
      return res.status(404).json({
        message:
          "Driver Account does not exist...   Please register to become a driver",
      });
    }
    // check for valid trip
    const tripDetails = await Trip.findOne({
      _id: tripId,
    });
    if (!tripDetails) {
      return res.status(404).json({
        message: "this trip is Invalid ",
      });
    }
    //check for existing driver with a bus
    const tripDriver = await Trip.findOne({
      _id: tripDetails._id,
      driver: existingDriver._id,
    });
    if (!tripDriver) {
      return res.status(404).json({
        message: "Driver is not requested for this trip",
      });
    }

    const driverBus = await Bus.findOne({
      driver: existingDriver._id,
    });
    if (!driverBus) {
      return res.status(404).json({
        message: "This is no Bus available for this driver",
      });
    }

    if (driverBus.seats >= tripDetails.seats) {
      const newSeat = driverBus.seats - tripDetails.seats;
      let updateBusSeat = await Bus.findOneAndUpdate(
        { driverId: driverId },
        { seats: newSeat },
        { new: true }
      );

      let updateTripDetail = await Trip.findOneAndUpdate(
        { _id: tripId },
        { status: "transit in progress" },
        { new: true }
      );

      res.status(200).json({
        status: "Trip has been accepted",
        msg: "please proceed to the rider pick up location immediately",
      });
    } else {
      let updateTripDetail = await Trip.findOneAndUpdate(
        { _id: tripId },
        { status: "cancelled" },
        { new: true }
      );

      res.status(404).json({
        status: "Trip has been rejected",
        msg: "Driver Bus space cannot take that rider request",
      });
    }
  } catch (err: any) {
    res.status(400).json({ msg: "Something went wrong.. try again" });
  }
}

export async function completeTrip(req: customRequest, res: Response) {
  const { tripId } = req.params;
  const driverId = req.driver?.driver_id;
  try {
    //check for existing driver
    const existingDriver = await Driver.findOne({
      _id: driverId,
    });
    if (!existingDriver) {
      return res.status(404).json({
        message:
          "Driver Account does not exist...   Please register to become a driver",
      });
    }
    // check for valid trip
    const tripDetails = await Trip.findOne({
      _id: tripId,
    });
    if (!tripDetails) {
      return res.status(404).json({
        message: "this trip is Invalid ",
      });
    }
    //check for existing driver with a bus
    const tripDriver = await Trip.findOne({
      _id: tripDetails._id,
      driver: existingDriver._id,
    });
    if (!tripDriver) {
      return res.status(404).json({
        message: "Driver is not assigned to this trip",
      });
    }
    let updateTripDetail = await Trip.findOneAndUpdate(
      { _id: tripId },
      { status: "completed" },
      { new: true }
    );
    res.status(200).json({ message: "this trip have been completed" });
  } catch (err: any) {
    res.status(400).json({ msg: "Something went wrong.. try again" });
  }
}

export async function tripStatus(req: customRequest, res: Response) {
  const { tripId } = req.params;
  const driverId = req.driver?.driver_id;
  console.log(driverId);
  try {
    //check for existing driver
    const existingDriver = await Driver.findOne({
      _id: driverId,
    });
    if (!existingDriver) {
      return res.status(404).json({
        message:
          "Driver Account does not exist...   Please register to become a driver",
      });
    }
    // check for valid trip
    const tripDetails = await Trip.findOne({
      _id: tripId,
    });
    if (!tripDetails) {
      return res.status(404).json({
        message: "this trip is Invalid ",
      });
    }
    //check for existing driver with valid trip
    const tripDriver = await Trip.findOne({
      _id: tripDetails._id,
      driver: existingDriver._id,
    });
    if (!tripDriver) {
      return res.status(404).json({
        message: "Driver is not assigned to this trip",
      });
    }

    res.status(200).json({ status: tripDetails.status });
  } catch (err: any) {
    res.status(400).json({ msg: "Something went wrong.. try again" });
  }
}
