import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageCircleMore } from "lucide-react";

const MessageModal = ({ authorFirstName }: { authorFirstName: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full flex justify-end mr-4">
          <button
            type="button"
            className="text-blue-800 text-sm px-4 py-2 hover:text-slate-700 hover:bg-white"
          >
            Message {authorFirstName}
          </button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1 text-base text-sky-800 font-semibold tracking-wide">
            <MessageCircleMore className="w-6 h-6 text-sky-800" />
            <span className="underline">
              Compose your message for {authorFirstName}
            </span>
          </DialogTitle>
        </DialogHeader>
        <form
          action="/api/send-message"
          method="POST"
          className="w-full h-full flex justify-center items-center"
        >
          <textarea
            name="message"
            id="message"
            rows={4}
            autoFocus={true}
            placeholder="Type your message here..."
            className="w-full border border-slate-400 p-2 placeholder:text-sm resize-none outline-none"
            required
          />
        </form>
        <DialogFooter>
          <button
            type="submit"
            className="text-blue-700 font-semibold tracking-wide text-sm px-2 py-1 hover:text-blue-900"
          >
            Send Message
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MessageModal;
