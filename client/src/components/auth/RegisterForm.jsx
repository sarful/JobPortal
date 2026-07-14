import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { registerUser } from "../../api/authApi";
import { useAuthStore } from "../../store/authStore";
import Button from "../common/Button";
import Input from "../common/Input";
import RoleSelector from "./RoleSelector";

export default function RegisterForm() {
  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const navigate = useNavigate();

  const setAuth = useAuthStore(
    (state) => state.setAuth
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "candidate",
      companyName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const selectedRole = watch("role");
  const password = watch("password");

  const getDashboardPath = (role) => {
    if (role === "employer") {
      return "/employer/dashboard";
    }

    return "/candidate/dashboard";
  };

  const handleRegistration = async (formData) => {
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email
          .trim()
          .toLowerCase(),
        phone: formData.phone.trim(),
        role: formData.role,
        password: formData.password,
        confirmPassword:
          formData.confirmPassword,
      };

      if (formData.role === "employer") {
        payload.companyName =
          formData.companyName.trim();
      }

      const response =
        await registerUser(payload);

      const token = response?.data?.token;
      const user = response?.data?.user;

      if (!token || !user) {
        throw new Error(
          "Invalid registration response from server."
        );
      }

      setAuth({
        token,
        user,
      });

      toast.success(
        response?.message ||
          "Registration completed successfully."
      );

      navigate(
        getDashboardPath(user.role),
        {
          replace: true,
        }
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to create the account."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(
        handleRegistration
      )}
      className="space-y-5"
    >
      <RoleSelector
        value={selectedRole}
        onChange={(role) =>
          setValue("role", role, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
      />

      <input
        type="hidden"
        {...register("role", {
          required:
            "Account type is required.",
        })}
      />

      <Input
        id="register-name"
        label="Full Name"
        placeholder="Enter your full name"
        autoComplete="name"
        required
        error={errors.name?.message}
        {...register("name", {
          required:
            "Full name is required.",
          minLength: {
            value: 2,
            message:
              "Name must contain at least 2 characters.",
          },
          maxLength: {
            value: 100,
            message:
              "Name cannot exceed 100 characters.",
          },
        })}
      />

      <Input
        id="register-email"
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        required
        error={errors.email?.message}
        {...register("email", {
          required:
            "Email address is required.",
          pattern: {
            value:
              /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message:
              "Enter a valid email address.",
          },
        })}
      />

      <Input
        id="register-phone"
        label="Phone Number"
        type="tel"
        placeholder="+880 1700-000000"
        autoComplete="tel"
        error={errors.phone?.message}
        {...register("phone", {
          maxLength: {
            value: 30,
            message:
              "Phone number cannot exceed 30 characters.",
          },
        })}
      />

      {selectedRole === "employer" ? (
        <Input
          id="register-company"
          label="Company Name"
          placeholder="Enter company name"
          required
          error={
            errors.companyName?.message
          }
          {...register("companyName", {
            validate: (value) =>
              selectedRole !== "employer" ||
              value.trim().length > 0 ||
              "Company name is required for employers.",
          })}
        />
      ) : null}

      <div className="relative">
        <Input
          id="register-password"
          label="Password"
          type={
            showPassword
              ? "text"
              : "password"
          }
          placeholder="Minimum 8 characters"
          autoComplete="new-password"
          required
          className="pr-12"
          error={errors.password?.message}
          {...register("password", {
            required:
              "Password is required.",
            minLength: {
              value: 8,
              message:
                "Password must contain at least 8 characters.",
            },
          })}
        />

        <button
          type="button"
          onClick={() =>
            setShowPassword(
              (current) => !current
            )
          }
          className="absolute right-3 top-[42px] rounded-md p-1 text-slate-500 hover:bg-slate-100"
          aria-label={
            showPassword
              ? "Hide password"
              : "Show password"
          }
        >
          {showPassword ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      </div>

      <div className="relative">
        <Input
          id="register-confirm-password"
          label="Confirm Password"
          type={
            showConfirmPassword
              ? "text"
              : "password"
          }
          placeholder="Re-enter your password"
          autoComplete="new-password"
          required
          className="pr-12"
          error={
            errors.confirmPassword?.message
          }
          {...register(
            "confirmPassword",
            {
              required:
                "Confirm your password.",
              validate: (value) =>
                value === password ||
                "Passwords do not match.",
            }
          )}
        />

        <button
          type="button"
          onClick={() =>
            setShowConfirmPassword(
              (current) => !current
            )
          }
          className="absolute right-3 top-[42px] rounded-md p-1 text-slate-500 hover:bg-slate-100"
          aria-label={
            showConfirmPassword
              ? "Hide password"
              : "Show password"
          }
        >
          {showConfirmPassword ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      </div>

      <label className="flex items-start gap-3 text-sm text-slate-600">
        <input
          type="checkbox"
          required
          className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-700"
        />

        <span>
          I agree to the{" "}
          <Link
            to="/terms"
            className="font-semibold text-blue-700 hover:text-blue-800"
          >
            Terms and Conditions
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy"
            className="font-semibold text-blue-700 hover:text-blue-800"
          >
            Privacy Policy
          </Link>
          .
        </span>
      </label>

      <Button
        type="submit"
        size="lg"
        loading={isSubmitting}
        className="w-full"
      >
        <UserPlus size={18} />
        Create Account
      </Button>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-blue-700 hover:text-blue-800"
        >
          Login
        </Link>
      </p>
    </form>
  );
}