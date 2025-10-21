"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Github, Chrome, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import useAuth from "@/Firebase/useAuth";
import Image from "next/image";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role] = useState("student");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { createUser } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await createUser(name, email, password, role);
      router.push("/"); // redirect to home or dashboard
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 p-4">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-xl border border-gray-200">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <div className="flex justify-center mb-2">
            <Image
              src="https://clerk.dev/images/logo.svg"
              alt="clerk"
              width={10}
              height={10}
              className="h-6"
            />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">
            Create Your Account
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Join us and get started today
          </p>
        </div>

        {/* OAuth Buttons */}
        <div className="px-8 space-y-3">
          <Button
            variant="outline"
            className="w-full justify-center gap-2 border-gray-300 hover:bg-gray-50"
          >
            <Chrome className="w-4 h-4 text-gray-600" />
            Google
          </Button>
          <Button
            variant="outline"
            className="w-full justify-center gap-2 border-gray-300 hover:bg-gray-50"
          >
            <Github className="w-4 h-4 text-gray-700" />
            GitHub
          </Button>
        </div>

        {/* Divider */}
        <div className="relative py-4 px-8">
          <Separator className="bg-gray-200" />
          <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-gray-400 text-sm px-2">
            or
          </span>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="px-8 pb-4 space-y-4">
          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          {/* Name */}
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <Input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="h-11 text-gray-700 border-gray-300 focus-visible:ring-1 focus-visible:ring-indigo-500"
          />

          {/* Email */}
          <label className="text-sm font-medium text-gray-700">
            Email address
          </label>
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11 text-gray-700 border-gray-300 focus-visible:ring-1 focus-visible:ring-indigo-500"
          />

          {/* Password with Eye Toggle */}
          <div className="relative">
            <label className="text-sm font-medium text-gray-700 pb-3 flex items-center gap-2">
              Password
            </label>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 text-gray-700 border-gray-300 focus-visible:ring-1 focus-visible:ring-indigo-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 mt-[15px] text-gray-500"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm disabled:opacity-70"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 border-t border-gray-200 py-4">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-indigo-600 hover:underline font-medium"
          >
            Log in
          </Link>
        </div>

        {/* Firebase Footer */}
        <div className="text-center text-xs text-gray-400 pb-4">
          Secured by{" "}
          <span className="font-semibold text-gray-500">Firebase</span>
        </div>
      </div>
    </div>
  );
}
