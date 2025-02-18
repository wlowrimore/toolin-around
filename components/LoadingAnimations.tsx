import { Loader } from "lucide-react";
import React from "react";

export function LoadingSpinner() {
  return <Loader className="animate-spin duration-1000 text-sky-600" />;
}

export function LoadingSpinnerWhite() {
  return <Loader className="animate-spin duration-1000 text-white" />;
}
