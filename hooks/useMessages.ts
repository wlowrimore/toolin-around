"use client";

import { useState, useEffect } from "react";
import { client } from "@/sanity/lib/client";
import { Message } from "@/types";

export function useMessages(userId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchMessages = async () => {
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
    await client.patch(messageId).set({ isRead: true }).commit();
    await fetchMessages();
  };

  useEffect(() => {
    if (userId) {
      fetchMessages();
    }
  }, [userId]);

  return { messages, unreadCount, sendMessage, markAsRead };
}
