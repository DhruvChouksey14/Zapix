import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-white gap-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ff4f00"
        strokeWidth={1.2}
        className="size-20"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.75 9.75c0-1.5 1-2.25 2.25-2.25s2.25.75 2.25 2.25c0 1.125-.75 1.688-1.5 2.25-.563.42-1 .8-1 1.5m0 2.25h.008M12 21.75c5.385 0 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25 2.25 6.615 2.25 12 6.615 21.75 12 21.75Z"
        />
      </svg>
      <p className="font-bold text-3xl">Page not found</p>
      <p className="text-gray-600">The page you're looking for doesn't exist.</p>
      <Link
        href="/"
        className="font-semibold underline underline-offset-2 hover:text-[#ff4f00] transition-colors"
      >
        Return to homepage
      </Link>
    </div>
  );
}