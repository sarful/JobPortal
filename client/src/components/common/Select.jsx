import { forwardRef } from "react";

const Select = forwardRef(function Select(
  {
    label,
    id,
    error,
    required = false,
    options = [],
    placeholder = "Select an option",
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

      <select
        ref={ref}
        id={id}
        className={[
          "w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900",
          "outline-none transition",
          "focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
            : "border-slate-300",
          className,
        ].join(" ")}
        {...props}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => {
          const value =
            typeof option === "string" ? option : option.value;

          const label =
            typeof option === "string" ? option : option.label;

          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>

      {error ? (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      ) : null}
    </div>
  );
});

export default Select;