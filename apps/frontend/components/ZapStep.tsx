"use client";
import React from "react";

const ZapStep = ({
  index,
  name,
  onClick,
  handleDelete,
}: {
  index: number;
  name: string;
  onClick: () => void;
  handleDelete?: (index: number) => void;
}) => {
  const isConfigured = name !== "Trigger" && name !== "Action";
  const badgeClass = `px-2 w-fit py-1 h-7 flex gap-1 items-center rounded-md border-2 cursor-pointer ${
    isConfigured ? "border-[#ff4f00] bg-orange-50" : "border-gray-700 bg-gray-100"
  }`;

  return (
    <div className="w-[25rem] bg-white shadow-md hover:shadow-lg transition-shadow rounded-md border border-dashed border-gray-700 p-4 hover:border-solid hover:border-[#ff4f00]">
      <div className="flex w-full justify-between">
        <div onClick={onClick} className={badgeClass}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#374151" className="size-4">
            <path
              fillRule="evenodd"
              d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-gray-700">{name}</p>
        </div>

        {index !== 1 && (
          <svg
            onClick={() => handleDelete && handleDelete(index)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#ff4f00"
            className="size-6 cursor-pointer"
          >
            <path
              fillRule="evenodd"
              d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>

      <p className="text-gray-700 mt-2">
        {index}. {name === "Trigger" ? "Choose what kicks off your Zap." : "Choose what runs after your Zap fires."}
      </p>
    </div>
  );
};

export default ZapStep;