import { LoginForm } from "../../components/AuthForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-5 md:flex-row w-full h-full overflow-x-hidden">
      <h1 className="p-4 absolute text-2xl font-bold hover:text-[#ff4f00] transition-colors">
        <Link href="/">Zapix</Link>
      </h1>
      <div className="flex flex-col mt-48 basis-1/2 px-5 md:pl-20 lg:pl-60">
        <h2 className="font-bold text-[32px] mb-3">Welcome back</h2>
        <p className="text-gray-700">
          Sign in to keep your automations running and pick up right where you left off.
        </p>
      </div>
      <div className="flex flex-col justify-center basis-1/2 px-5">
        <h2 className="font-semibold text-2xl mb-3">Login to your account</h2>
        <LoginForm />
      </div>
    </div>
  );
}