import { FcGoogle } from "react-icons/fc";
import { useSelector } from "react-redux";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { useNavigate } from "react-router-dom";

export const Template = ({ title, description1, description2, formType }) => {
    const { loading } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
            {loading ? (
                <div className="text-xl font-medium">Loading...</div>
            ) : (
                <div className="flex flex-col items-center rounded-lg p-6 sm:p-8 w-full max-w-sm border">
                    <div className="w-full">
                        <h1 className="text-lg sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-4 text-left">{title}</h1>
                        <p className="text-sm sm:text-base text-gray-600 mb-6 text-left">
                            <span>{description1}</span> {" "}
                            <p className="font-semibold text-blue-500 inline">{description2}</p>
                        </p>

                        {formType === "signup" ? <SignupForm /> : <LoginForm />}

                            {
                                formType === "signup" ? (
                                <>
                                    <span className="text-sm text-gray-600">Already have an account?</span>
                                    <span
                                        className="text-sm text-blue-500 font-semibold cursor-pointer ml-2 hover:text-blue-600 transition-colors duration-200"
                                        onClick={() => navigate("/login")}
                                    >
                                        Login
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="text-sm text-gray-600">Don't have an account?</span>
                                    <span
                                        className="text-sm text-blue-500 font-semibold cursor-pointer ml-2 hover:text-blue-600 transition-colors duration-200"
                                        onClick={() => navigate("/signup")}
                                    >
                                        Signup
                                    </span>
                                </>
                            )}

                    </div>
                </div>
            )}
        </div>
    );
};
