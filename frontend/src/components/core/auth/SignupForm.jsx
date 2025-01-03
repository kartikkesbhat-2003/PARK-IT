import { useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { sendOtp } from "../../../services/operations/authAPI";
import { setSignupData } from "../../../slices/authSlice";
import { ACCOUNT_TYPE } from "../../../utils/constants";

export const SignupForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // student or instructor
    const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { fullName, email, password, confirmPassword } = formData;

    // Handle input fields, when some value changes
    const handleOnChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };

    // Handle Form Submission
    const handleOnSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords Do Not Match");
            return;
        }
        const signupData = {
            ...formData,
            accountType,
        };

        // Setting signup data to state
        // To be used after OTP verification
        dispatch(setSignupData(signupData));
        // send OTP to user for verification
        dispatch(sendOtp(formData.email, navigate));

        // Reset
        setFormData({
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        });
        setAccountType(ACCOUNT_TYPE.USER);
    };

    return (
        <form onSubmit={handleOnSubmit} className="max-w-md mx-auto space-y-3">
            {/* Full Name */}
            <div>
                <label className="block mb-2 text-gray-700 font-medium text-sm sm:text-base">
                    Full Name <sup className="text-pink-200">*</sup>
                </label>
                <input
                    required
                    type="text"
                    name="fullName"
                    value={fullName}
                    onChange={handleOnChange}
                    placeholder="Enter Full Name"
                    className="w-full px-4 py-1 border border-gray-300 rounded-sm focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            {/* Email Address */}
            <div>
                <label className="block mb-2 text-gray-700 font-medium text-sm sm:text-base">
                    Email Address <sup className="text-pink-200">*</sup>
                </label>
                <input
                    required
                    type="text"
                    name="email"
                    value={email}
                    onChange={handleOnChange}
                    placeholder="Enter Email Address"
                    className="w-full px-4 py-1 border border-gray-300 rounded-sm focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            {/* Password */}
            <div>
                <label className="block mb-2 text-gray-700 font-medium text-sm sm:text-base">
                    Create Password <sup className="text-pink-200">*</sup>
                </label>
                <div className="relative">
                    <input
                        required
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={password}
                        onChange={handleOnChange}
                        placeholder="Enter Password"
                        className="w-full px-4 py-1 border border-gray-300 rounded-sm"
                    />
                    <span
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
                    >
                        {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </span>
                </div>
            </div>

            {/* Confirm Password */}
            <div>
                <label className="block mb-2 text-gray-700 font-medium text-sm sm:text-base">
                    Confirm Password <sup className="text-pink-200">*</sup>
                </label>
                <div className="relative">
                    <input
                        required
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleOnChange}
                        placeholder="Confirm Password"
                        className="w-full px-4 py-1 border border-gray-300 rounded-sm"
                    />
                    <span
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
                    >
                        {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </span>
                </div>
            </div>

            <button
                type="submit"
                className="w-full py-2 bg-[#111827] text-white font-medium rounded-sm hover:bg-[#1f2937] transition text-sm sm:text-base"
            >
                Create Account
            </button>
        </form>
    );
};

export default SignupForm;
