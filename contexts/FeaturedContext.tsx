"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { getFeaturedStatus } from "@/app/actions/featuredStatus";
import { set } from "sanity";

interface FeaturedContextType {
  isFeatured: boolean;
  featuredSince: string | null;
  featuredUntil: string | null;
  isLoading: boolean;
  refreshStatus: () => Promise<void>;
}

const FeaturedContext = createContext<FeaturedContextType | undefined>(
  undefined,
);

export function FeaturedProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [isFeatured, setIsFeatured] = useState(false);
  const [featuredSince, setFeaturedSince] = useState<string | null>(null);
  const [featuredUntil, setFeaturedUntil] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshStatus = async () => {
    if (!session?.user?.email) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const result = await getFeaturedStatus(session.user.email);

    if (result.success && result.data) {
      setIsFeatured(result.data.isFeatured);
      setFeaturedSince(result.data.featuredSince || null);
      setFeaturedUntil(result.data.featuredUntil || null);
    }

    setIsLoading(false);
  };
  useEffect(() => {
    if (status === "authenticated") {
      refreshStatus();
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
  }, [session?.user?.email, status]);

  return (
    <FeaturedContext.Provider
      value={{
        isFeatured,
        featuredSince,
        featuredUntil,
        isLoading,
        refreshStatus,
      }}
    >
      {children}
    </FeaturedContext.Provider>
  );
}

export function useFeatured() {
  const context = useContext(FeaturedContext);
  if (context === undefined) {
    throw new Error("useFeatured must be used within a FeaturedProvider");
  }
  return context;
}
