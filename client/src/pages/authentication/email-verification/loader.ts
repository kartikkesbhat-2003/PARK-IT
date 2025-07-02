import { envConfig } from "@/config/env.config";
import axios from "axios";
import { redirect } from "react-router";

export const loaderFunctionForEmailVerificationPage = async () => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    throw redirect("/register");
  }
  const userDetails = await axios.get(
    `${envConfig.SERVER_BASE_URL}/auth/is-email-verified/${userId}`
  );

  const user = userDetails.data.isVerified;
  if (user.isEmailVerified) {
    localStorage.removeItem("userId");
    throw redirect("/login");
  }
  return null;
};
export default loaderFunctionForEmailVerificationPage;
// export default loaderFunctionForEmailVerificationPage;
