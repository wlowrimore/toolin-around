"use client";

import { useState } from "react";
import { Gem } from "lucide-react";
import FeatureModal from "./FeatureModal";
import { LoadingSpinner } from "../LoadingAnimations";

const CTA = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleModalClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="max-w-[50%] flex flex-col py-2 px-4">
        <h3 className="text-lg font-semibold text-neutral-600 mb-3">
          You are not a featured lister. Let&apos;s change that!
        </h3>
        <p className="text-sm text-neutral-600/95 tracking-wide leading-tight -mt-4">
          By signing up as a featured lister, you&apos;ll be able to showcase
          your listings to a wider audience, attract more interest in your
          products, and boost your visibility.
        </p>
        <button
          onClick={handleModalClick}
          className="w-fit pr-2 pl-1 py-1 bg-sky-600 flex items-center gap-1 mt-1 rounded-sm border border-sky-500 hover:bg-sky-500 hover:text-slate-800 hover:border-sky-600 transition-colors duration-200"
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <Gem size={22} strokeWidth={0.5} fill="#7dd3fc" />
          )}
          <span className="text-white text-sm">I&apos;m Interested</span>
        </button>
      </div>

      <FeatureModal isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

export default CTA;
