'use client';

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = "Loading..." }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      <div className="text-sm text-gray-300">{message}</div>
    </div>
  );
}
