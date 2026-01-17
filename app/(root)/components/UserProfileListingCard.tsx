"use client";

import { Suspense, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserProfilePageProps } from "../user-profile/[id]/page";
import { formatDate } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/(root)/components/ui/card";
import Image from "next/image";
import { Star } from "lucide-react";
import Link from "next/link";
import DeleteButton from "./Mutations/DeleteButton";
import UpdateLinkButton from "./Mutations/UpdateLinkButton";
import AvailabilityButton from "./Mutations/AvailabilityButton";

interface ListingIdType {
  listingId: string;
}

interface UserProfileListingType {
  userListings: {
    _id: string;
    listingId: ListingIdType;
    title: string;
    description: string;
    image: string | null;
    category: string;
    condition: string;
    price: string;
    ratePeriod: string;
    author: {
      _id: string;
      name: string;
      image: string;
      email: string;
    };
    availability: boolean;
    slug: string;
    _createdAt: string;
    ratings: number;
    deleteToken: string;
    toolDetails: string;
    contact: string;
  }[];
}

const UserProfileListingCard: React.FC<UserProfileListingType> = ({
  userListings,
}) => {
  const listing = userListings[0];
  const {
    _id,
    listingId,
    availability,
    title,
    description,
    toolDetails,
    image,
    category,
    condition,
    price,
    ratePeriod,
    author,
    _createdAt,
  } = listing;
  const { data: session } = useSession();
  const router = useRouter();
  const [approvesDelete, setApprovesDelete] = useState<boolean>(false);

  useEffect(() => {
    router.refresh();
  }, []);

  const handleListingClick = () => {
    router.push(`/listing/${_id}`);
  };

  const userHandle = () => {
    if (session) {
      const nameTag = session?.user?.email?.split("@")[0].toLowerCase();
      return `@${nameTag}`;
    }
  };

  console.log("AVAILABILITY:", availability);

  const truncateDesc = (text: string, maxLength = 25) => {
    if (!text) return "No description provided";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const truncateTitle = (text: string, maxLength = 50) => {
    if (!text) return "No title provided";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const truncateDetails = (text: string, maxLength = 100) => {
    if (!text) return "No details provided";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const truncatedDescription = truncateDesc(description || "");

  return (
    <div>
      <div className="flex items-center text-xs mb-1 p-2 bg-slate-600 text-white gap-2">
        <UpdateLinkButton userListings={[listing]} />
        <DeleteButton userListings={[listing]} />
      </div>

      <Card
        // onClick={handleListingClick}
        className="border-cyan-800 rounded-none"
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
              className="w-full text-end text-xs text-slate-600"
            >
              read the reviews
            </span>
          </div>
          <CardTitle>{truncateTitle(title || "")}</CardTitle>
          <CardDescription>{truncatedDescription}</CardDescription>
        </CardHeader>
        <section className="pb-6 px-4">
          <div className="w-full flex justify-between">
            <div className="w-full overflow-hidden flex flex-col justify-center items-center bg-slate-700">
              {image ? (
                <img
                  src={image || ""}
                  alt={title || ""}
                  width={1000}
                  height={1000}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full text-slate-400 text-xl flex justify-center items-center">
                  No Image Available
                </div>
              )}
              {/* <p className="text-white tracking-wide text-[0.8rem] p-2">
                Listed {formatDate(_createdAt)}
              </p> */}
            </div>
            <div>
              <div className="pb-3">
                <h4 className="text-black tracking-wide text-[0.95rem] font-semibold px-4">
                  Tool Details
                </h4>
                {toolDetails ? (
                  <p className="text-black tracking-wide text-[0.8rem] ml-4">
                    {truncateDetails(toolDetails || "")}
                  </p>
                ) : (
                  <p className="text-white tracking-wide text-[0.8rem] p-2">
                    No tool details provided
                  </p>
                )}
              </div>
              <div className="pb-3">
                <p className="text-black tracking-wide text-[0.95rem] font-semibold px-4">
                  Date Listed
                </p>
                <p className="text-black tracking-wide text-[0.8rem] px-4">
                  {formatDate(_createdAt)}
                </p>
              </div>
              <div className="pb-3">
                <p className="text-black tracking-wide text-[0.95rem] font-semibold px-4">
                  Category
                </p>
                <p className="text-black tracking-wide text-[0.8rem] px-4">
                  {category}
                </p>
              </div>
              <div className="pb-3">
                <p className="text-black tracking-wide text-[0.95rem] font-semibold px-4">
                  Listed Condition
                </p>
                <p className="text-black tracking-wide text-[0.8rem] px-4">
                  {condition}
                </p>
              </div>
              <div className="">
                <p className="text-black tracking-wide text-[0.95rem] font-semibold px-4">
                  Availability
                </p>
                <div className="flex items-center text-[0.8rem] px-4">
                  <div
                    className={`${availability ? "bg-green-500" : "bg-red-500"} size-2 rounded-full`}
                  ></div>
                  <p className="px-1">
                    {availability ? "Available" : "Not Available"}
                  </p>
                  <p className="px-2">|</p>
                  <AvailabilityButton userListings={[listing]} />
                </div>
              </div>
            </div>
          </div>
        </section>
        <Suspense fallback={<div>Loading...</div>}>
          <CardFooter className="px-4 mb-4">
            {/* <AvailabilityButton userListings={[listing]} /> */}
            {/* <div className="w-full flex ">
              {session ? (
                <div className="flex w-full p-4 pt-0 gap-2 items-start">
                  <div className="flex flex-col w-full">
                    <div className="flex items-center gap-2 pb-2 pt-1">
                      {author?.image ? (
                        <Image
                          src={author?.image || ""}
                          alt={author?.name || ""}
                          width={1000}
                          height={1000}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-400 flex justify-center items-center">
                          No Image Available
                        </div>
                      )}
                      <div className="flex flex-col items-start text-xs text-slate-600 leading-tight">
                        <p className="font-semibold">
                          {author?.name as string}
                        </p>
                        <p className="font-normal">{userHandle()}</p>
                      </div>
                    </div>
                    {price && ratePeriod && (
                      <div className="w-full flex justify-between text-sm mt-1 font-semibold">
                        <p>Listed Price</p>
                        <p className="text-emerald-700">
                          ${price} / {ratePeriod}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="w-full text-center text-sm">
                  Loading user data...
                </p>
              )}
            </div> */}
            {/* <div className="w-full flex justify-between bg-slate-700 py-1 px-2">
              <p className="text-sm font-normal text-white">{category}</p>
              <p className="text-sm font-normal text-white">{condition}</p>
            </div> */}
          </CardFooter>
        </Suspense>
      </Card>
    </div>
  );
};

export default UserProfileListingCard;
