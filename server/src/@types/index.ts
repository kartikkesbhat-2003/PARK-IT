import { Request } from "express";
import { UserSchemaType } from "./models/index";

export { UserSchemaType } from "./models/index";

export const enum EmailType {
  VERIFICATION = "verification",
  RESET_PASSWORD = "reset-password",
}

export interface CustomUser {
  _id: string;
  name: string;
  email: string;
  userType: string;
}

export interface IRequestWithUser extends Request {
  customUser?: CustomUser;
}
