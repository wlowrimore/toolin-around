"use client";

import { UserProfileListingType } from "@/app/(root)/user-profile/[id]/page";
import { useAvailabilityStatus } from "@/hooks/useAvailabilityStatus";

const AvailabilityButton: React.FC<UserProfileListingType> = ({
  userListings,
}) => {
  const listing: UserProfileListingType["userListings"][0] = userListings[0];
  const { isAvailable, isPending, toggleAvailability } = useAvailabilityStatus({
    listingId: listing._id,
    initialAvailability: listing.availability,
    onSuccess: () => {
      console.log("Availability updated successfully");
    },
    onError: (error) => {
      console.error("Error updating availability:", error);
    },
  });

  const handleChangeAvailabilityClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleAvailability();
  };

  return (
    <button
      onClick={handleChangeAvailabilityClick}
      disabled={isPending}
      title={isAvailable ? "Mark Unavailable" : "Mark Available"}
      type="button"
      className="flex items-center gap-1.5 hover:underline"
    >
      {/* <div
        className={`${isAvailable ? "bg-green-500" : "bg-red-500"} bg-blue-500 w-2.5 h-2.5 rounded-full`}
      ></div> */}
      {/* <p className="tracking-wide">
        {isPending
          ? "Updating..."
          : isAvailable
            ? "Mark as Unavailable"
            : "Mark as Available"}
      </p> */}
      <p className="tracking-wide">
        {isPending
          ? "Updating..."
          : isAvailable
            ? "Change Status"
            : "Change Status"}
      </p>
    </button>
  );
};

export default AvailabilityButton;
