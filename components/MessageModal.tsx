"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
import LoginModalForm from "./Auth/LoginModalForm";

interface MessageModalProps {
  authorFirstName: string;
  authorId: string;
  listingId: string;
  sessionUserId?: string;
  isOpen?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  onMessageChange?: (message: string) => void;
  onSubmit?: (e: React.FormEvent) => void;
  onError?: (error: string) => void;
  onMessageSent?: (message: string) => void;
}

const MessageModal = ({
  authorFirstName,
  authorId,
  listingId,
  sessionUserId,
}: MessageModalProps) => {
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sessionUserId) {
      router.push("/");
      return;
    }

    try {
      const requestBody = {
        recipientId: authorId,
        content: message,
        listingId,
        senderId: sessionUserId,
        createdAt: new Date().toISOString(),
        isRead: false,
        _type: "message",
      };

      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        // Check for HTTP errors (4xx or 5xx)
        const errorText = await response.text(); // Get the error message from the server
        throw new Error(`HTTP error ${response.status}: ${errorText}`); // Throw an error
      }

      const responseText = await response.text(); // Get the raw response text
      console.log("Raw Response:", responseText); // Log the raw response

      try {
        const data = JSON.parse(responseText); // *NOW* try to parse the JSON
        console.log("Parsed JSON Data:", data);
        setMessage(""); // Clear the message input ONLY on success
        setIsOpen(false); // Close the modal on success
        // if (onMessageSent) {
        //   onMessageSent(data.message); // Call the callback if provided.
        // }
      } catch (jsonError) {
        console.error("JSON Parse Error:", jsonError);
        console.error("Problematic JSON Data:", responseText);
        // Handle the JSON parsing error (e.g., show a user-friendly message)
        throw new Error("Invalid JSON response from server.");
      }
    } catch (error) {
      console.error("Fetch/Processing Error:", error);
      // Display a user-friendly error message
      alert("Failed to send message. Please try again later."); // Or use a state variable to show an error message in the UI.
    } finally {
      setIsSending(false); // Set isSending to false in all cases (success or error)
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
          onSubmit={handleSubmit}
          className="w-full h-full flex flex-col items-end gap-6"
        >
          <textarea
            name="message"
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            autoFocus={true}
            placeholder="Type your message here..."
            className="w-full border border-slate-400 p-2 placeholder:text-sm resize-none outline-none"
            maxLength={500}
            required
          />
          <DialogFooter>
            <button
              type="submit"
              disabled={isSending}
              className="text-blue-700 font-semibold tracking-wide text-sm px-2 py-1 hover:text-blue-900 disabled:pointer-events-none disabled:opacity-50"
            >
              {isSending ? "Sending..." : "Send Message"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageModal;
