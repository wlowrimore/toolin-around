"use client";

import { useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useFeatured } from "@/contexts/FeaturedContext";
import { ListingCardProps } from "@/types";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { Star } from "lucide-react";
import FeaturedBadge from "./feature-signup/FeaturedBadge";
import Link from "next/link";
import ConditionLegend from "./ConditionLegend";
import MessageModal from "./MessageModal";

// Add types for condition
type ConditionType = "New" | "Like New" | "Good" | "Fair" | "Poor" | "Other";

interface EnhancedListingCardProps extends ListingCardProps {
  onMessageSent?: () => void;
  author: {
    _id: string;
    name: string;
    email: string;
    image: string;
    isFeatured?: boolean;
    featuredSince?: string;
    featuredUntil?: string;
  };
}

const ListingDetailsCard: React.FC<EnhancedListingCardProps> = ({
  listing,
  author,
  createdAt,
  onMessageSent,
}) => {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isFeatured } = useFeatured();
  const isAuthorFeatured = author?.isFeatured || false;

  const authorHandle = () => {
    if (author?.email) {
      const authorNameTag = author?.email?.split("@")[0].toLowerCase();
      return `@${authorNameTag}`;
    }
  };

  const authorFirstName = author?.name?.split(" ")[0];

  const handleOpenModal = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    console.log("attempting to open modal");
    setIsModalOpen(true);
  };

  const getConditionColor = (
    condition: ConditionType | string | null,
  ): string => {
    switch (condition) {
      case "New":
        return "bg-sky-500 text-white font-semibold px-4 rounded-2xl";
      case "Like New":
        return "bg-green-500 text-black text-sm px-4 rounded-2xl";
      case "Good":
        return "bg-purple-700 text-white px-4 rounded-2xl";
      case "Fair":
        return "bg-amber-500 text-black px-4 rounded-2xl";
      case "Poor":
        return "bg-red-500 text-white px-4 rounded-2xl";
      case "Other":
        return "bg-gray-500 text-white px-4 rounded-2xl";
      default:
        return "bg-gray-500 text-white px-4 rounded-2xl";
    }
  };

  const handleMessageSent = () => {
    if (onMessageSent) {
      onMessageSent();
    }
  };

  return (
    <>
      <section className="flex gap-6">
        <div className="flex flex-col bg-black/20 gap-6">
          <div className="flex flex-col justify-between mx-2">
            <div className="w-full h-auto flex mx-auto items-center justify-between my-3">
              <div className="flex bg-black/70 px-1.5 py-0.5 rounded-2xl">
                <Star className="size-4 text-amber-200 fill-amber-200 stroke-1 stroke-amber-700" />
                <Star className="size-4 text-amber-200 fill-amber-200 stroke-1 stroke-amber-700" />
                <Star className="size-4 text-amber-200 fill-amber-200 stroke-1 stroke-amber-700" />
                <Star className="size-4 text-amber-200 fill-amber-200 stroke-1 stroke-amber-700" />
                <Star className="size-4 text-amber-200 fill-amber-200 stroke-1 stroke-amber-700" />
              </div>

              {listing?.price && listing?.ratePeriod ? (
                <div className="text-slate-900 bg-cyan-200/80 px-2 py-1 font-semibold tracking-wide text-xs">
                  ${listing?.price} / {listing?.ratePeriod}
                </div>
              ) : (
                <div className="text-slate-500 text-xs">
                  Price not available
                </div>
              )}
            </div>
            {author?.image && author?.name ? (
              <div className="w-[12rem] flex gap-2 items-center">
                <Image
                  src={author?.image as string}
                  alt={author?.name as string}
                  width={500}
                  height={500}
                  className="size-12 rounded-full object-cover"
                />
                <div className="flex flex-col items-start text-sm text-black/80 leading-tight">
                  <p className="font-semibold">{author?.name as string}</p>
                  <p className="font-normal">{authorHandle()}</p>
                </div>
              </div>
            ) : (
              <p className="w-full text-center text-sm">Loading user data...</p>
            )}
          </div>
          <ConditionLegend />
          <Suspense fallback={<div>Loading...</div>}>
            <aside className="flex flex-col mx-2 gap-6">
              <div className="w-full flex flex-col bg-black/80 py-3 px-2 gap-2">
                <p className="text-sm font-normal text-white">
                  category: &nbsp;&nbsp;{listing?.category}
                </p>

                <div className="w-full gap-2 flex">
                  <span className="text-white text-sm font-normal">
                    condition:
                  </span>
                  <h2 className={getConditionColor(listing?.condition)}>
                    {listing?.condition}
                  </h2>
                </div>
                <Link href={`/lister-profile/${author?._id}`}>
                  <p className="text-sm tracking-wider text-blue-300 hover:text-green-300 text-cente">
                    View all of {authorFirstName}&apos;s listings
                  </p>
                </Link>
              </div>
              {author && session && author._id !== session.user.id ? (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-base text-red-600 bg-white font-semibold px-2 py-2 hover:bg-black hover:text-white transition-colors duration-200"
                >
                  Message {authorFirstName}
                </button>
              ) : null}

              {isModalOpen ? (
                <MessageModal
                  authorFirstName={authorFirstName as string}
                  authorId={author?._id as string}
                  listingId={listing?._id}
                  sessionUserId={session?.user?.id}
                  isOpen={isModalOpen}
                  onOpenChange={(open) => setIsModalOpen(open)}
                  onMessageSent={handleMessageSent}
                />
              ) : null}
            </aside>
          </Suspense>
        </div>
        <main className="w-full max-h-[50rem]">
          <header className="">
            <h2 className="p-0 text-3xl font-serif font-semibold">
              {listing?.title}
            </h2>
          </header>
          <section className="relative">
            <span className="absolute bottom-3 right-24">
              {isAuthorFeatured && <FeaturedBadge />}
            </span>

            <div className="w-full overflow-hidden flex gap-6">
              <img
                src={listing?.image || ""}
                alt={listing?.title || ""}
                width={1000}
                height={1000}
                className="w-full max-h-[28rem] object-cover"
                loading="lazy"
              />
              <article className="text-black w-full">
                <div className="flex justify-center w-full">
                  <div className="max-w-[20rem] min-w-[20.5rem] text-base">
                    <div className="max-h-[22rem] overflow-y-auto pr-2 pb-1">
                      <p className="">{listing?.toolDetails}</p>
                    </div>
                  </div>
                </div>
              </article>
            </div>
            <hr className="" />
            <p className="text-slate-800 tracking-wide text-[0.65rem]">
              Listed {formatDate(createdAt)}
            </p>
          </section>
        </main>
      </section>
    </>
  );
};

export default ListingDetailsCard;
