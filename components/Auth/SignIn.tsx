"use client";

import { supabase } from "@/lib/supabaseClient";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const illustrationSrc =
  "https://images.unsplash.com/vector-1740835853238-233633b61af2?q=80&w=725&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-xl max-w-3xl w-full overflow-hidden">
        {/* Left side: Form */}
        <div className="md:w-1/2 w-full flex flex-col justify-center px-10 py-12">
          <div className="mb-8 max-w-sm mx-auto">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 leading-snug text-left">
              SBMS Family
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-1 leading-snug text-left">
              Welcome back
            </h2>
            <p className="text-gray-600 mt-1 text-sm md:text-base text-left">
              Please enter your details to sign in to your account
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-300 font-medium max-w-sm mx-auto text-sm">
              {error}
            </div>
          )}

          <form className="space-y-5 max-w-sm mx-auto" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block mb-1 font-medium text-gray-700 text-sm"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-1 font-medium text-gray-700 text-sm"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between text-xs md:text-sm max-w-sm mx-auto">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-700 select-none font-medium">
                  Remember for 30 days
                </span>
              </label>
              <a
                href="/forgot-password"
                className="text-purple-600 hover:underline font-medium"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 transition text-white font-semibold py-2.5 rounded-md shadow text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign in"}
            </button>

            <p className="text-center text-gray-600 text-xs md:text-sm mt-6 max-w-sm mx-auto">
              Don’t have an account?{" "}
              <a
                href="/signup"
                className="text-purple-600 hover:underline font-medium"
              >
                Sign up
              </a>
            </p>
          </form>
        </div>

        {/* Right side: Illustration */}
        <div className="md:w-1/2 w-full bg-purple-100 flex items-center justify-center p-10">
          <Image
            src={illustrationSrc}
            alt="Customer Support Illustration"
            width={450}
            height={450}
            className="object-contain max-h-[70vh]"
            priority={true}
          />
        </div>
      </div>
    </div>
  );
}
