"use client";

import Link from "next/link";
import React, { useState, type Dispatch, type SetStateAction } from "react";
import { usePathname, useRouter } from "next/navigation";
import Button from "./Button";
import Spinner from "./Spinner";

const Navbar = ({
  dropdownVisible,
  setDropdownVisible,
  session,
}: {
  dropdownVisible: boolean;
  setDropdownVisible: Dispatch<SetStateAction<boolean>>;
  session: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const [navigatingTo, setNavigatingTo] = useState<
    "login" | "signup" | null
  >(null);

  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  const handleNavigate = (target: "login" | "signup") => {
    setNavigatingTo(target);
    router.push(`/${target}`);
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-14 bg-white border-b shadow-sm flex items-center justify-between px-6 z-50">
      <Link
        href={session ? "/dashboard" : "/"}
        className="text-[#ff4f00] font-bold text-2xl"
      >
        Zapix
      </Link>

      {session ? (
        <div
          className="relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="flex justify-center items-center w-10 h-10 rounded-full bg-[#ff4f00] hover:bg-[#e04600] transition-colors"
            onClick={() => setDropdownVisible(!dropdownVisible)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="size-5"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {dropdownVisible && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg flex flex-col">
              <button
                className="text-left px-3 py-2 hover:bg-gray-100"
              >
                My Profile
              </button>

              <button
                className="text-left px-3 py-2 hover:bg-gray-100 text-red-500"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  router.push("/login");
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <Button variant="link" onClick={() => handleNavigate("login")}>
            Login
            {navigatingTo === "login" && <Spinner color="primary" />}
          </Button>

          <Button variant="primary" onClick={() => handleNavigate("signup")}>
            Sign Up
            {navigatingTo === "signup" && <Spinner color="white" />}
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;