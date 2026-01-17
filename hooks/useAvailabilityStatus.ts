"use client";

import { useState, useTransition } from "react";
import { updateAvailability } from "@/app/actions/updateAvailability";
import { useToast } from "./use-toast";

interface UseAvailabilityStatusProps {
  listingId: string;
  initialAvailability: boolean;
  onSuccess?: (newAvailability: boolean) => void;
  onError?: (error: string) => void;
}

interface UseAvailabilityStatusReturn {
  isAvailable: boolean;
  isPending: boolean;
  toggleAvailability: () => void;
  setAvailability: (availability: boolean) => void;
}

export function useAvailabilityStatus({
  listingId,
  initialAvailability,
  onSuccess,
  onError,
}: UseAvailabilityStatusProps): UseAvailabilityStatusReturn {
  const [isAvailable, setIsAvailable] = useState(initialAvailability);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const updateStatus = async (newAvailability: boolean) => {
    // Optimistic update
    setIsAvailable(newAvailability);

    startTransition(async () => {
      const result = await updateAvailability(listingId, newAvailability);

      if (!result.success) {
        // Revert on error
        setIsAvailable(!newAvailability);
        const errorMessage = result.error || "Failed to update availability";
        toast({ title: "Error", description: errorMessage });
        onError?.(errorMessage);
      } else {
        const message = `Listing marked as ${newAvailability ? "available" : "unavailable"}`;
        toast({ title: "Success", description: message });
        onSuccess?.(newAvailability);
      }
    });
  };

  const toggleAvailability = () => {
    updateStatus(!isAvailable);
  };

  const setAvailability = (availability: boolean) => {
    if (availability !== isAvailable) {
      updateStatus(availability);
    }
  };

  return {
    isAvailable,
    isPending,
    toggleAvailability,
    setAvailability,
  };
}
