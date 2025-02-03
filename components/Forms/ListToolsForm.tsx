import React from "react";

const ListToolsForm = () => {
  return (
    <main className="w-full mt-10 px-6">
      <header className="w-full border-b-[0.025rem] border-slate-300 py-2">
        <h1 className="text-slate-600 text-3xl font-semibold">
          Create a Listing
        </h1>
        <h2 className="text-xl text-slate-600">
          Please fill out the form below leaving no fields blank.
        </h2>
      </header>

      <form className="space-y-3 mt-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="listing-title">Listing Title</label>
          <input
            type="text"
            name="listing-title"
            id="listing-title"
            placeholder="Create a listing title"
            className="w-full text-[1rem] border-2 border-slate-400 px-2 outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="listing-description">Listing Description</label>
          <input
            type="listing-description"
            name="listing-description"
            id="listing-description"
            placeholder="Describe your listing"
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
            Publish Listing
          </button>
        </div>
        <p className="flex items-center text-sm text-slate-500">
          ** We will never share your personal information with anyone. **
        </p>
      </form>
    </main>
  );
};

export default ListToolsForm;
