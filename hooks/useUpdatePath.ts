"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function useUpdatePath() {
  const [isUpdatePath, setIsUpdatePath] = useState<boolean>(false);
  const path = usePathname();

  useEffect(() => {
    if (path.includes("/listing/edit")) {
      setIsUpdatePath(true);
    } else {
      setIsUpdatePath(false);
    }
  }, [path]);

  return { isUpdatePath };
}
