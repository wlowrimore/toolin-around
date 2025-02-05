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
import Link from "next/link";
import GoogleButton from "./GoogleButton";

const LoginModalForm = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1">login</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome Back!</DialogTitle>
          <DialogDescription>
            Get logged in to list or search for tools.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="loginEmail">Email</Label>
            <Input
              id="loginEmail"
              type="email"
              placeholder="example@email.com"
              className="col-span-3"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="loginPassword">Password</Label>
            <Input id="loginPassword" type="password" className="col-span-3" />
          </div>

          <DialogFooter>
            <div className="w-full flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I Accept the
                  <Link href="/terms-and-conditions">
                    &nbsp;
                    <span className="text-blue-700 hover:underline">
                      Terms and Conditions
                    </span>
                  </Link>
                </label>
              </div>
              <button
                type="submit"
                className="w-full text-white px-4 py-2 border border-cyan-700/90 bg-cyan-600 hover:bg-cyan-700"
              >
                Submit
              </button>
              <div className="w-full flex items-center gap-2">
                <div className="w-full h-[1px] bg-gray-300"></div>
                <div className="text-gray-500">or</div>
                <div className="w-full h-[1px] bg-gray-300"></div>
              </div>
              <GoogleButton />
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModalForm;
