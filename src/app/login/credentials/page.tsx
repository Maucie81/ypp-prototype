"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CredentialsPage() {
  const router = useRouter();
  const [signing, setSigning] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setSigning(true);
    sessionStorage.setItem("authLoading", "true");
    await new Promise((r) => setTimeout(r, 650));
    router.push("/overview");
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      {/* Top nav bar */}
      <header className="flex h-[64px] shrink-0 items-center px-6 bg-[#330478]">
        <span className="font-yahoo-product-sans text-[21px] font-extrabold tracking-[-0.04em] text-white leading-none">
          partner portal
        </span>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left — illustration */}
        <div className="relative hidden flex-1 overflow-hidden lg:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/login-illustration.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        </div>

        {/* Right — credentials form */}
        <div className="flex w-full flex-col items-center justify-center bg-white px-10 py-16 lg:w-[53%] lg:max-w-[760px]">
          <div className="w-full max-w-[402px]">
            {/* Back link */}
            <Link
              href="/login"
              className="mb-8 inline-flex items-center gap-1.5 font-yahoo-product-sans text-[14px] text-[#464e56] hover:text-[#232a31] transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back
            </Link>

            {/* Heading */}
            <div className="mb-8">
              <h1 className="font-yahoo-product-sans text-[32px] font-bold leading-10 tracking-tight text-[#141414]">
                Sign in
              </h1>
              <p className="mt-1 font-yahoo-product-sans text-[16px] leading-[1.6] text-[#464e56]">
                Welcome back, Jacob
              </p>
            </div>

            <form onSubmit={handleSignIn} className="flex flex-col gap-4">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="font-yahoo-product-sans text-[14px] font-medium text-[#232a31]"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  defaultValue="jfreeman@datapulse.com"
                  readOnly
                  className="h-[52px] w-full rounded-[10px] border border-[#e0e4e9] bg-[#f5f8fa] px-4 font-yahoo-product-sans text-[16px] text-[#232a31] outline-none focus:border-[#5D5EFF] focus:bg-white focus:ring-2 focus:ring-[#5D5EFF]/20 transition-all"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="font-yahoo-product-sans text-[14px] font-medium text-[#232a31]"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    className="font-yahoo-product-sans text-[14px] text-[#5D5EFF] hover:text-[#4A4BE8] transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  id="password"
                  type="password"
                  defaultValue="partner2024!"
                  readOnly
                  className="h-[52px] w-full rounded-[10px] border border-[#e0e4e9] bg-[#f5f8fa] px-4 font-yahoo-product-sans text-[16px] text-[#232a31] outline-none focus:border-[#5D5EFF] focus:bg-white focus:ring-2 focus:ring-[#5D5EFF]/20 transition-all"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={signing}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#5D5EFF] py-[14px] px-5 font-yahoo-product-sans text-[16px] font-bold text-white transition-colors hover:bg-[#4A4BE8] disabled:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5D5EFF] focus-visible:ring-offset-2"
              >
                {signing ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                    >
                      <circle
                        className="opacity-25"
                        cx="12" cy="12" r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            {/* Footer */}
            <p className="mt-8 text-center font-yahoo-product-sans text-[14px] leading-[1.6] text-[#828a93]">
              Don't have an account?{" "}
              <a
                href="mailto:content.partnership.support@yahooinc.com"
                className="text-[#5D5EFF] hover:text-[#4A4BE8] underline underline-offset-2 transition-colors"
              >
                Request an invite
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
