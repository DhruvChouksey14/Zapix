import React from "react";

const Spinner = ({ color = "primary" }: { color?: "primary" | "white" }) => {
  const colorClass = color === "white" ? "text-white" : "text-[#ff4f00]";

  return (
    <div
      className={`animate-spin inline-block size-6 border-[3px] border-current border-t-transparent rounded-full ${colorClass}`}
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;