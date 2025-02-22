"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import MessageModal from "@/components/MessageModal";
import { formatDate } from "@/lib/utils";

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

  const handleMessageClick = async (message: Message) => {
    setSelectedMessage(message);

    if (!message.isRead && message.recipient._id === userId) {
      try {
        const response = await fetch("/api/messages/mark-read", {
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
          onClick={() => handleMessageClick(message)}
          className={`p-4 border rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer ${
            !message.isRead && message.recipient._id === userId
              ? "bg-blue-50"
              : "bg-white"
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <img
              src={message.sender.image}
              alt={message.sender.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold">{message.sender.name}</p>
              <p className="text-sm text-gray-500">
                Re: {message.listing.title}
              </p>
            </div>
            <p className="ml-auto text-sm text-gray-500">
              {formatDate(message.createdAt)}
            </p>
          </div>
          <p className="text-gray-700">{message.content}</p>
        </div>
      ))}

      {selectedMessage && (
        <Dialog
          open={!!selectedMessage}
          onOpenChange={(open) => !open && setSelectedMessage(null)}
        >
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={selectedMessage.sender.image}
                alt={selectedMessage.sender.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-bold text-lg">
                  {selectedMessage.sender.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Re: {selectedMessage.listing.title}
                </p>
              </div>
            </div>
            <p className="text-gray-700 mt-4">{selectedMessage.content}</p>
            <button
              onClick={() => setIsReplyModalOpen(true)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Reply
            </button>
          </div>
        </Dialog>
      )}

      <MessageModal
        authorFirstName={selectedMessage?.sender.name.split(" ")[0] || ""}
        authorId={selectedMessage?.sender._id || ""}
        listingId={selectedMessage?.listing._id || ""}
        isOpen={isReplyModalOpen}
        onClose={() => setIsReplyModalOpen(false)}
        onMessageSent={handleReply}
      />
    </div>
  );
}
