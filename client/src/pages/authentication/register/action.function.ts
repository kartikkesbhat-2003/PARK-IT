import { ActionTypes } from "@/@types";
import { functions } from "@/functions";
import { ActionFunction, ActionFunctionArgs, redirect } from "react-router";

export const registractionFormAction: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const actionType = formData.get("action") as ActionTypes;
  if (actionType === ActionTypes.REGISTER_USER) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const userType = formData.get("userType") as string;
    if (!name || !email || !password || !confirmPassword || !userType) {
      throw new Error("All fields are required");
    }
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const payload = {
      name: name,
      email: email,
      password: password,
      userType: userType,
    };

    const response = await functions.serverActions.registerUser(payload);
    const userId = response.userId;
    localStorage.setItem("userId", userId);
    console.log("AFTER REGISTER USER", response);
    return redirect("/verify-email");
  }
};
