import { useState, ChangeEvent, useCallback } from "react";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Navigate, useNavigate } from "react-router";
import { toast } from "sonner";
import { loginUser } from "@/functions/server.actions/login-user";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { setUserAction } from "@/redux/slices/user.slice";

interface ActionTypes {
  LOGIN_USER: string;
}

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
}

interface Message {
  type: "success" | "error" | "";
  text: string;
}

const ActionTypes: ActionTypes = {
  LOGIN_USER: "LOGIN_USER",
};

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((store) => store.user);
  const token = localStorage.getItem("token");

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState<Message>({ type: "", text: "" });

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    if (message.text) {
      setMessage({ type: "", text: "" });
    }
  };

  const handleForgotPasswordClick = (): void => {
    console.log("Forgot password clicked");
  };

  const handleLoginUser = useCallback(async () => {
    try {
      setIsSubmitting(true);
      if (!validateForm()) {
        return;
      }

      setMessage({ type: "", text: "" });
      const { rememberMe: _, ...loginData } = formData;
      const response = await loginUser(loginData);
      console.log("login response is ", response);
      toast.success(response.message || "Login successful");
      localStorage.setItem("token", response.token);

      dispatch(setUserAction(response.user));

      if (response.user.userType) {
        if (response.user.userType === "parker") {
          return navigate("/");
        } else {
          return navigate("parking-owner/list-parking-spot");
        }
      } else {
        return navigate("/");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something unexpected occur.";
      setMessage({
        type: "error",
        text: errorMessage,
      });
      toast(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, navigate, validateForm]);

  if ((user && user.id) || token) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="min-h-screen flex-1 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 bg-gray-800/50 backdrop-blur-sm p-10 rounded-xl border border-purple-500/20 shadow-xl">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-1 rounded-full shadow-lg bg-purple-500/20 border-2 border-purple-500/50">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3774/3774270.png"
                  className="w-32 h-32 rounded-full"
                />
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-300">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  navigate("/register");
                }}
                className="font-medium text-purple-400 hover:text-purple-300 cursor-pointer transition-colors duration-200"
              >
                Sign up now
              </button>
            </p>
          </div>

          {/* Success/Error Messages */}
          {message.text && (
            <div
              className={`p-3 rounded-lg flex items-center gap-2 ${
                message.type === "success"
                  ? "bg-green-500/20 border border-green-500/30 text-green-400"
                  : "bg-red-500/20 border border-red-500/30 text-red-400"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          <form className="mt-8 space-y-6">
            <input type="hidden" name="action" value={ActionTypes.LOGIN_USER} />

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-3 py-2 bg-gray-700/50 border rounded-md shadow-sm focus:outline-none transition-colors duration-200 text-gray-100 placeholder-gray-400 ${
                    errors.email
                      ? "border-red-500/50 focus:ring-red-500 focus:border-red-500"
                      : "border-purple-500/30 focus:ring-purple-500 focus:border-purple-500"
                  }`}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 pr-10 bg-gray-700/50 border rounded-md shadow-sm focus:outline-none transition-colors duration-200 text-gray-100 placeholder-gray-400 ${
                      errors.password
                        ? "border-red-500/50 focus:ring-red-500 focus:border-red-500"
                        : "border-purple-500/30 focus:ring-purple-500 focus:border-purple-500"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 mt-1 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded transition-colors duration-200 bg-gray-700/50"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-300 cursor-pointer"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  className="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-200"
                  onClick={handleForgotPasswordClick}
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <div>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleLoginUser}
                className="w-full cursor-pointer flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
