import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Search } from "lucide-react";

export function SearchModal({ query }: { query: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1 hover:text-blue-200">
          <Search className="h-5 w-5" />
          Find Tools
        </button>
      </DialogTrigger>
      <form
        id="search-form"
        action="/all-listings"
        className="flex items-center gap-2.5 w-3/4 justify-center"
      >
        <DialogContent className="sm:max-w-[425px] bg-white bg-[url('/logos/modalLogo.png')] bg-no-repeat bg-center bg-contain">
          <DialogHeader>
            <DialogTitle>Find Tools</DialogTitle>
            <DialogDescription>
              Search for tools by tool type, tool name, or tool purpose.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-2">
              <Input
                id="query"
                name="query"
                defaultValue={query}
                placeholder="Search for tools"
                className="col-span-3 bg-white/90"
              />
            </div>
          </div>
          <DialogFooter>
            <button
              type="submit"
              title="Search"
              aria-label="Search"
              className="text-white px-4 py-2 border border-cyan-700/90 bg-cyan-600 hover:bg-cyan-700"
            >
              Search
            </button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
