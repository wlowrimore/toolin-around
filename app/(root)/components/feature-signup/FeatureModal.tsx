"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogOverlay,
} from "../ui/dialog";
import FeatureButton from "./FeatureButton";
import { LoadingSpinner } from "../LoadingAnimations";

const FeatureModal = ({ isOpen }: { isOpen: boolean }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  {
    isLoading && <LoadingSpinner />;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <FeatureButton />
      </DialogTrigger>
      {isOpen ? (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign up for feature status</DialogTitle>
            <DialogDescription>Fast & Cheap</DialogDescription>
          </DialogHeader>
          <main>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <p className="text-sm text-neutral-300">
                By signing up as a featured user, you&apos;ll be able to
                showcase your listings to a wider audience, attract more
                interest in your products, and boost your visibility.
              </p>
            )}
          </main>
          <DialogFooter>
            <DialogClose>Close</DialogClose>
          </DialogFooter>
        </DialogContent>
      ) : null}
    </Dialog>
  );
};

export default FeatureModal;
