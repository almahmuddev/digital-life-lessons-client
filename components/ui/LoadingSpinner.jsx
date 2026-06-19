export default function LoadingSpinner({ size = "md", fullPage = false }) {
  const sizes = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-4",
  };

  const spinner = (
    <div
      className={`${sizes[size]} rounded-full border-violet-500 border-t-transparent animate-spin`}
    />
  );

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}
