"use client";

import React from "react";
import { ToolSelectionForm } from "./ToolSelectionForm";
import { Checkbox } from "../ui/checkbox";
import { ToolConditionForm } from "./ToolConditionForm";

const ListToolsForm = () => {
  return (
    <main className="w-full my-10 px-6">
      <header className="w-full border-b-[0.025rem] border-slate-300 py-2">
        <h1 className="text-slate-600 text-3xl font-semibold">
          Create a Listing
        </h1>
        <h2 className="text-xl text-slate-600">
          Please fill out the form below leaving no fields blank.
        </h2>
      </header>

      <form className="grid grid-cols-2 mt-4 gap-8">
        <div className="space-y-5">
          <div className="flex flex-col gap-1">
            <label htmlFor="listing-title">Listing Title</label>
            <input
              type="text"
              name="listing-title"
              id="listing-title"
              placeholder="Listing Title"
              className="w-full h-[2.25rem] text-[1rem] border-2 border-slate-400 px-2 outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="listing-description">Listing Keywords</label>
            <textarea
              name="listing-description"
              id="listing-description"
              placeholder="Use keywords to help users find your listing"
              className="w-full text-[1rem] border-2 border-slate-400 px-2 outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="tool-type">Tool Type</label>
            <ToolSelectionForm value="" onChange={() => {}} />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="tool-condition">Tool Condition</label>
            <ToolConditionForm value="" onChange={() => {}} />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="tool-details">Tool Details</label>
            <textarea
              rows={6}
              name="tool-details"
              id="tool-details"
              placeholder="Brief description of your tools and lending terms"
              className="w-full text-[1rem] border-2 border-slate-400 px-2 outline-none"
            />
          </div>
        </div>
        <div className="space-y-5">
          <div className="flex flex-col gap-1 pb-[2.3rem]">
            <label htmlFor="rental-price">Rental Fee</label>
            <div className="flex items-center">
              <label htmlFor="rental-price">$</label>
              <input
                type="text"
                name="rental-price"
                id="rental-price"
                // placeholder="Confirm your password"
                className="w-1/4 text-[1rem] border-b-2 border-slate-400 px-2 outline-none mr-6"
              />
              <div className="items-center mb-[-0.7rem] flex space-x-2">
                <p>rate per:</p>

                <Checkbox id="hour" />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="hour"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Hour
                  </label>
                </div>
                <Checkbox id="day" />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="day"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Day
                  </label>
                </div>
                <Checkbox id="week" />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="week"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Week
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full  cursor-pointer bg-cyan-600 border border-cyan-700/90 hover:bg-cyan-700 px-4 py-[3.3rem] text-white">
            <input
              multiple
              accept="image/*"
              type="file"
              name="listing-image"
              id="listing-image"
              className="hidden"
            />
            <label
              htmlFor="listing-image"
              className="cursor-pointer text-xl flex justify-center"
            >
              Upload Images
            </label>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="contact-email">Contact Email</label>
            <input
              type="email"
              name="contact-email"
              id="contact-email"
              placeholder="Email address for contact"
              className="w-full h-[2.25rem] text-[1rem] border-2 border-slate-400 px-2 outline-none"
            />
            <p className="flex items-center text-sm text-slate-500 border-b border-slate-400 pb-6">
              ** We will never share your personal information with anyone. **
            </p>
          </div>
        </div>
      </form>
      <div className="w-full gap-6 flex items-center mt-6">
        <button
          type="submit"
          className="w-full bg-cyan-600 border border-cyan-700/90 hover:bg-cyan-700 px-4 py-2 text-white"
        >
          Publish Listing
        </button>
      </div>
    </main>
  );
};

export default ListToolsForm;
