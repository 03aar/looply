export function LoadingSpinner({ size = "default" }: { size?: "sm" | "default" | "lg" }) {
  const sizeClasses = {
    sm: "w-8 h-8 border-2",
    default: "w-16 h-16 border-4",
    lg: "w-24 h-24 border-4",
  }

  return (
    <div className={`${sizeClasses[size]} border-purple-600 border-t-transparent rounded-full animate-spin`}></div>
  )
}

export function LoadingPage({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner />
        <p className="text-gray-600 mt-4">{message}</p>
      </div>
    </div>
  )
}
