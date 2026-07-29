"use client";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import FormInput from "./FormInput";
import Button from "./Button";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SignupData {
  name: string;
  email: string;
  password: string;
}

export const SignupForm = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SignupData>({ name: "", email: "", password: "" });
  const router = useRouter();

  const handleChange = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:8000/api/auth/signup", data);
      router.push("/login");
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border border-gray-400 rounded-md w-full lg:w-[60%]">
      <form className="flex flex-col gap-2">
        <FormInput label="Name" name="name" onChange={handleChange} />
        <FormInput label="Email" name="email" onChange={handleChange} />
        <FormInput label="Password" name="password" onChange={handleChange} />
        <p className="text-sm text-gray-600">
          By signing up, you agree to Zapix's terms of service and privacy policy.
        </p>
        <div className="flex flex-col gap-2 items-center self-center mt-2">
          <Button variant="primary" size="lg" onClick={handleSubmit}>
            <span className="mr-2">Get started for free</span>
            {loading && <Spinner color="white" />}
          </Button>
          <Link href="/login">Already have an account? Login</Link>
        </div>
      </form>
    </div>
  );
};

interface LoginData {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<LoginData>({ email: "", password: "" });
  const router = useRouter();

  const handleChange = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/api/auth/signin", data);
      localStorage.setItem("token", res?.data?.data?.token);
      localStorage.setItem("user", JSON.stringify(res?.data?.data));
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border border-gray-400 rounded-md w-full lg:w-[60%]">
      <form className="flex flex-col gap-2">
        <FormInput label="Email" name="email" onChange={handleChange} />
        <FormInput label="Password" name="password" onChange={handleChange} />
        <p className="text-sm text-gray-600">
          By continuing, you agree to Zapix's terms of service and privacy policy.
        </p>
        <div className="flex flex-col gap-2 items-center self-center mt-2">
          <Button variant="primary" size="lg" onClick={handleSubmit}>
            <span className="mr-2">Continue</span>
            {loading && <Spinner color="white" />}
          </Button>
          <Link href="/signup">Don't have an account? Sign up</Link>
        </div>
      </form>
    </div>
  );
};