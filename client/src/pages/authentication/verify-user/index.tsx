import { envConfig } from "@/config/env.config";
import { useAppSelector } from "@/hooks/redux-hooks";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router";

const VerifyUserEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const verificationToken = searchParams.get("token");
  const isUserLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const [isVerified, setIsVerified] = useState(false);
  const [isFailedToVerify, setIsFailedToVerify] = useState(false);

  const verifyToken = useCallback(async () => {
    if (verificationToken) {
      const response = await fetch(
        `${envConfig.SERVER_BASE_URL}/auth/verify-user/${verificationToken}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log("verification data is ", data);
      if (response.status === 200) {
        console.log("verification success");
        setIsVerified(true);
        setIsFailedToVerify(false);
        navigate("/login");
      } else if (response.status === 400) {
        console.log("verification failed");
        setIsVerified(false);
        setIsFailedToVerify(true);
      }
    }
  }, [verificationToken, navigate]);

  useEffect(() => {
    if (verificationToken) {
      verifyToken();
    }
  }, [verificationToken, verifyToken]);

  if (isUserLoggedIn) {
    return <Navigate to="/" />;
  }

  if (!verificationToken || verificationToken === "") {
    return <Navigate to="/login" />;
  }

  return (
    <div className="w-full grow flex items-center justify-center flex-col text-center">
      {!isVerified && (
        <Loader2 className="animate-spin text-blue-600 w-8 h-8 mb-6" />
      )}
      <h1 className="text-3xl font-semibold text-blue-600">
        Verifying your email address
      </h1>
      <p className="text-gray-500 w-full md:max-w-[400px]">
        Please wait while we verify your email address. This may take a few
        moments.
      </p>
    </div>
  );
};

export default VerifyUserEmailPage;
