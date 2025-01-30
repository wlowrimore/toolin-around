import React from "react";
import LoginModalForm from "./LoginModalForm";

const SignUpForm = () => {
  return (
    <main>
      <h1 className="text-xl font-semibold px-2">Sign Up Today</h1>
      <div className="w-full h-0.5 bg-neutral-300 mt-1 mb-4"></div>
      <form className="ml-2 space-y-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="fullname">Full Name</label>
          <input
            type="text"
            name="fullname"
            id="fullname"
            placeholder="Enter your full name"
            className="w-full text-[1rem] border-2 border-slate-400 px-2 outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            className="w-full text-[1rem] border-2 border-slate-400 px-2 outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            className="w-full text-[1rem] border-2 border-slate-400 px-2 outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Confirm your password"
            className="w-full text-[1rem] border-2 border-slate-400 px-2 outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="screenName">Create your screen name</label>
          <input
            type="text"
            name="screenName"
            id="screenName"
            placeholder="Enter your screen name"
            className="w-full text-[1rem] border-2 border-slate-400 px-2 outline-none"
          />
        </div>
        <div className="w-full gap-6 flex items-center">
          <button
            type="submit"
            className="w-1/3 bg-cyan-600 border border-cyan-700/90 hover:bg-cyan-700 px-4 py-2 text-white"
          >
            Sign Up
          </button>
          <p className="text-sm text-slate-500">
            After clicking "Sign Up", you will automatically be logged in.
          </p>
        </div>
        <p className="flex items-center text-sm text-slate-500">
          Already have an account?{" "}
          <span className="text-blue-700 ml-1 hover:underline">
            <LoginModalForm />
          </span>
        </p>
      </form>
    </main>
  );
};

export default SignUpForm;
