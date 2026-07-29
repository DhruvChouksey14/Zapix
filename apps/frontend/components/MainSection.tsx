"use client";

import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { getSessionDetails } from "../public/helper";

function MainSection({ children }: { children?: React.ReactNode }) {
  const [session, setSession] = useState<{
    token: string | null;
    user: { id: string; name?: string; email?: string } | null;
  }>({
    token: null,
    user: null,
  });

  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    setSession(getSessionDetails());
  }, []);

  return (
    <div
      className="w-full min-h-screen overflow-x-hidden"
      onClick={() => {
        if (dropdownVisible) {
          setDropdownVisible(false);
        }
      }}
    >
      <Navbar
        dropdownVisible={dropdownVisible}
        setDropdownVisible={setDropdownVisible}
        session={session.token ?? ""}
      />

      <div className="mt-14">{children}</div>
    </div>
  );
}

export default MainSection;