export default function Loader({
  label = "Loading...",
  fullScreen = false,
  size = "md",
}) {
  const sizes = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={[
          "animate-spin rounded-full border-4 border-slate-200 border-t-blue-700",
          sizes[size] || sizes.md,
        ].join(" ")}
      />

      {label ? (
        <p className="text-sm text-slate-600">{label}</p>
      ) : null}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
        {content}
      </div>
    );
  }

  return (
    <div className="flex min-h-40 items-center justify-center">
      {content}
    </div>
  );
}