"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ArrowLeft,
  Building2,
} from "lucide-react";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen bg-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl min-h-[650px] bg-white rounded-3xl overflow-hidden shadow-2xl grid lg:grid-cols-2">
        
        {/* Left - Branding */}
        <div className="hidden lg:flex relative bg-zinc-900 text-white p-12 flex-col justify-between overflow-hidden">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80')",
            }}
          />

          <div className="absolute inset-0 bg-black/50" />

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-orange-500 flex items-center justify-center">
                <Building2 size={24} />
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-wide">
                  BUILD<span className="text-orange-500">PRO</span>
                </h1>

                <p className="text-xs text-zinc-300">
                  Construction & Design
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 max-w-lg">
            <p className="text-orange-400 font-medium mb-3">
              ADMINISTRATION PORTAL
            </p>

            <h2 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
              Manage your construction projects with confidence.
            </h2>

            <p className="text-zinc-300 text-base leading-7">
              Manage building designs, projects, documents, enquiries and
              other website content from one centralized dashboard.
            </p>
          </div>

          <div className="relative z-10 text-sm text-zinc-400">
            © {new Date().getFullYear()} BuildPro Construction.
            All rights reserved.
          </div>
        </div>

        {/* Right - Login */}
        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-3 mb-10">
              <div className="w-11 h-11 rounded-xl bg-orange-500 text-white flex items-center justify-center">
                <Building2 size={24} />
              </div>

              <div>
                <h1 className="text-xl font-bold">
                  BUILD<span className="text-orange-500">PRO</span>
                </h1>

                <p className="text-xs text-zinc-500">
                  Construction & Design
                </p>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-5">
                <LockKeyhole size={23} />
              </div>

              <h2 className="text-3xl font-bold text-zinc-900">
                Welcome back
              </h2>

              <p className="text-zinc-500 mt-2">
                Sign in to access your administration dashboard.
              </p>
            </div>

            {/* Form */}
            <form className="space-y-5">

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-zinc-700 mb-2"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  />

                  <input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    className="w-full h-13 pl-11 pr-4 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-zinc-700"
                  >
                    Password
                  </label>

                  <Link
                    href="/admin/forgot-password"
                    className="text-sm font-medium text-orange-600 hover:text-orange-700"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full h-13 pl-11 pr-12 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember */}
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-zinc-300 text-orange-500 focus:ring-orange-500"
                  />

                  <span className="text-sm text-zinc-600">
                    Remember me
                  </span>
                </label>
              </div>

              {/* Login button */}
              <button
                type="submit"
                className="w-full h-13 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition duration-200 shadow-lg shadow-orange-500/20"
              >
                Sign in
              </button>
            </form>

            {/* Back to website */}
            <div className="mt-8 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-orange-600 transition"
              >
                <ArrowLeft size={16} />
                Back to website
              </Link>
            </div>

            {/* Security message */}
            <div className="mt-10 pt-6 border-t border-zinc-100">
              <p className="text-center text-xs text-zinc-400">
                This area is restricted to authorized administrators only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}