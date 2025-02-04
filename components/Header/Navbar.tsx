"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { Search, UserCircle, MessageCircle } from "lucide-react";
import { SearchModal } from "../SearchModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

const Header = () => {
  const { data: session } = useSession();
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
          <div className="flex items-center space-x-8 text-xl">
            <SearchModal />
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
        </div>
      </div>
    </div>
  );
};

export default Header;
