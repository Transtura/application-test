import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { driverRequestInterface } from "../interfaces/interface";

function LoginAuthorization(
  req: driverRequestInterface,
  res: Response,
  next: NextFunction
) {
  const driverToken = req.cookies.token || req.headers.token;
  if (!driverToken) {
    return res.status(401).json({
      status: "you are not an authorized driver",
      message: "Enter  login  details to have access",
    });
  }
  try {
    const LoginAuthorization = jwt.verify(
      driverToken.toString(),
      process.env.TOKEN_KEY as string
    );
    req.driver = LoginAuthorization;
    next();
  } catch (err) {
    res.status(401).json({
      status: "Failed",
      message: "Invalid token",
    });
  }
}

export default LoginAuthorization;
