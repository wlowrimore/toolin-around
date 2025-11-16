"use client";

import { useState } from "react";
import Link from "next/link";
import { Checkbox } from "../ui/checkbox";
import GoogleButton from "./GoogleButton";
import MicrosoftButton from "./MicrosoftButton";

const SignUpForm = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckedChange = (checked: boolean | "indeterminate") => {
    setIsChecked(checked === true);
    console.log("Checked:", checked);
  };

  return (
    <main className="max-w-7xl flex flex-col bg-slate-300/50 border border-black/50 rounded-md py-4 px-6">
      <div className="pb-4">
        <h1 className="font-semibold mb-2">Choose your Sign In Method</h1>
        <div className="px-3 pb-3">
          <ul className="list-disc text-sm pl-2 mb-2">
            <li>Either option is safe and highly secure.</li>
            <li>Your personal information is never shared.</li>
          </ul>
        </div>
        <div className="w-full flex flex-col gap-2 pb-3">
          <div className="flex items-center">
            <Checkbox
              id="terms"
              className="size-3 mr-1.5"
              checked={isChecked}
              onCheckedChange={handleCheckedChange}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I Have Read and Agree to the
              <Link href="/terms-and-conditions">
                &nbsp;
                <span className="text-blue-700 hover:underline">
                  Terms and Conditions
                </span>
              </Link>
            </label>
          </div>
        </div>
      </div>
      <div className="w-full flex gap-12">
        <GoogleButton disabled={!isChecked} />
        <MicrosoftButton disabled={!isChecked} />
      </div>
    </main>
  );
};

export default SignUpForm;
