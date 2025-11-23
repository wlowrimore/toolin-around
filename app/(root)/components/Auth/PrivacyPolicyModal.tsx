"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Fade } from "react-awesome-reveal";
import Link from "next/link";
import GoogleButton from "./GoogleButton";
import SignUpForm from "./SignUpForm";
import { Sign } from "crypto";
import PrivacyPolicyContent from "../PrivacyPolicyContent";
import { CircleCheck } from "lucide-react";

interface PrivacyPolicyModalProps {
  handlePolicyClick: () => void;
  isPolicyReviewed: boolean;
}

const PrivacyPolicyModal = ({
  handlePolicyClick,
  isPolicyReviewed,
}: PrivacyPolicyModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* <div className="max-w-7xl flex items-center justify-center mx-auto gap-1 text-lg duration-200"> */}
        {!isPolicyReviewed && (
          <div className="w-[60rem] flex justify-between items-center">
            <div className="w-1/4 bg-blue-500 h-[2px]"></div>
            <div
              onClick={() => handlePolicyClick()}
              className="text-center text-xl font-semibold text-blue-500 cursor-pointer hover:text-blue-700 transition-color duration-200"
            >
              <span className="w-full flex justify-center">
                Please Review Our Privacy Policy to Continue
              </span>
            </div>
            <div className="w-1/4 bg-blue-500 h-[2px]"></div>
          </div>
        )}
        {/* </div> */}
      </DialogTrigger>
      <div className="w-[70rem] flex justify-start">
        {isPolicyReviewed && (
          <div onClick={() => null}>
            <Fade triggerOnce duration={1000} cascade direction="up">
              <SignUpForm />
            </Fade>
          </div>
        )}
      </div>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <div className="flex flex-col bg-black text-white px-6 py-4 rounded-t-lg items-start justify-center">
            <DialogTitle>
              <span className="text-2xl font-semibold">Privacy Policy</span>
            </DialogTitle>
            <DialogDescription>
              <span className="text-sm text-white -mt-1">
                Last Updated: November 13, 2025
              </span>
            </DialogDescription>
          </div>
        </DialogHeader>
        {/* <section className="max-w-7xl"> */}
        <PrivacyPolicyContent />
        {/* <div>
            By using this website, you agree to our{" "}
            <Link href="/terms-and-conditions">
              <span className="text-blue-700 hover:underline">
                Terms and Conditions
              </span>
            </Link>
            .
          </div> */}
        {/* </section> */}
        <DialogClose className="absolute top-12 right-12 rounded-sm bg-black text-white border border-gray-400 focus:outline-none hover:bg-white hover:text-black transition-color duration-200">
          <span></span>
          <span className="w-full flex items-center gap-3 py-1 px-4">
            <CircleCheck size={20} className="text-green-400" />I Agree
          </span>
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicyModal;
