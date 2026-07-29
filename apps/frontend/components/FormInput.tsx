import React from "react";

const FormInput = ({
  label,
  name,
  onChange,
}: {
  label: string;
  name: string;
  onChange: (e: any) => void;
}) => {
  const isPassword = label.toLowerCase() === "password";

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="font-semibold">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={isPassword ? "password" : "text"}
        onChange={onChange}
        className="border border-gray-400 rounded px-3 py-2 bg-white text-black focus:outline-none focus:border-[#ff4f00]"
      />
    </div>
  );
};

export default FormInput;