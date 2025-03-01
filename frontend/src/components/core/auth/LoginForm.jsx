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
      className="max-w-md mx-auto space-y-6 bg-pure-greys-800 text-white rounded-md shadow-lg"
    >
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
          Password <sup className="text-pink-200">*</sup>
        </label>
        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-3 text-gray-400 cursor-pointer"
        >
          {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
        </span>
      </div>

      {/* Forgot Password */}
      <Link
        to="/forgot-password"
        className="text-sm text-blue-100 hover:underline mt-2 inline-block"
      >
        Forgot Password?
      </Link>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-2 bg-[#2E3333] text-white font-medium rounded-sm hover:bg-[#3A4444] transition"
      >
        Sign In
      </button>
    </form>
  );
};

export default LoginForm;
