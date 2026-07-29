import React, { type ReactNode } from "react";

const Tooltip = ({ children, tooltipText }: { children: ReactNode; tooltipText: string }) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 translate-y-1 mb-3 border border-gray-400 bg-white text-gray-700 text-sm rounded py-1 px-2 w-max max-w-[300px] md:max-w-[400px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 break-words">
        {tooltipText}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-[5px] w-3 h-3 bg-white rotate-45 border-b border-r border-gray-400" />
      </div>
    </div>
  );
};

export default Tooltip;