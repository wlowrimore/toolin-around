"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { MessageCircleMore, ArrowLeft, Send } from "lucide-react";

interface ConversationProps {
  _id: string;
  conversationId: string;
  participants: { _id: string; name: string; image: string }[];
  listing: { _id: string; title: string; image: string };
  subject: string;
  onBack: () => void;
}

interface Message {
  isRead: boolean;
  sender: { _id: string; name: string; image: string };
  listing: { _id: string; title: string; image: string };
  messages: Message[];
  recipient: { _id: string };
  _id: string;
  content: string;
  participants: { _id: string; name: string; image: string }[];
  createdAt: string;
}

const ConversationView = ({ conversationId, onBack }: ConversationProps) => {
  const { data: session } = useSession();
  const [conversation, setConversation] = useState<ConversationProps | null>(
    null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const loadConversation = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/conversations/${conversationId}`);
        if (!response.ok) throw new Error("Failed to load conversation");

        const data = await response.json();
        setConversation(data.conversation);
        setMessages(data.messages);

        // Mark unread messages as read
        const unreadMessages = data.messages.filter(
          (msg: Message) =>
            !msg.isRead && msg.recipient._id === session?.user?.id
        );

        if (unreadMessages.length > 0) {
          await Promise.all(
            unreadMessages.map((msg: Message) =>
              fetch("/api/mark-as-read", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messageId: msg._id }),
              })
            )
          );
        }
      } catch (error) {
        console.error("Error loading conversation:", error);
      } finally {
        setLoading(false);
      }
    };

    if (conversationId && session?.user?.id) {
      loadConversation();
    }
  }, [conversationId, session?.user?.id]);

  const handleSendReply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!replyContent.trim() || !conversation) return;

    try {
      setSending(true);

      // Find the other participant
      const otherParticipant = conversation.participants.find(
        (p: { _id: string }) => p._id !== session?.user?.id
      );

      if (!otherParticipant) throw new Error("Recipient not found");

      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: replyContent,
          senderId: session?.user?.id,
          recipientId: otherParticipant._id,
          listingId: conversation.listing._id,
          conversationId: conversation._id,
        }),
      });

      if (!response.ok) throw new Error("Failed to send reply");

      const { data: newMessage } = await response.json();

      // Add the new message to the conversation
      const updatedMessage = {
        ...newMessage,
        sender: session?.user,
        recipient: otherParticipant,
        createdAt: new Date().toISOString(),
      };

      setMessages([...messages, updatedMessage]);
      setReplyContent("");
    } catch (error) {
      console.error("Error sending reply:", error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading conversation...</div>;
  }

  if (!conversation) {
    return <div className="p-6 text-center">Conversation not found</div>;
  }

  return (
    <div className="flex flex-col h-full max-h-[78vh]">
      {/* Header */}
      <div className="bg-sky-100 p-4 flex items-center border-b">
        <button
          onClick={onBack}
          className="mr-3 hover:bg-sky-200 p-1 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-semibold">{conversation.subject}</h2>
          <div className="text-sm text-gray-600">
            {conversation.participants.map((p) => p.name).join(", ")}
          </div>
        </div>
      </div>

      {/* Message Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No messages in this conversation yet
          </div>
        ) : (
          <div className="h-screen">
            {messages.length > 0 &&
              messages.map((message) => {
                const isFromMe = message.sender._id === session?.user?.id;

                return (
                  <div
                    key={message._id}
                    className={`flex ${isFromMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 ${
                        isFromMe
                          ? "bg-blue-500 text-white mb-3"
                          : "bg-gray-100 text-gray-800 mb-3"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <img
                          src={message?.sender?.image || "/default-avatar.jpg"}
                          alt={message?.sender?.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="font-medium text-sm">
                          {message?.sender?.name}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <div
                        className={`text-xs mt-1 ${isFromMe ? "text-blue-100" : "text-gray-500"}`}
                      >
                        {formatDistanceToNow(new Date(message.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Reply Form */}
      <form
        onSubmit={handleSendReply}
        className="border-t p-3 bg-white mt-auto"
      >
        <div className="flex items-end">
          <div className="flex-1">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Type your reply..."
              className="w-full border p-2 min-h-[5rem] focus:outline-none"
              disabled={sending}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={!replyContent.trim() || sending}
          className="flex items-center justify-center bg-cyan-700 text-white p-2 w-full disabled:bg-gray-300"
        >
          <Send className="w-6 h-6" />
          <span className="ml-2 text-xl">Send</span>
        </button>
      </form>
    </div>
  );
};

export default ConversationView;
