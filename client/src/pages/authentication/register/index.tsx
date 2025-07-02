import React, { useCallback, useState, ChangeEvent, FormEvent } from "react";
import { EyeOff, Eye, Loader2, AlertCircle } from "lucide-react";
import { registerUser } from "@/functions/server.actions/register-user";
import { Navigate, useNavigate } from "react-router";
import { toast } from "sonner";
import { useAppSelector } from "@/hooks/redux-hooks";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: "parker" | "owner";
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  submit?: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector((store) => store.user);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "parker",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState<boolean>(false);

  const validateForm = (data: FormData): FormErrors => {
    const newErrors: FormErrors = {};

    if (!data.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (data.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(data.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!data.password) {
      newErrors.password = "Password is required";
    } else if (data.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    if (!data.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev: FormErrors) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleRegister = useCallback(
    async (e: FormEvent<HTMLButtonElement>): Promise<void> => {
      e.preventDefault();

      const validationErrors: FormErrors = validateForm(formData);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      try {
        setLoading(true);
        setErrors({});

        const form = document.getElementById(
          "register-form"
        ) as HTMLFormElement;
        if (!form) {
          throw new Error("Form not found");
        }

        const response = await registerUser(formData);
        setSuccess(true);
        toast.success(response.message + ". Please log in.");
      } catch (error: unknown) {
        console.error("Registration error:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An error occurred during registration";

        setErrors({
          submit: errorMessage,
        });

        toast.error(
          error instanceof Error
            ? error.message
            : "An error occurred during registration"
        );
      } finally {
        setLoading(false);
      }
    },
    [formData]
  );

  const navigateToLogin = (): void => {
    console.log("Navigate to login page");
    navigate("/login");
  };

  if (user && user.id) {
    return <Navigate to="/" />;
  }

  if (success) {
    return (
      <div className="min-h-screen flex-1 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-purple-500/20 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-500/20 p-3 rounded-full border-2 border-green-500/50">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Eo_circle_green_checkmark.svg/2048px-Eo_circle_green_checkmark.svg.png"
                  className="w-24 h-24 rounded-full animate-pulse"
                />
              </div>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-2">
              Account Created Successfully!
            </h2>
            <p className="text-gray-300 mb-6">
              Welcome to ParkEasy! You can now sign in with your credentials.
            </p>
            <button
              onClick={navigateToLogin}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 cursor-pointer transform hover:scale-105 active:scale-95"
            >
              Continue to Sign In
            </button>
          </div>
        </div>
      </div>
    );
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
              Create Your Account
            </h2>
            <p className="mt-2 text-sm text-gray-300">
              Already have an account?{" "}
              <button
                type="button"
                onClick={navigateToLogin}
                className="font-medium text-purple-400 hover:text-purple-300 cursor-pointer transition-colors duration-200"
              >
                Sign in
              </button>
            </p>
          </div>

          <form id="register-form" className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg transition-colors focus:outline-none focus:ring-2 text-gray-100 placeholder-gray-400 ${
                    errors.name
                      ? "border-red-500/50 focus:ring-red-500 focus:border-red-500"
                      : "border-purple-500/30 focus:ring-purple-500 focus:border-purple-500"
                  }`}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.name}
                  </p>
                )}
              </div>

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
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg transition-colors focus:outline-none focus:ring-2 text-gray-100 placeholder-gray-400 ${
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

              <div>
                <label
                  htmlFor="userType"
                  className="block text-sm font-medium text-gray-300"
                >
                  I want to
                </label>
                <select
                  id="userType"
                  name="userType"
                  value={formData.userType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-purple-500/30 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-100"
                >
                  <option value="parker">Find Parking</option>
                  <option value="owner">List My Space</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 pr-12 bg-gray-700/50 border rounded-lg transition-colors focus:outline-none focus:ring-2 text-gray-100 placeholder-gray-400 ${
                      errors.password
                        ? "border-red-500/50 focus:ring-red-500 focus:border-red-500"
                        : "border-purple-500/30 focus:ring-purple-500 focus:border-purple-500"
                    }`}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
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
                <p className="mt-1 text-xs text-gray-400">
                  Must be 8+ characters with uppercase, lowercase, and number
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 pr-12 bg-gray-700/50 border rounded-lg transition-colors focus:outline-none focus:ring-2 text-gray-100 placeholder-gray-400 ${
                      errors.confirmPassword
                        ? "border-red-500/50 focus:ring-red-500 focus:border-red-500"
                        : "border-purple-500/30 focus:ring-purple-500 focus:border-purple-500"
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {errors.submit && (
              <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 flex items-center gap-2">
                <AlertCircle size={16} />
                <span className="text-sm">{errors.submit}</span>
              </div>
            )}

            <div>
              <button
                type="button"
                disabled={loading}
                onClick={handleRegister}
                className="w-full cursor-pointer flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4 mr-2" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
