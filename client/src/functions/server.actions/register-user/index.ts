import { envConfig } from "@/config/env.config";

type CreateUserPayloadType = {
  name: string;
  email: string;
  password: string;
  userType: string;
};

export const registerUser = async (payload: CreateUserPayloadType) => {
  const response = await fetch(`${envConfig.SERVER_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
};

