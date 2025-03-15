"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useMessages } from "@/hooks/useMessages";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Send } from "lucide-react";
import { LoadingBar, LoadingSpinner } from "../LoadingAnimations";
import { formatMessageTime } from "@/lib/utils";

interface ConversationProps {
  _id: string;
  conversationId: string;
  participants: { _id: string; name: string; image: string }[];
  listing: { _id: string; title: string; image: string };
  subject: string;
  onBack: () => void;
  onMessageRead?: (count: number) => void;
  onMessageSent?: () => void;
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

const ConversationView = ({
  conversationId,
  onBack,
  onMessageRead,
  onMessageSent,
}: ConversationProps) => {
  const { data: session } = useSession();
  const { markConversationAsRead } = useMessages(session?.user?.id as string);
  const [conversation, setConversation] = useState<ConversationProps | null>(
    null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [sending, setSending] = useState(false);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // Guard against multiple calls and ensure we have the necessary data
    if (hasLoadedRef.current || !conversationId || !session?.user?.id) {
      return;
    }

    const loadConversation = async () => {
      try {
        setLoading(true);

        // Add a small delay to ensure everything is initialized
        await new Promise((resolve) => setTimeout(resolve, 100));

        const response = await fetch(`/api/conversations/${conversationId}`);
        if (!response.ok) throw new Error("Failed to load conversation");

        const data = await response.json();
        setConversation(data.conversation);
        setMessages(data.messages);

        // Mark messages as read only if we successfully loaded the conversation
        try {
          if (markConversationAsRead) {
            const markedCount = await markConversationAsRead(conversationId);

            if (typeof onMessageRead === "function" && markedCount > 0) {
              onMessageRead(markedCount);
            }
          }
        } catch (readError) {
          console.error("Error marking conversation as read:", readError);
          // Don't fail the whole operation if just marking as read fails
        }

        // Set the flag to prevent reloading
        hasLoadedRef.current = true;
      } catch (error) {
        console.error("Error loading conversation:", error);
        // Add a user-friendly toast
        toast({
          title: "Error",
          variant: "destructive",
          description: "Failed to load the conversation. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadConversation();

    // Cleanup function
    return () => {
      hasLoadedRef.current = false;
    };
  }, [conversationId, session?.user?.id]); // Remove markConversationAsRead and onMessageRead from dependencies

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
        isRead: false,
      };

      setMessages((prevMessages) => [...prevMessages, updatedMessage]);
      toast({
        title: "Message Status",
        variant: "success",
        description: "Your message has been sent successfully",
      });
      setReplyContent("");

      if (typeof onMessageSent === "function") {
        onMessageSent();
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      toast({
        title: "Message Status",
        variant: "destructive",
        description: "Failed to send your message. Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center p-6">
        <p>Loading conversation...</p>
        <LoadingBar />
      </div>
    );
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
            {messages.map((message, index) => {
              const isFromMe = message?.sender?._id === session?.user?.id;
              console.log("SENDER: ", message?.sender);
              console.log("USER: ", session?.user);
              const messageKey = message._id ? message._id : index;

              return (
                <div
                  key={messageKey}
                  className={`flex ${isFromMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 ${
                      isFromMe
                        ? "bg-blue-500 text-white my-3 max-w-[47%] w-[47%] rounded-l-2xl rounded-br-2xl"
                        : "bg-slate-200 text-gray-800 my-3 max-w-[47%] w-[47%] rounded-r-2xl rounded-bl-2xl"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <img
                        src={message?.sender?.image as string}
                        alt={message?.sender?.name as string}
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="font-medium text-sm">
                        {message?.sender?.name}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap">{message?.content}</p>
                    <div
                      className={`text-xs mt-1 ${isFromMe ? "text-blue-200" : "text-gray-500"}`}
                    >
                      {formatMessageTime(message.createdAt)}
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
        className="border-t py-3 bg-white mt-auto"
      >
        <div className="flex items-end">
          <div className="flex-1">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Type your reply..."
              style={{ resize: "none" }}
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
          {sending ? <LoadingSpinner /> : <Send className="w-6 h-6" />}
          <span className={`ml-2 text-xl ${sending ? "text-white" : ""}`}>
            {sending ? "Sending..." : "Send"}
          </span>
        </button>
      </form>
    </div>
  );
};

export default ConversationView;
