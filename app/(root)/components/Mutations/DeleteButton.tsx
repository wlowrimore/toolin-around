"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/(root)/components/ui/alert-dialog";

import { UserProfileListingType } from "@/app/(root)/user-profile/[id]/page";
import { deleteListing } from "@/lib/actions"; // adjust import path
import { X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const DeleteButton: React.FC<UserProfileListingType> = ({ userListings }) => {
  const listing = userListings[0];
  const router = useRouter();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      console.log("Attempting to delete listing with ID:", listing._id);
      listing._id;
      listing;
      console.log("Listing to delete:", listing);

      const result = await deleteListing(listing._id);
      console.log("Delete listing result:", result);
      console.log(
        "LISTING ID AFTER AWAIT DELETElISTING(listing._id):",
        listing._id
      );
      console.log("LISTING AFTER AWAIT DELETElISTING(listing._id):", listing);

      if (result.status === "SUCCESS") {
        toast({
          title: "Listing Deleted",
          description: "Your listing has been deleted successfully.",
          variant: "success",
        });
        router.refresh();
        router.push("/");
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      console.error("Error deleting listing:", error);
      error instanceof Error ? error.message : "Failed to delete listing";
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete listing",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!listing?._id) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <button
          title="Delete"
          type="button"
          className="w-full bg-slate-800/60 flex items-center justify-center mx-auto py-2.5 px-3 hover:bg-slate-800 active:bg-white/30 transition-colors duration-200"
        >
          {/* <div className="bg-red-500 w-2.5 h-2.5 rounded-full"></div> */}
          {/* <p className="tracking-wide">Delete Listing</p> */}
          <div className="text-red-500 flex items-center">
            <X />
            <span className="text-white tracking-wide">Delete Listing</span>
          </div>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            service "{listing?.title}".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteButton;
