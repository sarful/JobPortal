import { forwardRef } from "react";

const Input = forwardRef(function Input(
  {
    label,
    id,
    error,
    required = false,
    helperText,
    className = "",
    containerClassName = "",
    ...props
  },
  ref
) {
  return (
    <div className={containerClassName}>
      {label ? (
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          {label}

          {required ? (
            <span className="ml-1 text-red-500">*</span>
          ) : null}
        </label>
      ) : null}

      <input
        ref={ref}
        id={id}
        className={[
          "w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900",
          "outline-none transition placeholder:text-slate-400",
          "focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
            : "border-slate-300",
          className,
        ].join(" ")}
        {...props}
      />

      {error ? (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      ) : helperText ? (
        <p className="mt-1.5 text-sm text-slate-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

export default Input;