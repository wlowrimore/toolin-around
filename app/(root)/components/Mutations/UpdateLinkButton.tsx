"use client";

import { useState } from "react";
import { UserProfileListingType } from "@/app/(root)/user-profile/[id]/page";
import { useRouter } from "next/navigation";
import { CircleFadingArrowUp } from "lucide-react";

const UpdateLinkButton: React.FC<UserProfileListingType> = ({
  userListings,
}) => {
  const listing = userListings[0];
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateClick = () => {
    setIsUpdating(true);
    router.push(`/listing/edit/${listing._id}`);
  };

  return (
    <button
      onClick={handleUpdateClick}
      title="Delete"
      type="button"
      className="w-full flex items-center justify-center mx-auto bg-slate-800/60 py-2.5 px-3 hover:bg-slate-800 active:bg-white/30 transition-colors duration-200"
    >
      {/* <div className="bg-blue-500 w-2.5 h-2.5 rounded-full"></div> */}
      {/* <p className="tracking-wide">Update Listing</p> */}
      <div className="flex text-sky-300 items-center gap-1">
        <CircleFadingArrowUp />
        <p className="text-white tracking-wide">
          {isUpdating ? "Updating..." : "Update Listing"}
        </p>
      </div>
    </button>
  );
};

export default UpdateLinkButton;
