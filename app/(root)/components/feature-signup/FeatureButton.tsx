"use client";

import { useState } from "react";
import CTA, { CTAProps } from "./CTA";
import { Gem } from "lucide-react";
import { LoadingSpinner } from "../LoadingAnimations";

const FeatureButton = () => {
  const [isOpen, setIsOpen] = useState<CTAProps["isOpen"]>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClick = () => {
    setIsLoading(true);
    setIsOpen(true);

    setIsLoading(false);
  };

  return (
    <>
      <CTA isOpen={isOpen} />
      <button
        type="button"
        title="Sign up as a featured user"
        onClick={handleClick}
        className="w-fit pr-2 pl-1 py-1 bg-sky-600 flex items-center gap-1 mt-1 rounded-sm border border-sky-500 hover:bg-sky-500 hover:text-slate-800 hover:border-sky-600 transition-colors duration-200"
      >
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <Gem size={22} strokeWidth={0.5} fill="#7dd3fc" />
        )}
        <span className="text-white text-sm">I&apos;m Interested</span>
      </button>
    </>
  );
};

export default FeatureButton;
