"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { Search, UserCircle, MessageCircle, Gem, X, Eye } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import LoginModalForm from "../Auth/PrivacyPolicyModal";
import { SearchModal } from "../SearchModal";
import { useMessages } from "@/hooks/useMessages";

const Header = ({ query }: { query: string }) => {
  const { data: session } = useSession();
  const { unreadCount } = useMessages(session?.user?.id as string);

  return (
    <div className="text-slate-400">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link href="/">
            <div className="flex items-center space-x-2">
              {/* <Image
                src="/logos/headerLogo.png"
                alt="Tooling Around Logo"
                width={1000}
                height={1000}
                className="w-24 h-auto"
              /> */}
              {/* <h1 className="font-bold text-2xl">Toolin' Around</h1> */}
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
                  <Eye className="h-5 w-5" />
                  <span>All Listings</span>
                </button>
              </Link>
              <div>
                <SearchModal query={query} />
              </div>
              <Link href="/featured-listings">
                <button
                  type="button"
                  className="flex items-center space-x-1 hover:text-blue-200"
                >
                  <Gem className="h-5 w-5" />
                  <span>Featured Listings</span>
                </button>
              </Link>
              <Link href="/messages">
                <button className="relative flex items-center hover:text-blue-200">
                  <MessageCircle className="h-5 w-5 mr-1" />
                  {unreadCount > 0 && (
                    <span className="absolute z-60 top-0.5 animate-pulse duration-700 left-3 w-2 h-2 bg-green-300 rounded-full"></span>
                  )}
                  <span>Messages</span>
                </button>
              </Link>
              <Link href={`/user-profile/${session.user?.id}`}>
                <button className="flex items-center space-x-1 hover:text-blue-200">
                  <UserCircle className="h-5 w-5" />
                  <span>Profile</span>
                </button>
              </Link>
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
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Header;
