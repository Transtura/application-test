import rider_model from "../models/riders_model";
import driver_model from "../models/drivers_model";
import Trip from "../models/trip_model";
import Bus from "../models/bus_model";
import { BusInterface } from "../interfaces/interface";
import express, { Request, Response } from "express";
import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
type customRequest = Request & {
  rider?: { rider_id?: string; email?: string; name?: string };
};
// Function to register riders
export async function register(req: Request, res: Response) {
  try {
    const ValidateSchema = Joi.object({
      name: Joi.string().required().min(3).max(30),
      email: Joi.string().required().min(6).max(225).email(),
      password: Joi.string().required().min(6).max(225),
    });

    //Validating Rider
    const validationValue = ValidateSchema.validate(req.body);
    if (validationValue.error) {
      return res.status(400).json({
        message: validationValue.error.details[0].message,
      });
    }
    console.log(validationValue);
    //check for existing email
    const existingUser = await rider_model.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({
        message: "Rider with this email already exists!",
      });
    }

    //Hash user password
    const hashPassword = bcrypt.hashSync(req.body.password, 12);
    // Register rider
    const value = await rider_model.create({
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
    const existingRider = await rider_model.findOne({
      email: req.body.email.toLowerCase(),
    });
    if (!existingRider) {
      return res.status(404).json({
        message: "Account with this rider does not exist!",
      });
    }
    //check if the password is wrong or doesn't match
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      existingRider.password
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
      { rider_id: existingRider._id, rider_email: existingRider.email },
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

export async function bookTrip(req: customRequest, res: Response) {
  const { driverId } = req.params;
  const riderId = req.rider?.rider_id;
  const { destination, from, seats } = req.body;
  try {
    

    //validate body
    const validationResult = await validateSchema.validate(req.body);
    //check for errors
    if (validationResult.error) {
      return res.status(400).json({
        msg: validationResult.error.details[0].message,
      });
    }
    //check for existing rider
    const existingRider = await rider_model.findOne({
      _id: riderId,
    });
    if (!existingRider) {
      return res.status(404).json({
        message: "rider does not exist!",
      });
    }

    //check for existing driver
    const existingDriver = await driver_model.findOne({
      _id: driverId,
    });
    if (!existingDriver) {
      return res.status(404).json({
        message: "Driver and Bus does not exist!",
      });
    }

    const newTrip = await Trip.create({
      destination,
      from,
      seats,
      rider: riderId,
      driver: driverId,
    });

    res.status(200).json({
      status: "you have book a trip successfully!",
      newTrip,
    });
  } catch (err: any) {
    res.status(400).json({ msg: "Something went wrong.. try again" });
  }
}

export async function BusAvailability(req: customRequest, res: Response) {
  try {
    const allBuses = await Bus.find({});
    const availableBuses = allBuses.filter((bus: BusInterface) => {
      return bus.seats > 0;
    });
    res.status(200).json({ allBuses: availableBuses });
  } catch (err: any) {
    res.status(400).json({ msg: "Something went wrong.. try again" });
  }
}

export async function tripStatus(req: customRequest, res: Response) {
  const { tripId } = req.params;
  const riderId = req.rider?.rider_id;

  try {
    //check for existing rider
    const existingRider = await rider_model.findOne({
      _id: riderId,
    });
    if (!existingRider) {
      return res.status(404).json({
        message: "rider does not exist!",
      });
    }

    const statusTrip = await Trip.findOne({
      _id: tripId,
    });
    if (!statusTrip) {
      return res.status(404).json({
        message: "Trip does not exist!",
      });
    }

    //check for existing driver with valid trip
    const tripRider = await Trip.findOne({
      _id: statusTrip._id,
      rider: existingRider._id,
    });
    if (!tripRider) {
      return res.status(404).json({
        message: "Rider did not request this trip",
      });
    }
    res.status(200).json({ status: statusTrip.status });
  } catch (err: any) {
    res.status(400).json({ msg: "Something went wrong.. try again" });
  }
}
