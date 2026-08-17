"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      {/* Top nav bar */}
      <header className="flex h-[64px] shrink-0 items-center px-6 bg-[#330478]">
        <span className="font-yahoo-product-sans text-[21px] font-extrabold tracking-[-0.04em] text-white leading-none">
          partner portal
        </span>
      </header>

      {/* Body: left illustration + right sign-in panel */}
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

        {/* Right — sign-in panel */}
        <div className="flex w-full flex-col items-center justify-center bg-white px-10 py-16 lg:w-[53%] lg:max-w-[760px]">
          <div className="w-full max-w-[402px]">
            {/* Heading */}
            <div className="mb-8 text-center">
              <h1 className="font-yahoo-product-sans text-[32px] font-bold leading-10 tracking-tight text-[#141414]">
                Welcome to Partner Portal
              </h1>
              <p className="mt-2 font-yahoo-product-sans text-[16px] leading-[1.6] text-[#141414]">
                Track content performance, manage feeds and uncover
                <br className="hidden sm:block" /> what resonates with Yahoo audiences.
              </p>
            </div>

            {/* Sign in button */}
            <Link
              href="/login/credentials"
              className="flex w-full items-center justify-center rounded-full bg-[#5D5EFF] py-[14px] px-5 font-yahoo-product-sans text-[16px] font-bold text-white transition-colors hover:bg-[#4A4BE8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5D5EFF] focus-visible:ring-offset-2"
            >
              Sign in
            </Link>

            {/* Invite text */}
            <p className="mt-8 text-center font-yahoo-product-sans text-[16px] leading-[1.6] text-[#141414]">
              For an invite, email{" "}
              <a
                href="mailto:content.partnership.support@yahooinc.com"
                className="underline decoration-solid underline-offset-2 hover:text-[#5D5EFF]"
              >
                content.partnership.support@yahooinc.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
