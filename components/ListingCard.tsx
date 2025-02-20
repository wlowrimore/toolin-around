"use client";

import { Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ListingCardProps } from "@/types";
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
  createdAt,
  id: _id,
  title,
  description,
  image,
  category,
  author,
}) => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleListingClick = () => {
    router.push(`/listing/${_id}`);
  };

  const authorHandle = () => {
    if (author?.email) {
      const authorNameTag = author?.email?.split("@")[0].toLowerCase();
      return `@${authorNameTag}`;
    }
  };

  const truncateDesc = (text: string, maxLength = 25) => {
    if (!text) return "No description provided";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const truncateTitle = (text: string, maxLength = 25) => {
    if (!text) return "No title provided";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const truncatedDescription = truncateDesc(listing?.description || "");

  return (
    <Card
      onClick={handleListingClick}
      className="border-cyan-800 hover:shadow-md hover:shadow-cyan-900 rounded-none hover:bg-slate-300/30 cursor-pointer"
    >
      <CardHeader>
        <div className="w-full flex items-center pb-2">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className="h-6 w-6 text-amber-400 fill-amber-400"
            />
          ))}
          <span
            onClick={handleListingClick}
            className="w-full ml-2 text-end text-xs text-slate-400"
          >
            read the reviews
          </span>
        </div>
        <CardTitle>{truncateTitle(title || "")}</CardTitle>
        <CardDescription>{truncatedDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-52 max-h-52 overflow-hidden flex justify-center items-center bg-slate-700">
          <img
            src={image || ""}
            alt={title || ""}
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
          <div className="w-full flex ">
            {session ? (
              <div className="flex p-4 pt-0 gap-2 items-center">
                <div className="flex items-center justify-center gap-2 pb-2 pt-1">
                  <img
                    title={author?.name as string}
                    src={author?.image || ""}
                    alt={author?.name || ""}
                    width={1000}
                    height={1000}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col items-start text-xs text-slate-600 leading-tight">
                    <p className="font-semibold">{author?.name as string}</p>
                    <p className="font-normal">{authorHandle()}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="w-full text-center text-sm">Loading user data...</p>
            )}
          </div>
          <div className="w-full bg-slate-700 py-1 px-2">
            <p className="text-sm font-normal text-white">{category}</p>
          </div>
        </CardFooter>
      </Suspense>
    </Card>
  );
};

export default ListingCard;
