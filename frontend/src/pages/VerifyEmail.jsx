import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { BiArrowBack } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { RxCountdownTimer } from "react-icons/rx";
import { signUp, sendOtp } from "../services/operations/authAPI";
import OTPInput from "react-otp-input"
import "../App.css";

export const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { signupData, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    //only access this route when user has filled the signup form
    if (!signupData) {
      navigate("/signup");
    }
  }, [])

  const handleOnSubmit = (e) => {
    e.preventDefault();

    const {
      accountType,
      fullName,
      email,
      password,
      confirmPassword,
    } = signupData;

    dispatch(
      signUp(
        accountType,
        fullName,
        email,
        password,
        confirmPassword,
        otp,
        navigate
      )
    );
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#1A1C1D] px-4 sm:px-6 lg:px-8 text-gray-200">
      {
        loading ? (
          <div className="text-xl font-medium text-gray-400">Loading...</div>
        ) : (
          <div className="flex flex-col items-center rounded-lg p-6 sm:p-8 w-full max-w-sm border border-gray-700 bg-pure-greys-800 shadow-lg">
            <div className="w-full">
              <h1 className="text-lg sm:text-2xl font-bold text-white mb-4">
                Verify Email
              </h1>
              <p className="text-sm sm:text-base text-gray-400 mb-6">
                A verification code has been sent to your email. Please enter the code below to verify your account.
              </p>
              <form onSubmit={handleOnSubmit} className="space-y-4">
                <OTPInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderInput={(props) => (
                    <input
                      {...props}
                      placeholder="-"
                      className="w-[80px] lg:w-[120px] border-gray-700 bg-[#2D2F30] rounded-md text-gray-200 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{
                        width: "40px", // Default width for all screens
                        height: "40px", // Optional for a square look
                      }}
                    />
                  )}
                  containerStyle={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px", // Space between inputs
                  }}
                />
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-gray-100 py-2 rounded-lg font-medium hover:bg-blue-600 transition duration-200"
                >
                  Verify Email
                </button>
              </form>
              <div className="flex items-center justify-between mt-6 text-sm">
                <Link to="/signup" className="text-gray-400 hover:text-blue-500">
                  <BiArrowBack className="inline-block mr-1" />
                  Back To Signup
                </Link>
                <button
                  className="text-blue-100 hover:text-blue-500 flex items-center gap-x-1"
                  onClick={() => dispatch(sendOtp(signupData.email, navigate))}
                >
                  <RxCountdownTimer />
                  Resend it
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div>


  )
}