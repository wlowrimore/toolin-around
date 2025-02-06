"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { Search, UserCircle, MessageCircle, Gem } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import LoginModalForm from "../Auth/LoginModalForm";

const Header = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSignIn = () => {
    setIsOpen(true);
  };

  return (
    <div className="bg-sky-900 text-slate-400">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link href="/">
            <div className="flex items-center space-x-2">
              <Image
                src="/logos/headerLogo.png"
                alt="Tooling Around Logo"
                width={1000}
                height={1000}
                className="w-24 h-auto"
              />
            </div>
          </Link>

          {/* Navigation */}
          {session ? (
            <div className="flex items-center space-x-8 text-lg">
              <Link href="/all-listings">
                <button
                  type="button"
                  className="flex items-center space-x-1 hover:text-blue-200"
                >
                  <Search className="h-5 w-5" />
                  <span>Find Tools</span>
                </button>
              </Link>
              <Link href="/featured-listings">
                <button
                  type="button"
                  className="flex items-center space-x-1 hover:text-blue-200"
                >
                  <Gem className="h-5 w-5" />
                  <span>Featured Listings</span>
                </button>
              </Link>
              <button className="flex items-center hover:text-blue-200">
                <MessageCircle className="h-5 w-5 -mr-1" />
                <span className="relative z-20 bottom-2 right-1 w-2 h-2 bg-green-300 rounded-full"></span>
                <span>Messages</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-blue-200">
                <UserCircle className="h-5 w-5" />
                <span>Profile</span>
              </button>
              <Link href="/list-tools">
                <button
                  type="button"
                  className="bg-white/70 text-slate-700 px-4 py-2 hover:bg-blue-50"
                >
                  List Tools
                </button>
              </Link>
              {session ? (
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger className="absolute right-[11.5rem] ">
                      <div className="bg-transparent p-1 border-[0.5px] border-zinc-300 rounded-full">
                        <Image
                          src={session.user?.image! as string}
                          alt={session.user?.name! as string}
                          width={1000}
                          height={1000}
                          className="w-12 h-12 rounded-full"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <button
                        className="hover:text-cyan-500"
                        onClick={() => signOut({ callbackUrl: "/" })}
                      >
                        Sign Out
                      </button>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col w-[95%] ml-10">
              <div className=" flex text-base text-white tracking-wide">
                <p className="w-full tracking-wide leading-tight">
                  To get started searching for and listing tools, please take a
                  moment to read our&nbsp;
                  <Link href="/" className="text-blue-300 hover:underline">
                    privacy policy
                  </Link>
                  &nbsp;and sign up using the form below if
                </p>
              </div>
              <div className=" flex text-base text-white tracking-wide">
                <p className="flex">
                  you do not have an account with us. If you already have an
                  account with us, please&nbsp;
                  <span className="text-blue-300 hover:underline">
                    <LoginModalForm />
                  </span>
                  .
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* {isOpen && <LoginModalForm />} */}
    </div>
  );
};

export default Header;
