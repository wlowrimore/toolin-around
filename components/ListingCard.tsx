"use client";

import { useSession } from "next-auth/react";

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

const ListingCard = () => {
  const { data: session } = useSession();

  const userHandle = () => {
    if (session) {
      const nameTag = session?.user?.email?.split("@")[0].toLowerCase();
      return `@${nameTag}`;
    }
  };

  return (
    <Card className="border-slate-800 rounded-none">
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
        <CardTitle>Lender&apos;s Name</CardTitle>
        <CardDescription>
          A short description truncated at 50 characters with ...read more
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full max-h-64 overflow-hidden flex justify-center items-center">
          <Image
            src="/logos/toolinAround.png"
            alt="Tooling Around Logo"
            width={1000}
            height={1000}
            className="w-auto h-auto object-cover"
          />
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex justify-between items-center">
          {session ? (
            <div className="flex gap-2 items-center">
              <Image
                src={session?.user?.image as string}
                alt={session?.user?.name as string}
                width={1000}
                height={1000}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col items-start text-xs text-slate-600 leading-tight">
                <p className="font-semibold">{session?.user?.name as string}</p>
                <p className="font-normal">{userHandle()}</p>
              </div>
            </div>
          ) : (
            <p>No user info available</p>
          )}
          <div className="bg-slate-700 py-1 px-2">
            <p className="text-xs font-normal text-white">Category</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ListingCard;
