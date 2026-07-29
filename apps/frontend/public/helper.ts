export function getSessionDetails(): {
  token: string | null;
  user: { id: string; name?: string; email?: string } | null;
} {
  if (typeof window === "undefined") {
    return { token: null, user: null };
  }

  const token = localStorage.getItem("token");
  const rawUser = localStorage.getItem("user");

  let user = null;
  try {
    user = rawUser ? JSON.parse(rawUser) : null;
  } catch {
    user = null;
  }

  return { token, user };
}

export function formatDateTimeToCustomString(date: Date | string): string {
  return new Date(date).toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}