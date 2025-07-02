import { ActionTypes } from "@/@types";
import { functions } from "@/functions";
import { setUserAction } from "@/redux/slices/user.slice";
import { store } from "@/redux/store";
import { ActionFunction, ActionFunctionArgs, redirect } from "react-router";

export const loginFormAction: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData();
  console.log("formdata us ", Object.fromEntries(formData));
  const actionType = formData.get("action") as ActionTypes;
  if (actionType === ActionTypes.LOGIN_USER) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      throw new Error("All fields are required");
    }

    const payload = {
      email: email,
      password: password,
    };

    const serverResponse = await functions.serverActions.loginUser(payload);
    console.log("server response is ", serverResponse);
    localStorage.setItem("token", serverResponse.token);
    store.dispatch(setUserAction(serverResponse.user));
    localStorage.setItem("userId", serverResponse.user.id);
    throw redirect("/parking");
  }
};
