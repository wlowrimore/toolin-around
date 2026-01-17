"use client";

import { useState } from "react";
import { Gem } from "lucide-react";
import FeatureModal from "./FeatureModal";
import FeatureButton from "./FeatureButton";

export interface CTAProps {
  isOpen: boolean;
}

const CTA = ({ isOpen }: CTAProps) => {
  //   const [isOpen, setIsOpen] = useState<CTAProps["isOpen"]>(false);

  return (
    <main className="max-w-[50%] flex flex-col py-2 px-4 bg-black">
      <h3 className="text-lg font-semibold text-white mb-3">
        You are not a featured lister. Let&apos;s change that!
      </h3>
      <p className="text-sm text-neutral-300 -mt-4">
        By signing up as a featured user, you&apos;ll be able to showcase your
        listings to a wider audience, attract more interest in your products,
        and boost your visibility.
      </p>
      <FeatureButton />
      {/* <FeatureModal isOpen={isOpen} /> */}
    </main>
  );
};

export default CTA;
