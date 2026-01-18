import { Gem } from "lucide-react";

export default function FeaturedBadge() {
  return (
    <div className="relative w-fit top-2 left-3/4 ml-5 text-black bg-sky-300 px-2 py-1 rounded-full flex items-center gap-1 text-xs font-semibold border border-neutral-600 shadow-md shadow-neutral-500">
      <Gem className="size-3" />
      <span>Featured Lister</span>
    </div>
  );
}
