"use client";

import { Suspense } from "react";
import { useSession } from "next-auth/react";
import { ListingType, ListingCardProps } from "@/types";
import { formatDate } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Star } from "lucide-react";
import Link from "next/link";

const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  currentUser,
  createdAt,
}) => {
  const { data: session } = useSession();

  const userHandle = () => {
    if (session) {
      const nameTag = session?.user?.email?.split("@")[0].toLowerCase();
      return `@${nameTag}`;
    }
  };

  const truncateDesc = (text: string, maxLength = 25) => {
    if (!text) return "No description provided";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const truncatedDescription = truncateDesc(listing?.description || "");

  return (
    <Link
      href={`/listings/${listing?._id}`}
      className="hover:shadow-[0_0_20px_0_rgba(0,0,0,0.1)] hover:shadow-cyan-800"
    >
      <Card className="border-slate-800 rounded-none hover:bg-blue-300/10">
        <CardHeader>
          <div className="w-full h-auto flex items-center pb-2">
            <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
            <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
            <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
            <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
            <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
            <span className="w-full ml-2 text-end text-xs text-slate-400">
              read the reviews
            </span>
          </div>
          <CardTitle>{listing?.title}</CardTitle>
          <CardDescription>{truncatedDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full max-h-64 overflow-hidden flex justify-center items-center bg-slate-700">
            <img
              src={listing?.image || ""}
              alt={listing?.title || ""}
              width={1000}
              height={1000}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <p className="text-slate-800 tracking-wide text-[0.65rem]">
            Listed {formatDate(createdAt)}
          </p>
        </CardContent>
        <Suspense fallback={<div>Loading...</div>}>
          <CardFooter className="flex flex-col">
            <div className="w-full flex justify-between items-end min-h-[2rem] max-h-[2rem]">
              {session ? (
                <div className="flex px-4 gap-2 items-center">
                  <img
                    src={session?.user?.image || ""}
                    alt={session?.user?.name || ""}
                    width={1000}
                    height={1000}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col items-start text-xs text-slate-600 leading-tight">
                    <p className="font-semibold">
                      {session?.user?.name as string}
                    </p>
                    <p className="font-normal">{userHandle()}</p>
                  </div>
                </div>
              ) : (
                <p className="w-full text-center text-sm">
                  Loading user data...
                </p>
              )}
            </div>
            <div className="w-full bg-slate-700 py-1 px-2 mt-6">
              <p className="text-sm font-normal text-white">
                {listing?.category}
              </p>
            </div>
          </CardFooter>
        </Suspense>
      </Card>
    </Link>
  );
};

export default ListingCard;
