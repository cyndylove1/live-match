import React, { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "link";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  loadingText?: string; 
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  loadingText,
  children,
  className,
  disabled,
  ...props
}) => {
  const base =
    "rounded-lg font-medium focus:outline-none focus:ring-2 transition-colors";

  const variantClasses = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 focus:ring-blue-500",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-300 focus:ring-gray-400",
    success:
      "bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 focus:ring-green-500",
    link: "text-blue-600 hover:text-blue-800 bg-transparent px-0 py-0",
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={clsx(
        base,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        disabled && "cursor-not-allowed opacity-70",
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? loadingText || "Loading..." : children}
    </button>
  );
};
