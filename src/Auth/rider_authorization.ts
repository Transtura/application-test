import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { riderRequestInterface } from "../interfaces/interface";

function LoginAuthorization(
  req: riderRequestInterface,
  res: Response,
  next: NextFunction
) {
  const riderToken = req.headers.token || "";
  if (!riderToken) {
    return res.status(401).json({
      status: "you are not an authorized rider",
      message: "Enter  login  details to have access",
    });
  }
  try {
    const LoginAuthorization = jwt.verify(
      riderToken.toString(),
      process.env.TOKEN_KEY || ""
    );
    req.rider = LoginAuthorization;
    next();
  } catch (err) {
    res.status(401).json({
      status: "Failed",
      message: "Invalid token",
    });
  }
}

export default LoginAuthorization;
