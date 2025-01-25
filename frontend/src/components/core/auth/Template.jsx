import { FcGoogle } from "react-icons/fc";
import { useSelector } from "react-redux";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { useNavigate } from "react-router-dom";

export const Template = ({ title, description1, description2, formType }) => {
    const { loading } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#1A1C1D] px-4 sm:px-6 lg:px-8 text-gray-200">
            {loading ? (
                <div className="text-xl font-medium text-gray-400">Loading...</div>
            ) : (
                <div className="flex flex-col items-center rounded-lg p-6 sm:p-8 w-full max-w-sm border border-gray-700 bg-pure-greys-800 shadow-lg">
                    <div className="w-full">
                        <h1 className="text-lg sm:text-2xl font-bold text-white mb-4">{title}</h1>

                        {/* Render form based on type */}
                        {formType === "signup" ? <SignupForm /> : <LoginForm />}

                        {/* Switch between forms */}
                        <div className="mt-4 text-center">
                            {formType === "signup" ? (
                                <>
                                    <span className="text-sm text-gray-400">Already have an account?</span>
                                    <span
                                        className="text-sm text-blue-100 font-semibold cursor-pointer ml-2 hover:text-blue-500"
                                        onClick={() => navigate("/login")}
                                    >
                                        Login
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="text-sm text-gray-400">Don't have an account?</span>
                                    <span
                                        className="text-sm text-blue-100 font-semibold cursor-pointer ml-2 hover:text-blue-500"
                                        onClick={() => navigate("/signup")}
                                    >
                                        Signup
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
