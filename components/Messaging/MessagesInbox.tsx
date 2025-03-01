"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import ConversationView from "./ConversationView";

export interface Conversation {
  _id: string;
  participants: any[];
  lastMessage: any;
  lastMessageAt: string;
  subject: string;
  unreadCount: number;
}

const MessagesInbox = () => {
  const { data: session, status } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  useEffect(() => {
    const fetchConversations = async () => {
      if (status !== "authenticated" || !session?.user?.id) return;

      try {
        setLoading(true);
        const response = await fetch(
          `/api/conversations?userId=${session.user.id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch conversations");
        }

        const data = await response.json();
        setConversations(data.conversations);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [session?.user?.id, status]);

  if (status === "loading") {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="p-8 text-center">
        <p>You must be signed in to view your messages.</p>
      </div>
    );
  }

  if (selectedConversationId) {
    return (
      <ConversationView
        conversationId={selectedConversationId}
        onBack={() => setSelectedConversationId(null)}
        participants={[]}
        listing={{ _id: "", title: "", image: "" }}
        subject=""
        _id=""
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold">Messages Inbox</h1>
      </div> */}

      {loading ? (
        <div className="text-center py-8">Loading conversations...</div>
      ) : conversations.length === 0 ? (
        <div className="text-center py-8 border rounded-lg">
          <p className="text-gray-500">You don't have any messages yet.</p>
        </div>
      ) : (
        <div className="space-y-1 border rounded-lg divide-y">
          {conversations.map((conversation) => {
            // Find the other participant
            const otherParticipant = conversation.participants.find(
              (p) => p._id !== session?.user.id
            );

            // Get the last message
            const lastMessage = conversation.lastMessage;

            // Count unread messages
            const unreadCount = conversation.unreadCount || 0;

            return (
              <div
                key={conversation._id}
                onClick={() => setSelectedConversationId(conversation._id)}
                className="p-4 hover:bg-gray-50 cursor-pointer flex items-center"
              >
                <div className="mr-4">
                  <img
                    src={otherParticipant?.image || "/default-avatar.jpg"}
                    alt={otherParticipant?.name || "User"}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium truncate">
                      {conversation.subject}
                    </h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {formatDistanceToNow(
                        new Date(conversation.lastMessageAt),
                        { addSuffix: true }
                      )}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {otherParticipant?.name || "Unknown user"}
                  </p>
                  {lastMessage && (
                    <p className="text-sm text-gray-500 truncate">
                      {lastMessage.content}
                    </p>
                  )}
                </div>
                {unreadCount > 0 && (
                  <div className="ml-3">
                    <span className="bg-cyan-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MessagesInbox;
