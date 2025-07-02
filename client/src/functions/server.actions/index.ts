import { listParkingSpot } from "./list-parking-spot";
import { loginUser } from "./login-user";
import { registerUser } from "./register-user";

export const serverActions = {
  registerUser: registerUser,
  loginUser: loginUser,
  listParkingSpot:listParkingSpot
};
