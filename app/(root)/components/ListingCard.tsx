"use client";

import { Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useFeatured } from "@/contexts/FeaturedContext";
import FeaturedBadge from "./feature-signup/FeaturedBadge";
import { ListingCardProps } from "@/types";
import { formatMonth, formatDay, formatYear } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/(root)/components/ui/card";
import Image from "next/image";
import { Star } from "lucide-react";

const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  createdAt,
  id: _id,
  title,
  image,
  category,
  author,
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { isFeatured } = useFeatured();
  const isAuthorFeatured = author?.isFeatured;

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
    <>
      <Card
        onClick={handleListingClick}
        className="hover:shadow-md hover:shadow-cyan-900 hover:bg-red-400/20 cursor-pointer rounded-lg"
      >
        {isAuthorFeatured && <FeaturedBadge />}
        <CardHeader>
          <div className="w-full flex items-center">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className="size-3 stroke-1 stroke-amber-700 text-amber-400 fill-amber-400"
              />
            ))}
          </div>

          <CardTitle>{truncateTitle(title || "")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 overflow-hidden flex justify-center items-center bg-slate-700">
            <img
              src={image || ""}
              alt={title || ""}
              width={1000}
              height={1000}
              className=""
              loading="lazy"
            />
          </div>
          <div className="font-serif flex px-6 justify-center">
            <div className="space-y-[-0.5rem]">
              <p className="text-lg font-semibold pr-6">Listing</p>
              <p className="text-xl font-semibold pr-6">Added</p>
            </div>
            <div className="flex flex-col space-y-[-1rem]">
              <div className="flex items-center gap-2 text-slate-800 tracking-wide text-[0.65rem]">
                <p className="text-4xl font-bold">{formatMonth(createdAt)}</p>
                <p className="text-4xl font-bold">{formatDay(createdAt)}</p>
              </div>
              <p className="text-[2.95rem] font-bold">
                {formatYear(createdAt)}
              </p>
            </div>
          </div>
        </CardContent>
        <Suspense fallback={<div>Loading...</div>}>
          <CardFooter className="w-full flex flex-col">
            <div className="w-full flex">
              {session ? (
                <div className="w-full flex p-4 pt-0 gap-2 items-center">
                  <div className="w-full flex items-center justify-center gap-2">
                    <Image
                      title={author?.name as string}
                      src={author?.image || ""}
                      alt={author?.name || ""}
                      width={1000}
                      height={1000}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col w-full text-xs text-slate-600 leading-tight">
                      <p className="font-semibold">{author?.name as string}</p>
                      <p className="font-normal">{authorHandle()}</p>
                    </div>
                    <p className="w-full pl-9 text-sm font-normal text-black">
                      Category -{" "}
                      <span className="p-2 bg-red-500/70 rounded-md">
                        {category}
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                <p className="w-full text-center text-sm">
                  Loading user data...
                </p>
              )}
            </div>
          </CardFooter>
        </Suspense>
      </Card>
    </>
  );
};

export default ListingCard;
