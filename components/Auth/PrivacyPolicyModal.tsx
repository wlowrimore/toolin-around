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
        <div className="flex items-center gap-1 text-lg underline hover:text-blue-500 cursor-pointer transition-colors duration-200">
          {!isPolicyReviewed ? (
            <span onClick={() => handlePolicyClick()} className="">
              Please Review Our Privacy Policy to Continue
            </span>
          ) : (
            <Fade duration={1000} cascade direction="up" className="">
              <SignUpForm />
            </Fade>
          )}
        </div>
      </DialogTrigger>
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
