import { SignupForm } from "../../components/AuthForm";
import Link from "next/link";

const perks = [
  "No-code setup, live in minutes",
  "Free plan covers all the core features",
  "14-day trial of every premium tool",
];

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ff4f00" className="size-6 shrink-0">
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
      clipRule="evenodd"
    />
  </svg>
);

export default function SignupPage() {
  return (
    <div className="flex flex-col gap-5 md:flex-row w-full h-full overflow-x-hidden">
      <h1 className="p-4 absolute text-2xl font-bold hover:text-[#ff4f00] transition-colors">
        <Link href="/">Zapix</Link>
      </h1>

      <div className="flex flex-col justify-center basis-1/2 px-5 md:pl-20 lg:pl-60">
        <h2 className="font-bold text-[32px] mb-10">
          Join the teams already automating their busywork with Zapix.
        </h2>
        <ul className="flex flex-col gap-6">
          {perks.map((perk) => (
            <li key={perk} className="flex gap-2 items-start">
              <CheckIcon />
              <p>{perk}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col justify-center basis-1/2 px-5">
        <SignupForm />
      </div>
    </div>
  );
}