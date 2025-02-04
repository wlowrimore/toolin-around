"use client";

import { useSession } from "next-auth/react";
import { ListingType } from "@/types";

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

interface ListingCardProps {
  id: string;
  listing: ListingType;
  currentUser?: string;
  createdAt: ListingType["createdAt"];
  author: ListingType["author"];
  category: ListingType["category"];
  condition: ListingType["condition"];
  contact: ListingType["contact"];
  image: ListingType["image"];
  price: ListingType["price"];
  title: ListingType["title"];
  description: ListingType["description"];
  toolDetails: ListingType["toolDetails"];
  handleClick?: () => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, currentUser }) => {
  const { data: session } = useSession();

  const userHandle = () => {
    if (session) {
      const nameTag = session?.user?.email?.split("@")[0].toLowerCase();
      return `@${nameTag}`;
    }
  };

  const truncateDesc = (text: string, maxLength = 57) => {
    if (!text) return "No description provided";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const truncatedToolDetails = truncateDesc(listing.toolDetails || "");

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
        <CardTitle>{listing.title}</CardTitle>
        <CardDescription>{listing.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full max-h-64 overflow-hidden flex justify-center items-center">
          <img
            src={listing.image || ""}
            alt={listing.title || ""}
            width={1000}
            height={1000}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="w-full flex justify-between items-end">
          {session ? (
            <div className="flex px-4 gap-2 items-center">
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
        </div>
        <div className="w-full bg-slate-700 py-1 px-2 mt-6">
          <p className="text-sm font-normal text-white">{listing.category}</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ListingCard;
