"use client";

import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { Message } from "@/types";

interface UseMessagesOptions {
  pollingInterval?: number;
}

export function useMessages(userId: string, options: UseMessagesOptions = {}) {
  const { pollingInterval = 3000 } = options;

  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchMessages = async () => {
    if (!userId) return;

    const query = `*[_type == "message" && recipient._ref == $userId] | order(createdAt desc)`;
    const messages = await client.fetch(query, { userId });
    setMessages(messages);
    setUnreadCount(messages.filter((m: Message) => !m.isRead).length);
  };

  const sendMessage = async (
    recipientId: string,
    content: string,
    listingId: string,
    parentMessageId?: string
  ) => {
    await client.create({
      _type: "message",
      sender: { _ref: userId },
      recipient: { _ref: recipientId },
      content,
      listingId: { _ref: listingId },
      parentMessageId: parentMessageId ? { _ref: parentMessageId } : undefined,
      isRead: false,
    });
    await fetchMessages();
  };

  const markAsRead = async (messageId: string) => {
    // Update state immediately for faster UI feedback
    setMessages((currentMessages) =>
      currentMessages.map((msg) =>
        msg._id === messageId ? { ...msg, isRead: true } : msg
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    // Then update in Sanity
    await client.patch(messageId).set({ isRead: true }).commit();
  };

  // Add a function to mark all messages in a conversation as read
  const markConversationAsRead = async (conversationId: string) => {
    if (!userId || !conversationId) return 0;

    // Filter messages that belong to the conversation and are unread
    const conversationMessages = messages.filter((m) => {
      // Check if listingId is a ListingId object or a string
      const isListingMatch =
        typeof m.listingId === "object"
          ? m.listingId._ref === conversationId
          : m.listingId === conversationId;

      return isListingMatch && !m.isRead;
    });

    if (conversationMessages.length === 0) return 0;

    // Update state immediately
    setMessages((currentMessages) =>
      currentMessages.map((msg) => {
        const isListingMatch =
          typeof msg.listingId === "object"
            ? msg.listingId._ref === conversationId
            : msg.listingId === conversationId;

        if (isListingMatch && !msg.isRead) {
          return { ...msg, isRead: true };
        }
        return msg;
      })
    );

    // Update unread count
    setUnreadCount((prev) => Math.max(0, prev - conversationMessages.length));

    // Update in Sanity
    const updatePromises = conversationMessages.map((msg) =>
      client.patch(msg._id).set({ isRead: true }).commit()
    );

    await Promise.all(updatePromises);
    return conversationMessages.length;
  };

  // Setup polling
  useEffect(() => {
    if (userId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, pollingInterval);
      return () => clearInterval(interval);
    }
  }, [userId, pollingInterval]);

  return {
    messages,
    unreadCount,
    sendMessage,
    markAsRead,
    markConversationAsRead,
    refreshMessages: fetchMessages,
  };
}
