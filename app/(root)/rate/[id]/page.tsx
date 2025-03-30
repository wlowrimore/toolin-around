import { LoadingBar } from "@/components/LoadingAnimations";
import React, { Suspense } from "react";

const RatePage = () => {
  return (
    <main className="max-w-6xl mx-auto flex flex-col items-center font-[family-name:var(--font-poppins)] w-full my-10 px-6">
      <Suspense
        fallback={
          <div>
            <LoadingBar />
          </div>
        }
      >
        <div>RatePage</div>
      </Suspense>
    </main>
  );
};

export default RatePage;
