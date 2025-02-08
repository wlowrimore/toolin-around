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
        <button
          type="button"
          className="flex items-center space-x-1 hover:text-blue-200 w-fit"
        >
          <span className="flex items-center gap-[0.125rem]">
            <Search className="h-5 w-5" />
            Find Tools
          </span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Find Tools</DialogTitle>
          <DialogDescription>Use keywords to find tools.</DialogDescription>
        </DialogHeader>
        <form id="search-form" action="/filtered-listings" className="w-full">
          <div className="flex items-center gap-2">
            <div className="w-full">
              <Input
                name="query"
                defaultValue={query}
                placeholder="Use keywords to find tools"
                className="w-full"
                autoFocus
              />
            </div>
            <button type="submit" className="">
              <span className="">
                <Search className="h-9 w-9 p-1 border-2 border-slate-400 hover:bg-slate-200" />
              </span>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
