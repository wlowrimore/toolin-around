"use client";

import { Suspense, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import SignUpForm from "./Auth/SignUpForm";
import Link from "next/link";
import PrivacyPolicyModal from "./Auth/PrivacyPolicyModal";
import { LoadingSpinner } from "./LoadingAnimations";
import { Hurricane, Geist } from "next/font/google";

const hurricane = Hurricane({
  variable: "--font-hurricane",
  weight: ["400"],
  style: ["normal"],
  display: "swap",
  subsets: ["latin"],
});

const geist = Geist({
  variable: "--font-geist",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal"],
  display: "swap",
  subsets: ["latin"],
});

const Hero = () => {
  const [isPolicyReviewed, setIsPolicyReviewed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePolicyClick = () => {
    setIsPolicyReviewed(true);
    setIsModalOpen(true);
  };

  return (
    <Suspense
      fallback={
        <div>
          <LoadingSpinner />
        </div>
      }
    >
      <div className="w-full flex flex-col items-start justify-center mt-16 mb-8 p-6">
        <h1 className={`${hurricane.className} text-8xl text-red-600`}>
          Toolin&apos; Around
        </h1>
        <span
          className={`${geist.className} w-full mt-[-0.6rem] text-base font-semibold tracking-wider text-black ml-1.5`}
        >
          YOUR ONE-STOP CO-OP FOR TOOL SWAPPING
        </span>

        <hr className="h-0.5 w-full bg-black" />
      </div>
      <div className="w-full mx-auto">
        <div className="flex flex-col text-lg items-center px-6">
          <div className="flex flex-col items-start">
            <article className="w-full space-y-3">
              <p>
                Have you ever found yourself in the middle of a DIY project and
                realized you need a tool that you don't have?
              </p>

              <p>
                Or maybe you have an idea for a new project but can&apos;t get
                started because you don&apos;t own the tools needed?
              </p>

              <p>
                With <strong>Toolin&apos; Around</strong>, you can find the
                tools you need and share your own tools with the community.
                Think of it as a tool swap marketplace for DIY enthusiasts.
              </p>

              <p>
                We are dedicated to getting back to the days when neighbors
                helped one another.
                <em>
                  "Would you have a socket set I could use for a day?"..."Sure!
                  In return might I borrow a ladder?"
                </em>
              </p>

              <p>
                That&apos;s the idea behind <strong>Toolin&apos; Around</strong>
                . It&apos;s free to sign-up, easy to use, and a great way to
                connect with other DIY enthusiasts...
                <Link href="/about">
                  <span className="text-red-600 text-base hover:text-blue-500 transition-color duration-200">
                    read on
                  </span>
                </Link>
                .
              </p>
            </article>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex justify-start text-xl p-6 mt-8">
          <div className="flex flex-col items-start">
            <PrivacyPolicyModal
              handlePolicyClick={handlePolicyClick}
              isPolicyReviewed={isPolicyReviewed}
            />
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Hero;
