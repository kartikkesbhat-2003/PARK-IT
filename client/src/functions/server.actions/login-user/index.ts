import { envConfig } from "@/config/env.config";

interface LoginUserPayloadType {
  email: string;
  password: string;
}

export const loginUser = async (payload: LoginUserPayloadType) => {
  const response = await fetch(`${envConfig.SERVER_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorMessage = await response.json();
    const message = errorMessage.message || "Login failed";

    throw new Error(message);
  }

  return await response.json();
};
