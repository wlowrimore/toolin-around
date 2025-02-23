"use client";

import { useState } from "react";
import { Dialog, DialogHeader } from "@/components/ui/dialog";
import MessageModal from "@/components/MessageModal";
import { formatDate } from "@/lib/utils";
import {
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { X } from "lucide-react";

interface Message {
  _id: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  sender: {
    _id: string;
    name: string;
    image: string;
  };
  recipient: {
    _id: string;
    name: string;
    image: string;
  };
  listing: {
    _id: string;
    title: string;
  };
}

interface MessagesDisplayProps {
  initialMessages: Message[];
  userId: string;
}

export default function MessagesDisplay({
  initialMessages,
  userId,
}: MessagesDisplayProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

  const truncateContent = (content: string) => {
    return content.length > 100 ? content.slice(0, 100) + "..." : content;
  };

  const handleMessageClick = async (message: Message, id: Message["_id"]) => {
    setSelectedMessage({ ...message, _id: id });

    if (!message.isRead && message.recipient._id === userId) {
      try {
        const response = await fetch("/api/mark-read", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messageId: message._id }),
        });

        if (response.ok) {
          setMessages(
            messages.map((msg) =>
              msg._id === message._id ? { ...msg, isRead: true } : msg
            )
          );
        }
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    }
  };

  const handleReply = async (content: string) => {
    if (!selectedMessage) return;

    try {
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          recipientId: selectedMessage.sender._id,
          listingId: selectedMessage.listing._id,
        }),
      });

      if (response.ok) {
        const newMessage = await response.json();
        setMessages([newMessage, ...messages]);
        setIsReplyModalOpen(false);
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message._id}
          onClick={() => handleMessageClick(message, message._id)}
          className={`p-4 hover:shadow-md transition-shadow cursor-pointer border-b border-slate-300 ${
            message.isRead && message.recipient._id === userId
              ? "opacity-60"
              : "opacity-100"
          }`}
        >
          <div className="w-full grid grid-cols-6 gap-4">
            <div className="flex col-span-2 gap-3 mb-2">
              <img
                src={message.sender.image}
                alt={message.sender.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">{message.sender.name}</p>
                <p className="text-sm text-gray-600">
                  Re: {message.listing.title}
                </p>
              </div>
            </div>
            <div className="col-span-3 flex items-center">
              <p className="text-gray-700">
                &quot; {truncateContent(message.content)} &quot;
              </p>
            </div>
            <p className="flex justify-end items-center text-sm text-gray-500">
              {formatDate(message.createdAt)}
            </p>
          </div>
        </div>
      ))}

      {selectedMessage && (
        <Dialog
          open={!!selectedMessage}
          onOpenChange={(open) => !open && setSelectedMessage(null)}
        >
          <DialogContent className="relative">
            <DialogTitle></DialogTitle>
            <DialogHeader>
              <div className="max-w-6xl w-full h-[17.2rem] max-h-[17.2rem] p-6 space-y-4 bg-sky-900 text-white">
                <div className="flex items-center gap-5">
                  <img
                    src={selectedMessage.sender.image}
                    alt={selectedMessage.sender.name}
                    className="w-20 h-20 border border-white"
                  />
                  <div>
                    <div className="flex flex-col pb-3">
                      <h3 className="flex flex-col font-bold text-2xl leading-6">
                        {selectedMessage.sender.name}
                        <span className="text-xs text-gray-300">
                          Sent on {formatDate(selectedMessage.createdAt)}
                        </span>
                      </h3>
                    </div>
                    <p className="text-base text-sky-200">
                      Re: {selectedMessage.listing.title}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-4 px-[6.3rem]">
                  <div className="border border-slate-700 bg-white text-black p-2 mb-2 h-[5rem] max-h-[5rem] overflow-auto">
                    <p className="tracking-wide">{selectedMessage.content}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsReplyModalOpen(true)}
                      className="py-[3px] px-3 bg-white text-black font-semibold hover:bg-emerald-700 hover:text-white text-sm transition-colors duration-200"
                    >
                      Reply
                    </button>
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="py-1 px-3 border-white bg-gray-900 hover:bg-red-700/80 text-white text-sm"
                    >
                      Ignore
                    </button>
                  </div>
                </div>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}

      <MessageModal
        authorFirstName={selectedMessage?.sender.name.split(" ")[0] || ""}
        authorId={selectedMessage?.sender._id || ""}
        listingId={selectedMessage?.listing._id || ""}
        isOpen={isReplyModalOpen}
        onOpenChange={setIsReplyModalOpen}
        sessionUserId={userId}
      />
    </div>
  );
}
