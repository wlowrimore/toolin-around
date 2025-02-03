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

      <form className="grid grid-cols-2 space-y-5 mt-4">
        <div>
          <div className="flex flex-col gap-1">
            <label htmlFor="listing-title">Listing Title</label>
            <input
              type="text"
              name="listing-title"
              id="listing-title"
              placeholder="Listing Title"
              className="w-full text-[1rem] border-2 border-slate-400 px-2 outline-none"
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
        </div>
        <div>
          <div className="flex flex-col gap-1">
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
          <div className="w-1/3 cursor-pointer bg-cyan-600 border border-cyan-700/90 hover:bg-cyan-700 px-4 py-2 text-white">
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
              className="cursor-pointer flex justify-center"
            >
              Upload Images
            </label>
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
          <div className="flex flex-col gap-1">
            <label htmlFor="contact-email">Contact Email</label>
            <input
              type="email"
              name="contact-email"
              id="contact-email"
              placeholder="Email address for contact"
              className="w-full text-[1rem] border-2 border-slate-400 px-2 outline-none"
            />
          </div>
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
