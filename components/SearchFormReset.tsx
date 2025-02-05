"use client";

import Link from "next/link";
import { X } from "lucide-react";

const SearchFormReset = () => {
  const reset = () => {
    const form = document.getElementById("search-form") as HTMLFormElement;

    if (form) form.reset();
  };
  return (
    <button type="reset" onClick={reset} title="Reset" aria-label="Reset">
      <Link href="/all-listings" className="text-slate-800">
        <X className="size-8 p-1.5 text-white bg-slate-600 border border-slate-900" />
      </Link>
    </button>
  );
};

export default SearchFormReset;
