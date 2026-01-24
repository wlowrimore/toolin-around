"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useFeatured } from "@/contexts/FeaturedContext";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { UserCircle, MessageCircle, Gem, Eye } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/(root)/components/ui/tooltip";
import Link from "next/link";
import { SearchModal } from "../SearchModal";
import { useMessages } from "@/hooks/useMessages";

const Header = ({ query }: { query: string }) => {
  const { data: session } = useSession();
  const { unreadCount } = useMessages(session?.user?.id as string);

  const { isFeatured } = useFeatured();

  const path = usePathname();

  if (path === "/") {
    return null;
  }

  return (
    <div className="text-black/9">
      <div className="max-w-7xl text-center mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Navigation */}
          {session ? (
            <div className="w-full flex items-center justify-between text-lg mt-4">
              <Link href="/all-listings">
                <div className="flex items-center space-x-2 px-2 rounded-lg hover:bg-black/10">
                  <Image
                    src="/logos/ta-wht.png"
                    alt="Toolin' Around Logo"
                    width={100}
                    height={100}
                    className="w-10 h-10 rounded-md"
                  />
                  <div className="flex flex-col text-[1.3rem] font-semibold items-start space-y-[-0.7rem] tracking-wider">
                    <p>Toolin'</p>
                    <p>Around</p>
                  </div>
                </div>
              </Link>
              <Link href="/all-listings">
                <button
                  type="button"
                  className="flex items-center px-2 rounded-lg space-x-1 hover:bg-black/10"
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
                  className="flex items-center px-2 rounded-lg space-x-1 hover:bg-black/10"
                >
                  <Gem className="h-5 w-5" />
                  <span>Featured Listings</span>
                </button>
              </Link>
              <Link href="/messages">
                <button className="relative flex it px-2 rounded-lg items-center hover:bg-black/10">
                  <MessageCircle className="h-5 w-5 mr-1" />
                  {unreadCount > 0 && (
                    <span className="absolute z-60 top-0.5 animate-pulse duration-700 left-3 w-2 h-2 bg-green-300 rounded-full"></span>
                  )}
                  <span>Messages</span>
                </button>
              </Link>
              <Link href={`/user-profile/${session.user?.id}`}>
                <button className="flex items-center px-2 rounded-lg space-x-1 hover:bg-black/10">
                  <UserCircle className="h-5 w-5" />
                  <span>Profile</span>
                </button>
              </Link>
              <Link href="/list-tools">
                <button
                  type="button"
                  className="bg-red-600/40 hover:bg-red-600/50 text-black px-3 py-1 rounded-lg"
                >
                  List Tools
                </button>
              </Link>
              {session ? (
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger className="">
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
                    {isFeatured && (
                      <div className="absolute right-[19.5%] top-6 w-fit">
                        <Gem className="size-4 fill-sky-500/60 text-black/40" />
                      </div>
                    )}
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
