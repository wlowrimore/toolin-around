"use client";

import { Suspense, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
import { LoadingBar } from "./LoadingAnimations";
import MessageModal from "./MessageModal";

// Define the exact structure from your Sanity query
interface SanityUser {
  _id: string;
  name: string;
  image: string;
  email: string;
}

interface SanityRating {
  _id: string;
  rating: number;
  review: string;
  createdAt: string;
  user: SanityUser;
}

interface SanityListing {
  _id: string;
  _type: "listing";
  title: string | null;
  slug: {
    current: string;
    _type?: string;
  } | null;
  _createdAt: string;
  author: SanityUser | null;
  description: string | null;
  category: string | null;
  image: string | null;
  condition: string | null;
  price: string | null;
  ratePeriod: string | null;
  contact: string | null;
  toolDetails: string | null;
  deleteToken?: string;
  ratings: SanityRating[];
  onMessageSent?: () => void;
}

// Simplified interface to accept any data structure
interface ListerProfileListingType {
  listings: any[]; // Accept any array initially
  listingId?: string | null;
  onMessageSent?: () => void;
}

const ListerProfileListingCard: React.FC<ListerProfileListingType> = ({
  listings,
  listingId,
  onMessageSent,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  const handleListingClick = (id: string) => {
    router.push(`/listing/${id}`);
  };

  const userHandle = () => {
    if (session?.user?.email) {
      const nameTag = listings[0].author?.email.split("@")[0].toLowerCase();
      return `@${nameTag}`;
    }
    return "";
  };

  const handleMessageSent = () => {
    if (onMessageSent) {
      onMessageSent();
    }
  };

  const truncateDesc = (text: string | null, maxLength = 25) => {
    if (!text) return "No description provided";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const truncateDetails = (text: string | null, maxLength = 100) => {
    if (!text) return "No details provided";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const truncateTitle = (text: string | null, maxLength = 25) => {
    if (!text) return "No title provided";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const listersFirstName = listings?.[0]?.author.name.split(" ")[0];

  // Safely cast listings to the proper type
  const typedListings = listings as SanityListing[];

  return (
    <div className="w-full">
      {typedListings && typedListings.length > 0 ? (
        <div className="w-full space-y-6">
          {typedListings.map((listing) => (
            <div key={listing._id} className="w-full">
              <Card
                onClick={() => handleListingClick(listing._id)}
                className="relative w-full border-transparent hover:shadow-md hover:shadow-cyan-900 rounded-none cursor-pointer transition-all duration-300"
              >
                <CardContent>
                  <div className="w-full flex h-96 max-h-96 overflow-hidden items-center bg-sky-950/90">
                    <div className="w-1/2 h-full p-6 border-r-[3px] border-slate-400">
                      <div className="flex flex-col space-y-2">
                        <div className="w-full flex items-center">
                          {[...Array(5)].map((_, index) => (
                            <Star
                              key={index}
                              className="h-6 w-6 flex text-amber-400 fill-amber-400"
                            />
                          ))}
                        </div>
                        <div className="flex flex-col text-white text-xl  h-[40rem] min-h-[40rem]">
                          <CardTitle>{truncateTitle(listing?.title)}</CardTitle>
                          <CardDescription>
                            <span className="italic text-slate-300 text-sm">
                              {listing?.description}
                            </span>
                          </CardDescription>
                          <div className="w-full flex">
                            {session ? (
                              <div className="flex w-full pt-3 gap-2 items-start">
                                <div className="flex flex-col w-full">
                                  <div className="relative flex gap-2 pb-2 pt-4">
                                    {listing.author?.image ? (
                                      <Image
                                        src={listing.author.image}
                                        alt={listing.author?.name || ""}
                                        width={1000}
                                        height={1000}
                                        className="w-24 h-24 object-cover border-2 border-slate-200"
                                      />
                                    ) : (
                                      <div className="w-10 h-10 rounded-full bg-slate-400 flex justify-center items-center">
                                        No Image Available
                                      </div>
                                    )}
                                    <div className="flex flex-col items-start text-xs text-slate-200 leading-tight tracking-wide">
                                      <p className="font-semibold text-3xl ml-4">
                                        {listersFirstName || "Unknown"}
                                      </p>
                                      <p className="font-normal text-slate-200 text-sm tracking-wide ml-4">
                                        {userHandle()}
                                      </p>
                                      {listing?.author &&
                                      session &&
                                      listing?.author._id !==
                                        session.user.id ? (
                                        <button
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setIsModalOpen(true);
                                          }}
                                          className="relative left-4 top-3 z-100 bg-slate-950/70 text-xs text-white font-semibold px-1 py-1 hover:bg-white/70 hover:text-slate-950"
                                        >
                                          <span className="flex items-center mx-auto">
                                            Message {listersFirstName}
                                          </span>
                                        </button>
                                      ) : null}
                                      {isModalOpen ? (
                                        <MessageModal
                                          authorFirstName={
                                            listersFirstName as string
                                          }
                                          authorId={
                                            listing?.author?._id as string
                                          }
                                          listingId={listing?._id}
                                          sessionUserId={session?.user?.id}
                                          isOpen={isModalOpen}
                                          onOpenChange={(open) =>
                                            setIsModalOpen(open)
                                          }
                                          onMessageSent={handleMessageSent}
                                        />
                                      ) : null}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <p className="w-full text-center text-sm">
                                Loading user data...
                              </p>
                            )}
                          </div>
                          <div className="mt-5 space-y-6">
                            <p className="text-sm font-semibold text-white">
                              {truncateDetails(listing?.toolDetails)}
                            </p>
                            <p className="text-sm font-normal text-white/70 uppercase">
                              <span className="h-full border border-white/50 bg-cyan-800/40 py-1 px-2">
                                {listing.category || "Uncategorized"}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {listing?.image ? (
                      <div className="w-full">
                        <img
                          src={listing?.image || ""}
                          alt={listing?.title || ""}
                          width={1000}
                          height={1000}
                          className="w-full  h-full object-cover"
                          loading="lazy"
                        />

                        <p className="absolute w-[63.5%] pl-1.5 bottom-4 left-[35%] bg-gray-900 text-slate-100 tracking-wide text-[0.7rem]">
                          Listed on {formatDate(listing._createdAt)} in{" "}
                          {listing?.condition} condition at ${listing.price} per{" "}
                          {listing.ratePeriod}
                        </p>
                      </div>
                    ) : (
                      <div className="w-full h-full text-slate-400 text-xl flex justify-center items-center">
                        No Image Available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full flex justify-center items-center">
          <p className="text-slate-400">No listings found</p>
        </div>
      )}
    </div>
  );
};

export default ListerProfileListingCard;
