import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { login } from "../../../services/operations/authAPI";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const LoginForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const { email, password } = formData;

    const handleOnChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };

    const handleOnSubmit = (e) => {
        e.preventDefault();
        dispatch(login(email, password, navigate));
    };

    return (
        <form
            onSubmit={handleOnSubmit}
            className="max-w-md mx-auto space-y-3"
        >
            <div>
                <label className="block mb-2 text-gray-700 font-medium text-sm sm:text-base">
                    Email Address *
                </label>
                <input
                    required
                    type="text"
                    name="email"
                    value={email}
                    onChange={handleOnChange}
                    placeholder="Enter email address"
                    className="w-full px-4 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div>
                <label className="block mb-2 text-gray-700 font-medium text-sm sm:text-base">
                    Password *
                </label>
                <div className="relative">
                    <input
                        required
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={password}
                        onChange={handleOnChange}
                        placeholder="Enter Password"
                        className="w-full px-4 py-1 border border-gray-300 rounded-sm "
                    />
                    <span
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
                    >
                        {showPassword ? (
                            <AiOutlineEyeInvisible />
                        ) : (
                            <AiOutlineEye />
                        )}
                    </span>
                </div>
                <Link
                    to="/forgot-password"
                    className="text-sm text-blue-500 hover:underline mt-2 inline-block"
                >
                    Forgot Password?
                </Link>
            </div>

            <button
                type="submit"
                className="w-full py-2 bg-[#111827] text-white font-medium rounded-sm hover:bg-[#1f2937] transition"
            >
                Sign In
            </button>
        </form>
    );
};

export default LoginForm;
