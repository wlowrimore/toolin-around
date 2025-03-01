// "use client";

// import { useState } from "react";
// import { Suspense } from "react";
// import { useSession } from "next-auth/react";
// import { ListingType, ListingCardProps } from "@/types";
// import { formatDate } from "@/lib/utils";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import Image from "next/image";
// import { Quote, Star } from "lucide-react";
// import Link from "next/link";
// import ConditionLegend from "./ConditionLegend";
// import MessageModal from "./MessageModal";

// const ListingDetailsCard: React.FC<ListingCardProps> = ({
//   listing,
//   author,
//   currentUser,
//   createdAt,
// }) => {
//   const { data: session } = useSession();
//   const [conditionTextColor, setConditionTextColor] = useState();

//   const authorHandle = () => {
//     if (author?.email) {
//       const authorNameTag = author?.email?.split("@")[0].toLowerCase();
//       return `@${authorNameTag}`;
//     }
//   };

//   const authorFirstName = author?.name?.split(" ")[0];

//   type ConditionType = "New" | "Like New" | "Good" | "Fair" | "Poor" | "Other";

//   const getConditionColor = (
//     condition: ConditionType | string | null
//   ): string => {
//     switch (condition) {
//       case "New":
//         return "bg-sky-600 text-cyan-800 py-0.5 px-1.5 border border-sky-600"; // Bright green for new items
//       case "Like New":
//         return "bg-green-500 text-white py-0.5 px-1.5 border border-green-500"; // Green for almost new items
//       case "Good":
//         return "bg-purple-700 text-white py-0.5 px-1.5 border border-purple-700"; // Blue for good condition
//       case "Fair":
//         return "bg-amber-500 text-black py-0.5 px-1.5 border border-amber-500"; // Amber/orange for fair condition
//       case "Poor":
//         return "bg-red-500 text-white py-0.5 px-1.5 border border-red-500"; // Red for poor condition
//       case "Other":
//         return "bg-gray-500 text-white py-0.5 px-1.5 border border-gray-500"; // Gray for other/unspecified
//       default:
//         return "bg-gray-500 text-white py-0.5 px-1.5 border border-gray-500"; // Default fallback
//     }
//   };

//   return (
//     <>
//       <ConditionLegend />
//       <Card className="border-slate-800 rounded-none hover:bg-blue-300/10 w-full">
//         <CardHeader>
//           <div className="w-full h-auto flex justify-between pb-2">
//             <div className="flex w-fit">
//               <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
//               <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
//               <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
//               <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
//               <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
//               <span className="w-fit ml-2 flex flex-col items-end text-xs text-slate-950 px-2 py-1">
//                 read the reviews
//               </span>
//             </div>

//             {listing?.price && listing?.ratePeriod ? (
//               <div className="text-slate-900 bg-cyan-200/80 px-2 py-1 font-semibold tracking-wide text-xs">
//                 ${listing?.price} / {listing?.ratePeriod}
//               </div>
//             ) : (
//               <div className="text-white text-xs">Price not available</div>
//             )}
//           </div>
//           <CardTitle>{listing?.title}</CardTitle>
//           <CardDescription>{listing?.description}</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="w-full max-h-64 overflow-hidden flex items-center bg-slate-700">
//             <img
//               src={listing?.image || ""}
//               alt={listing?.title || ""}
//               width={1000}
//               height={1000}
//               className="max-w-[18rem] min-w-[18rem] w-full max-h-[24rem] min-h-[16rem] aspect-[2/1] object-cover"
//               loading="lazy"
//             />

//             <article className="text-white w-full">
//               <div className="flex justify-center w-full">
//                 <div className="max-w-[20rem] min-w-[20.5rem] text-sm">
//                   <Quote
//                     style={{ transform: "scaleX(-1)" }}
//                     className="fill-white/60 stroke-none -ml-10"
//                   />
//                   <div className="">
//                     <p className="">{listing?.toolDetails}</p>
//                   </div>
//                   <div className="flex w-full justify-end">
//                     <Quote className="fill-white/60 stroke-none -mr-6" />
//                   </div>
//                 </div>
//               </div>
//             </article>
//           </div>
//           <hr className="my-2" />
//           <p className="text-slate-800 tracking-wide text-[0.65rem]">
//             Listed {formatDate(createdAt)}
//           </p>
//         </CardContent>
//         <Suspense fallback={<div>Loading...</div>}>
//           <CardFooter className="flex flex-col">
//             <div className="w-full flex justify-between items-end py-3">
//               {author ? (
//                 <div className="w-full flex px-4 gap-2 items-center">
//                   <img
//                     src={author?.image || ""}
//                     alt={author?.name || ""}
//                     width={500}
//                     height={500}
//                     className="w-10 h-10 rounded-full object-cover"
//                   />
//                   <div className="flex flex-col items-start text-xs text-slate-600 leading-tight">
//                     <p className="font-semibold">{author?.name as string}</p>
//                     <p className="font-normal">{authorHandle()}</p>
//                   </div>
//                 </div>
//               ) : (
//                 <p className="w-full text-center text-sm">
//                   Loading user data...
//                 </p>
//               )}
//               <MessageModal authorFirstName={authorFirstName as string} />
//             </div>
//             <div className="w-full flex justify-between items-center bg-slate-700 py-1 px-2 mt-6">
//               <p className="text-sm font-normal text-white">
//                 {listing?.category}
//               </p>
//               <div className="w-[6rem] text-center">
//                 <h2 className={getConditionColor(listing?.condition)}>
//                   {listing?.condition}
//                 </h2>
//               </div>
//             </div>
//           </CardFooter>
//         </Suspense>
//       </Card>
//     </>
//   );
// };

