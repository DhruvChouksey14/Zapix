"use client";
import React from "react";

type ButtonVariant = "primary" | "dark" | "link" | "outline";
type ButtonSize = "md" | "lg";

// Plain lookup object instead of a classnames library - one line per variant, easy to scan.
const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-[#ff4f00] text-white font-semibold px-6 py-2 hover:bg-[#e04600] transition-colors",
  dark: "bg-black text-white font-semibold px-6 py-2 hover:bg-gray-800 transition-colors",
  link: "bg-white text-black font-normal hover:bg-gray-100 transition-colors",
  outline: "bg-white text-black font-semibold px-6 py-2 border border-black hover:border-2 transition-all",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "",
  lg: "w-[272px]",
};

const Button = ({
  variant,
  onClick,
  size = "md",
  children,
}: {
  variant: ButtonVariant;
  onClick: (e: any) => void;
  size?: ButtonSize;
  children?: React.ReactNode;
}) => {
  const classes = `flex items-center justify-center px-2 py-1 rounded-full ${variantClasses[variant]} ${sizeClasses[size]}`;

  return (
    <button className={classes} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;