"use client";

import { Suspense, useState } from "react";
import { useSession } from "next-auth/react";
import SignUpForm from "./Auth/SignUpForm";
import Link from "next/link";
import Image from "next/image";
import PrivacyPolicyModal from "./Auth/PrivacyPolicyModal";
import { LoadingSpinner } from "./LoadingAnimations";
import { Hurricane, Geist } from "next/font/google";
import { pois } from "@/lib/hero-POIs";

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

  const { id, header, image, description } = pois[0];

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
      <main className="max-w-7xl my-20">
        <div className="w-full flex flex-col items-start justify-center mb-8 p-6">
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
                  Ever been knee-deep in a project and realized you need a tool
                  that you don&apos;t have?
                </p>

                <p>
                  Or dreamed up an awesome build but couldn&apos;t justify
                  buying all the gear?
                </p>

                <p>
                  With <strong>Toolin&apos; Around</strong>, you can find the
                  tools you need and share your own with fellow makers. Think of
                  it as a tool swap marketplace for where DIY dreams become a
                  reality-together.
                </p>

                <em>
                  "Would you have a socket set I could use for a day?"..."Sure!
                  In return might I borrow a ladder?"
                </em>

                <p>
                  That&apos;s the spirit behind{" "}
                  <strong>Toolin&apos; Around</strong>. It&apos;s free to
                  sign-up, easy to use, and a fantastic way to connect with
                  other DIY enthusiasts who get it...
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
          <section className="max-w-[69rem] mx-auto grid grid-cols-4 gap-3 mt-8">
            {pois &&
              pois.map((poi) => (
                <div key={poi.id} className="flex flex-col items-center">
                  <div className="bg-gray-700/30 rounded-md p-8">
                    {/* <div> */}
                    <div className="">
                      <Image
                        src={poi.image}
                        alt="Toolin' Around Logo"
                        width={100}
                        height={100}
                        className="w-full rounded-full bg-black/70"
                      />
                    </div>
                    {/* </div> */}
                  </div>
                  <div className="flex flex-col items-center">
                    <h3 className="text-2xl text-red-600 text-center font-semibold my-4">
                      {poi.header}
                    </h3>
                    <div className="max-h-[8rem]">
                      <p className="text-[1rem] text-center">
                        {poi.description}
                      </p>
                    </div>
                    <h4 className="text-lg text-center text-red-600 font-semibold mt-4">
                      {poi.footer}
                    </h4>
                  </div>
                </div>
              ))}
          </section>
          <div className="max-w-7xl mx-auto flex text-xl p-6 mt-8">
            <div className="flex flex-col items-center">
              <PrivacyPolicyModal
                handlePolicyClick={handlePolicyClick}
                isPolicyReviewed={isPolicyReviewed}
              />
            </div>
          </div>
        </div>
      </main>
    </Suspense>
  );
};

export default Hero;
