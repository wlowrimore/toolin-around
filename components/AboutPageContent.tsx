import { Suspense } from "react";
import { LoadingBar } from "./LoadingAnimations";

const AboutPageContent = () => {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen flex justify-center items-center mx-auto">
          <LoadingBar />
        </div>
      }
    >
      <main className="max-w-6xl mx-auto flex flex-col items-center font-[family-name:var(--font-poppins)] w-full my-10 px-6 bg-red-500">
        <article className="space-y-4 font-normal">
          <h1 className="text-slate-600 text-3xl font-semibold">
            Welcome to the About Page!
          </h1>
        </article>
      </main>
    </Suspense>
  );
};

export default AboutPageContent;
