import { Eye, EyeOff, LogIn } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { loginUser } from "../../api/authApi";
import { useAuthStore } from "../../store/authStore";
import Button from "../common/Button";
import Input from "../common/Input";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const getDashboardPath = (role) => {
    switch (role) {
      case "candidate":
        return "/candidate/dashboard";
      case "employer":
        return "/employer/dashboard";
      case "admin":
        return "/admin/dashboard";
      default:
        return "/";
    }
  };

  const handleLogin = async (formData) => {
    try {
      const response = await loginUser({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      const token = response?.data?.token;
      const user = response?.data?.user;

      if (!token || !user) {
        throw new Error("Invalid login response from server.");
      }

      setAuth({ token, user });

      toast.success(response.message || "Login successful.");

      const requestedPath = location.state?.from?.pathname;

      navigate(requestedPath || getDashboardPath(user.role), {
        replace: true,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to log in."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleLogin)}
      className="space-y-5"
    >
      <Input
        id="login-email"
        label="Email Address"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        required
        error={errors.email?.message}
        {...register("email", {
          required: "Email address is required.",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Enter a valid email address.",
          },
        })}
      />

      <div>
        <div className="relative">
          <Input
            id="login-password"
            label="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            required
            className="pr-12"
            error={errors.password?.message}
            {...register("password", {
              required: "Password is required.",
            })}
          />

          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3 top-[42px] rounded-md p-1 text-slate-500 hover:bg-slate-100"
            aria-label={
              showPassword ? "Hide password" : "Show password"
            }
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 text-sm">
        <label className="flex items-center gap-2 text-slate-600">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-blue-700"
          />
          Remember me
        </label>

        <Link
          to="/forgot-password"
          className="font-semibold text-blue-700 hover:text-blue-800"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        size="lg"
        loading={isSubmitting}
        className="w-full"
      >
        <LogIn size={18} />
        Login
      </Button>

      <p className="text-center text-sm text-slate-600">
        Do not have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-blue-700 hover:text-blue-800"
        >
          Create account
        </Link>
      </p>
    </form>
  );
}