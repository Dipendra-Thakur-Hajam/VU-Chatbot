export default function UniversityLogo({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "h-8",
    md: "h-12",
    lg: "h-16"
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo placeholder - replace with actual logo image */}
      <div className={`${sizes[size]} aspect-square rounded-lg bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center shadow-md`}>
        <span className="text-white font-bold text-lg">VU</span>
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-gray-900 dark:text-white leading-tight">
          Vishwakarma University
        </span>
        <span className="text-xs text-gray-600 dark:text-gray-400">
          Admission Assistant
        </span>
      </div>
    </div>
  );
}
