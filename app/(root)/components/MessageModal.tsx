"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/(root)/components/ui/dialog";
import { MessageCircleMore, Check } from "lucide-react";
import LoginModalForm from "./Auth/PrivacyPolicyModal";
import { toast } from "@/hooks/use-toast";
import { LoadingSpinner } from "./LoadingAnimations";
import { listing } from "@/sanity/schemaTypes/listing";

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
  params?: any;
}

// New interface for the listing data
interface ListingData {
  _id: string;
  title: string;
  price?: number;
  image?: string;
  ratePeriod: string;
  location?: string;
  author?: {
    _id: string;
    name: string;
    image?: string;
    email?: string;
  };
  contact?: string;
  // Add any other fields you might need
}

// Interface for sender data
interface SenderData {
  id: string;
  name: string;
  image?: string;
  email?: string;
  role?: string;
}

const MessageModal = ({
  authorFirstName,
  authorId,
  listingId,
  isOpen: externalIsOpen,
  onOpenChange,
  onMessageSent,
  params,
}: MessageModalProps) => {
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [listingData, setListingData] = useState<ListingData | null>(null);
  const [senderData, setSenderData] = useState<SenderData | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  // const sessionUserId = params?.id;
  const sessionUserInfo = session?.user;

  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    }
    if (!open) {
      setIsSent(false);
    }
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const { value } = e.target;
    setMessage(value);
  };

  // Function to fetch listing data using API route
  const fetchListingData = async (id: string) => {
    try {
      const response = await fetch(`/api/listings/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      console.log("1. LISTING DATA:", data);
      return data as ListingData;
    } catch (error) {
      console.error("Failed to fetch listing data:", error);
      return null;
    }
  };

  // Function to send confirmation email
  // const sendConfirmationEmail = async (
  //   messageData: any,
  //   listingInfo: ListingData,
  //   senderData: SenderData
  // ) => {
  //   try {
  //     const recipientEmail = listingInfo.contact || listingInfo.author?.email;
  //     const senderEmail = session?.user?.email;
  //     const senderName = session?.user?.name;
  //     const senderId = session?.user?.id || session?.user?.email;

  //     if (!senderEmail) {
  //       console.error("Sender email not available");
  //       return false;
  //     }

  //     const emailData = {
  //       messageId: messageData.message._id,
  //       conversationId: messageData.conversation?._id,
  //       listingId: listingInfo._id,
  //       listingTitle: listingInfo.title,
  //       listingPrice: listingInfo.price,
  //       listingRatePeriod: listingInfo.ratePeriod,
  //       recipientId: authorId,
  //       recipientName: listingInfo?.author?.name,
  //       recipientEmail,
  //       senderId,
  //       senderName: senderName,
  //       senderEmail: senderData.email,
  //       messageContent: message,
  //     };

  //     const response = await fetch("/api/send-confirmation-email", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(emailData),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error ${response.status}`);
  //     }

  //     return true;
  //   } catch (error) {
  //     console.error("Failed to send confirmation email:", error);
  //     return false;
  //   }
  // };

  const sendConfirmationEmail = async (
    messageData: any,
    listingInfo: ListingData,
    senderData: SenderData
  ) => {
    try {
      const recipientEmail = listingInfo.contact || listingInfo.author?.email;
      const senderEmail = session?.user?.email;
      const senderName = session?.user?.name;
      const senderId = session?.user?.id || session?.user?.email;

      if (!senderEmail) {
        console.error("Sender email not available");
        return false;
      }

      const emailData = {
        messageId: messageData.message._id,
        conversationId: messageData.conversation?._id,
        listingId: listingInfo._id,
        listingTitle: listingInfo.title,
        listingPrice: listingInfo.price,
        listingRatePeriod: listingInfo.ratePeriod,
        recipientId: authorId,
        recipientName: listingInfo?.author?.name,
        recipientEmail,
        recipientImage: listingInfo?.author?.image,
        senderId,
        senderName,
        senderEmail,
        senderImage: senderData.image,
        messageContent: message,
      };

      const response = await fetch("/api/send-confirmation-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Failed to send confirmation email:", error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSending(true);

    try {
      // 1. Send the message
      const requestBody = {
        recipientId: authorId,
        content: message,
        listingId,
        senderId: session?.user?.id || `author-${session?.user?.email}`,
      };

      console.log(
        "Sending message with body:",
        JSON.stringify(requestBody, null, 2)
      );

      console.log("REQUEST BODY:", requestBody);

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

      const messageData = await response.json();
      console.log("MESSAGE DATA:", messageData);

      // 2. Fetch listing and sender data concurrently
      const [fetchedListingData] = await Promise.all([
        fetchListingData(listingId),
      ]);

      setListingData(fetchedListingData);
      setSenderData(sessionUserInfo as SenderData);

      // 3. Send confirmation email
      if (fetchedListingData && sessionUserInfo) {
        await sendConfirmationEmail(
          messageData,
          fetchedListingData,
          sessionUserInfo
        );
        console.log(
          "Confirmation email ListingData sent successfully",
          fetchedListingData
        );
        console.log(
          "Confirmation email sessionUserInfo sent successfully",
          sessionUserInfo
        );
        console.log(
          "Confirmation email messageData sent successfully",
          messageData
        );
      }

      // 4. Success handling
      setMessage("");
      setIsSent(true);

      toast({
        title: "Success",
        description: "Message sent successfully!",
        variant: "success",
        duration: 3000,
      });

      // If we have a conversation ID, we can redirect to the conversation
      if (messageData.conversation?._id) {
        setTimeout(() => {
          handleOpenChange(false);
          if (onMessageSent) {
            onMessageSent(messageData.conversation._id);
          }
          // Optional: navigate to the conversation
          // router.push(`/messages?conversation=${messageData.conversation._id}`);
        }, 1500);
      } else {
        setTimeout(() => {
          handleOpenChange(false);
          if (onMessageSent) {
            onMessageSent(messageData.message._id);
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
    <div onClick={(e) => e.stopPropagation()}>
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
              onChange={handleTextAreaChange}
              rows={4}
              autoFocus={true}
              placeholder="Type your message here..."
              className="w-full border border-slate-400 p-2 placeholder:text-sm resize-none outline-none"
              maxLength={500}
              required
            />
            <DialogFooter>
              {isSent ? (
                <span className="flex items-center gap-1 text-emerald-800 mr-5">
                  <Check className="w-4 h-4" />
                  Sent!
                </span>
              ) : (
                <button
                  type="submit"
                  disabled={isSending}
                  className="text-blue-700 font-semibold tracking-wide text-sm px-2 py-1 hover:text-blue-900 disabled:pointer-events-none disabled:opacity-50"
                >
                  <span className="flex items-center gap-1">
                    {isSending && <LoadingSpinner />}
                    {isSending ? "Sending..." : "Send Message"}
                  </span>
                </button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessageModal;
