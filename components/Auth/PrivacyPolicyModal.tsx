import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Fade } from "react-awesome-reveal";
import Link from "next/link";
import GoogleButton from "./GoogleButton";
import SignUpForm from "./SignUpForm";
import { Sign } from "crypto";

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
              className="text-center text-xl font-semibold text-blue-500 cursor-pointer hover:underline transition-all duration-200"
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Privacy Policy</DialogTitle>
        </DialogHeader>
        <article className="font-normal">
          <div>
            By using this website, you agree to our{" "}
            <Link href="/terms-and-conditions">
              <span className="text-blue-700 hover:underline">
                Terms and Conditions
              </span>
            </Link>
            .
          </div>
        </article>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicyModal;
