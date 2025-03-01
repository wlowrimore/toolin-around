"use client";

import React, { useState } from "react";
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
import { MessageCircleMore, Check } from "lucide-react";
import LoginModalForm from "./Auth/LoginModalForm";
import { toast } from "@/hooks/use-toast";

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
  isOpen: externalIsOpen,
  onOpenChange,
  onMessageSent,
}: MessageModalProps) => {
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    }
    if (!open) {
      setIsSent(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sessionUserId) {
      router.push("/");
      return;
    }

    setIsSending(true);

    //   try {
    //     const requestBody = {
    //       recipientId: authorId,
    //       content: message,
    //       listingId,
    //       senderId: sessionUserId,
    //       createdAt: new Date().toISOString(),
    //       isRead: false,
    //       _type: "message",
    //     };

    //     const response = await fetch("/api/send-message", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify(requestBody),
    //     });

    //     if (!response.ok) {
    //       const errorText = await response.text();
    //       throw new Error(`HTTP error ${response.status}: ${errorText}`);
    //     }

    //     const data = await response.json();
    //     setMessage("");
    //     setIsSent(true);

    //     setTimeout(() => {
    //       handleOpenChange(false);
    //     }, 1500);
    //   } catch (error) {
    //     console.error("Fetch/Processing Error:", error);
    //     toast({
    //       title: "Error",
    //       description: "Failed to send message. Please try again later.",
    //       variant: "destructive",
    //       duration: 3000,
    //     });
    //   } finally {
    //     setIsSending(false);
    //   }
    // };

    try {
      const requestBody = {
        recipientId: authorId,
        content: message,
        listingId,
        senderId: sessionUserId,
      };

      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      setMessage("");
      setIsSent(true);

      // If we have a conversation ID, we can redirect to the conversation
      if (data.conversation?._id) {
        setTimeout(() => {
          handleOpenChange(false);
          if (onMessageSent) {
            onMessageSent(data.conversation._id);
          }
          // Optional: navigate to the conversation
          // router.push(`/messages?conversation=${data.conversation._id}`);
        }, 1500);
      } else {
        setTimeout(() => {
          handleOpenChange(false);
          if (onMessageSent) {
            onMessageSent(data.message._id);
          }
        }, 1500);
      }
    } catch (error) {
      console.error("Fetch/Processing Error:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={externalIsOpen ?? isOpen} onOpenChange={handleOpenChange}>
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
            {isSent && (
              <span className="flex items-center gap-1 text-emerald-600">
                <Check className="w-4 h-4" />
                Sent!
              </span>
            )}
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
