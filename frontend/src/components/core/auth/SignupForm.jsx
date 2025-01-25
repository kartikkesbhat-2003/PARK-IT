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

    const handleOnChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };

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

        dispatch(setSignupData(signupData));
        dispatch(sendOtp(formData.email, navigate));

        setFormData({
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
        });
        setAccountType(ACCOUNT_TYPE.USER);
    };

    return (
        <form
            onSubmit={handleOnSubmit}
            className="max-w-md mx-auto space-y-6 bg-pure-greys-800 text-white rounded-md"
        >
            {/* Full Name */}
            <div className="relative z-0 w-full group">
                <input
                    required
                    type="text"
                    name="fullName"
                    value={fullName}
                    onChange={handleOnChange}
                    placeholder=" "
                    className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-600 appearance-none focus:outline-none focus:ring-0 focus:border-[#2E3333] peer"
                />
                <label className="absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-[#A2B5BB]">
                    Full Name <sup className="text-pink-200">*</sup>
                </label>
            </div>

            {/* Email Address */}
            <div className="relative z-0 w-full group">
                <input
                    required
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleOnChange}
                    placeholder=" "
                    className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-600 appearance-none focus:outline-none focus:ring-0 focus:border-[#2E3333] peer"
                />
                <label className="absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-[#A2B5BB]">
                    Email Address <sup className="text-pink-200">*</sup>
                </label>
            </div>

            {/* Password */}
            <div className="relative z-0 w-full group">
                <input
                    required
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={handleOnChange}
                    placeholder=" "
                    className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-600 appearance-none focus:outline-none focus:ring-0 focus:border-[#2E3333] peer"
                />
                <label className="absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-[#A2B5BB]">
                    Create Password <sup className="text-pink-200">*</sup>
                </label>
                <span
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                >
                    {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </span>
            </div>

            {/* Confirm Password */}
            <div className="relative z-0 w-full group">
                <input
                    required
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleOnChange}
                    placeholder=" "
                    className="block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 border-gray-600 appearance-none focus:outline-none focus:ring-0 focus:border-[#2E3333] peer"
                />
                <label className="absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-[#A2B5BB]">
                    Confirm Password <sup className="text-pink-200">*</sup>
                </label>
                <span
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                >
                    {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </span>
            </div>

            <button
                type="submit"
                className="w-full py-2 bg-[#111827] text-white font-medium rounded-sm hover:bg-[#1f2937] transition"
            >
                Create Account
            </button>
        </form>
    );
};

export default SignupForm;
