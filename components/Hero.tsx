import Image from "next/image";
import SignUpForm from "./Auth/SignUpForm";

const Hero = () => {
  return (
    <div className="w-full mx-auto grid grid-cols-2 text-slate-600 mt-20">
      <div className="flex flex-col text-xl font-bold items-center p-6">
        <div className="flex flex-col items-start">
          <article className="space-y-4 font-normal">
            <p>
              Have you ever found yourself in the middle of a DIY project and
              realized you need a tool that you don't have?
            </p>
            <p>
              Or maybe you have an idea for a new project but can&apos;t get
              started because you don&apos;t own the tools needed?
            </p>
            <p>
              With <strong>Toolin&apos; Around</strong>, you can find the tools
              you need and share your own tools with the community. Think of it
              as a tool swap marketplace for DIY enthusiasts.
            </p>
            <p>
              We are dedicated to getting back to the days when neighbors helped
              one another.
              <em>
                "May I please borrow a cup of sugar?"..."Sure, no problem. Hey,
                while your here, may I borrow your ladder?"
              </em>
            </p>
            <p>
              That&apos;s the idea behind <strong>Toolin&apos; Around</strong>.
              It&apos;s free to sign-up, easy to use, and a great way to connect
              with other DIY enthusiasts.
            </p>
          </article>
        </div>
      </div>
      <div className="flex flex-col text-xl items-center p-6">
        <div className="flex flex-col  items-center">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
};

export default Hero;
