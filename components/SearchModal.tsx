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

export function SearchModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1 hover:text-blue-200">
          <Search className="h-5 w-5" />
          Find Tools
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Find Tools</DialogTitle>
          <DialogDescription>
            Search for tools by tool type, tool name, or tool purpose.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-2">
            {/* <Label htmlFor="query" className="text-right">
              <Search className="opacity-30" />
            </Label> */}
            <Input
              id="query"
              placeholder="Search for tools"
              className="col-span-3"
            />
          </div>
          {/* <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            />
          </div> */}
        </div>
        <DialogFooter>
          <button
            type="submit"
            className="text-white px-4 py-2 border border-cyan-700/90 bg-cyan-600 hover:bg-cyan-700"
          >
            Search
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
