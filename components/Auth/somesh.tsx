"use client"

import React, { useState } from "react"
import { supabase } from "@/lib/supabaseClient"


export const SignupForm: React.FC = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [region, setRegion] = useState("+1")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Regex for validations
  const nameRegex = /^[A-Za-z\s]+$/
  const phoneRegex = /^[0-9]{10}$/

const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setError(null);
  setSuccess(null);

  console.log("=== Signup started ===");
  console.log("Form values:", { name, email, phone, region });

  // Validations
  const nameRegex = /^[A-Za-z\s]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  if (!nameRegex.test(name)) {
    const msg = "❌ Full Name should contain letters only.";
    setError(msg);
    console.error(msg);
    return;
  }

  if (!phoneRegex.test(phone)) {
    const msg = "❌ Phone Number must be exactly 10 digits.";
    setError(msg);
    console.error(msg);
    return;
  }

  setLoading(true);

  try {
    console.log("Attempting Supabase signup...");

    const { data, error: supabaseError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone: `${region}${phone}`,
        },
      },
    });

    console.log("Supabase response data:", data);
    console.log("Supabase response error:", supabaseError);

    if (supabaseError) {
      setError(supabaseError.message);
      setLoading(false);
      return;
    }

    console.log("Supabase signup successful!");

    // Send data to API route
    const apiResponse = await fetch("/api/signupSheet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone: `${region}${phone}` }),
    });

    console.log("API response status:", apiResponse.status);
    console.log("API response headers:", apiResponse.headers);

    let result: { success: boolean; message: string; sheetLink?: string } | null = null;
    try {
      result = await apiResponse.json();
      console.log("API response body:", result);
    } catch (jsonErr) {
      console.error("Failed to parse JSON from API response:", jsonErr);
    }

    if (!apiResponse.ok) {
      setError(result?.message ?? "Failed to save to Google Sheet");
      console.error("API route returned error:", result);
    } else {
      setSuccess(
        `🎉 Account created successfully! Sheet link: ${result?.sheetLink ?? "Not provided"}`
      );
      console.log("User data successfully sent via API route:", result);
    }

    // Reset form
    setName("");
    setEmail("");
    setPassword("");
    setPhone("");
    setRegion("+1");

  } catch (err) {
    console.error("Unexpected signup error:", err);
    setError(err instanceof Error ? err.message : String(err));
  } finally {
    setLoading(false);
    console.log("=== Signup finished ===");
  }
};







  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gray-900 px-4 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80')",
        }}
      />

      {/* Glass Blur Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-lg" />

      {/* Form Container */}
      <form
        onSubmit={handleSignup}
        className="relative z-10 w-full max-w-md bg-white/10 rounded-3xl p-6 shadow-lg border border-white/20 backdrop-blur-md"
        style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
      >
        <h2 className="text-2xl font-serif font-semibold text-white mb-5 text-center drop-shadow-lg">
          Create Your Account
        </h2>

        {/* Messages */}
        {error && (
          <p className="text-red-400 bg-red-900/30 p-2 rounded-md text-center font-medium mb-4 drop-shadow">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-400 bg-green-900/30 p-2 rounded-md text-center font-medium mb-4 drop-shadow">
            {success}
          </p>
        )}

        {/* Full Name */}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-3 rounded-md border border-white/30 bg-white/90 text-gray-900 placeholder-gray-500 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 rounded-md border border-white/30 bg-white/90 text-gray-900 placeholder-gray-500 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
        />

        {/* Phone with region */}
        <div className="flex mb-4 gap-2">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="p-3 rounded-md border border-white/30 bg-white/90 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
          >
            <option value="+1">+1 (US)</option>
            <option value="+44">+44 (UK)</option>
            <option value="+91">+91 (IN)</option>
            <option value="+61">+61 (AU)</option>
          </select>
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            maxLength={10}
            className="flex-1 p-3 rounded-md border border-white/30 bg-white/90 text-gray-900 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
          />
        </div>
        <p className="text-xs text-gray-200 mb-4">
          Enter exactly 10 digits, no letters or symbols.
        </p>

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 rounded-md border border-white/30 bg-white/90 text-gray-900 placeholder-gray-500 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        {/* Sign In link */}
        <p className="text-center text-white mt-4 text-sm">
          Already have an account?{" "}
          <span
            className="text-orange-400 font-semibold cursor-pointer hover:underline"
            onClick={() => (window.location.href = "/signin")}
          >
            Sign In
          </span>
        </p>
      </form>
    </div>
  )
}
