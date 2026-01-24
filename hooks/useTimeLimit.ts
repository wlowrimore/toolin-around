"use client";

import { useState, useEffect } from "react";

export const useTimeLimit = (imageUrl: string) => {
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (imageUrl) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [imageUrl]);
};
