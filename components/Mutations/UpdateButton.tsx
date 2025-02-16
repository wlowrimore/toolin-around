"use client";

import { UserProfileListingType } from "@/app/(root)/user-profile/[id]/page";
import { useRouter } from "next/navigation";

const UpdateButton: React.FC<UserProfileListingType> = ({ userListings }) => {
  const listing = userListings[0];
  const router = useRouter();

  const handleUpdateClick = () => {
    router.push(`/listing/edit/${listing._id}`);
  };

  return (
    <button
      onClick={handleUpdateClick}
      title="Delete"
      type="button"
      className="flex items-center gap-1.5 hover:underline"
    >
      <div className="bg-blue-500 w-2.5 h-2.5 rounded-full"></div>
      <p className="tracking-wide">Update</p>
    </button>
  );
};

export default UpdateButton;
