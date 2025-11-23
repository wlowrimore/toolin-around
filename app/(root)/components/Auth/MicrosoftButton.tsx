"use client";

import { signIn } from "next-auth/react";

const MicrosoftButton = ({ disabled }: { disabled?: boolean }) => {
  return (
    <button
      onClick={() =>
        signIn("microsoft-entra-id", { callbackUrl: "/all-listings" })
      }
      type="button"
      disabled={disabled}
      className={`${disabled ? "opacity-50 cursor-not-allowed hover:scale-100" : "hover:scale-105"} max-w-7xl flex items-center justify-center bg-white border border-neutral-300 rounded-md transition-scale duration-300`}
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <div className="w-6 h-6">
          <svg
            enableBackground="new 0 0 2499.6 2500"
            viewBox="0 0 2499.6 2500"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <path
              d="m1187.9 1187.9h-1187.9v-1187.9h1187.9z"
              fill="#f1511b"
            ></path>
            <path
              d="m2499.6 1187.9h-1188v-1187.9h1187.9v1187.9z"
              fill="#80cc28"
            ></path>
            <path
              d="m1187.9 2500h-1187.9v-1187.9h1187.9z"
              fill="#00adef"
            ></path>
            <path
              d="m2499.6 2500h-1188v-1187.9h1187.9v1187.9z"
              fill="#fbbc09"
            ></path>
          </svg>
        </div>
        <span className="text-base text-black">Continue with Microsoft</span>
        <span style={{ display: "none" }} aria-hidden="true">
          Continue with Microsoft
        </span>
      </div>
    </button>
  );
};

export default MicrosoftButton;