// export default ListingDetailsCard;

"use client";

import { useState, Suspense } from "react";
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
import { Quote, Star } from "lucide-react";
import Link from "next/link";
import ConditionLegend from "./ConditionLegend";
import MessageModal from "./MessageModal";

// Add types for condition
type ConditionType = "New" | "Like New" | "Good" | "Fair" | "Poor" | "Other";

interface EnhancedListingCardProps extends ListingCardProps {
  onMessageSent?: () => void;
}

const ListingDetailsCard: React.FC<EnhancedListingCardProps> = ({
  listing,
  author,
  currentUser,
  createdAt,
  onMessageSent,
}) => {
  const { data: session } = useSession();
  const [conditionTextColor, setConditionTextColor] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const authorHandle = () => {
    if (author?.email) {
      const authorNameTag = author?.email?.split("@")[0].toLowerCase();
      return `@${authorNameTag}`;
    }
  };

  const authorFirstName = author?.name?.split(" ")[0];

  const handleOpenModal = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    console.log("attempting to open modal");
    setIsModalOpen(true);
  };

  const getConditionColor = (
    condition: ConditionType | string | null
  ): string => {
    switch (condition) {
      case "New":
        return "bg-sky-600 text-cyan-800 py-0.5 px-1.5 border border-sky-600";
      case "Like New":
        return "bg-green-500 text-white py-0.5 px-1.5 border border-green-500";
      case "Good":
        return "bg-purple-700 text-white py-0.5 px-1.5 border border-purple-700";
      case "Fair":
        return "bg-amber-500 text-black py-0.5 px-1.5 border border-amber-500";
      case "Poor":
        return "bg-red-500 text-white py-0.5 px-1.5 border border-red-500";
      case "Other":
        return "bg-gray-500 text-white py-0.5 px-1.5 border border-gray-500";
      default:
        return "bg-gray-500 text-white py-0.5 px-1.5 border border-gray-500";
    }
  };

  const handleMessageSent = () => {
    if (onMessageSent) {
      onMessageSent();
    }
  };

  return (
    <>
      <ConditionLegend />
      <Card className="border-slate-800 rounded-none hover:bg-blue-300/10 w-full">
        {/* CardHeader section remains the same */}
        <CardHeader>
          <div className="w-full h-auto flex justify-between pb-2">
            <div className="flex w-fit">
              <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
              <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
              <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
              <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
              <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
              <span className="w-fit ml-2 flex flex-col items-end text-xs text-slate-950 px-2 py-1">
                read the reviews
              </span>
            </div>

            {listing?.price && listing?.ratePeriod ? (
              <div className="text-slate-900 bg-cyan-200/80 px-2 py-1 font-semibold tracking-wide text-xs">
                ${listing?.price} / {listing?.ratePeriod}
              </div>
            ) : (
              <div className="text-white text-xs">Price not available</div>
            )}
          </div>
          <CardTitle>{listing?.title}</CardTitle>
          <CardDescription>{listing?.description}</CardDescription>
        </CardHeader>

        {/* CardContent section remains the same */}
        <CardContent>
          <div className="w-full max-h-64 overflow-hidden flex items-center bg-slate-700">
            <img
              src={listing?.image || ""}
              alt={listing?.title || ""}
              width={1000}
              height={1000}
              className="max-w-[18rem] min-w-[18rem] w-full max-h-[24rem] min-h-[16rem] aspect-[2/1] object-cover"
              loading="lazy"
            />

            <article className="text-white w-full">
              <div className="flex justify-center w-full">
                <div className="max-w-[20rem] min-w-[20.5rem] text-sm">
                  <Quote
                    style={{ transform: "scaleX(-1)" }}
                    className="fill-white/60 stroke-none -ml-10"
                  />
                  <div className="">
                    <p className="">{listing?.toolDetails}</p>
                  </div>
                  <div className="flex w-full justify-end">
                    <Quote className="fill-white/60 stroke-none -mr-6" />
                  </div>
                </div>
              </div>
            </article>
          </div>
          <hr className="my-2" />
          <p className="text-slate-800 tracking-wide text-[0.65rem]">
            Listed {formatDate(createdAt)}
          </p>
        </CardContent>

        {/* Updated CardFooter with enhanced MessageModal */}
        <Suspense fallback={<div>Loading...</div>}>
          <CardFooter className="flex flex-col">
            <div className="relative w-full flex justify-between items-end py-3">
              {author ? (
                <div className="w-full flex px-4 gap-2 items-center">
                  <img
                    src={author?.image || ""}
                    alt={author?.name || ""}
                    width={500}
                    height={500}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col items-start text-xs text-slate-600 leading-tight">
                    <p className="font-semibold">{author?.name as string}</p>
                    <p className="font-normal">{authorHandle()}</p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="absolute right-6 top-3 text-xs text-slate-600 font-semibold px-2 py-1 hover:bg-slate-700 hover:text-white"
                  >
                    Message {authorFirstName}
                  </button>
                </div>
              ) : (
                <p className="w-full text-center text-sm">
                  Loading user data...
                </p>
              )}
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
            </div>
            <div className="w-full flex justify-between items-center bg-slate-700 py-1 px-2 mt-6">
              <p className="text-sm font-normal text-white">
                {listing?.category}
              </p>
              <div className="w-[6rem] text-center">
                <h2 className={getConditionColor(listing?.condition)}>
                  {listing?.condition}
                </h2>
              </div>
            </div>
          </CardFooter>
        </Suspense>
      </Card>
    </>
  );
};

export default ListingDetailsCard;
