import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    // Fetch all conversations where the user is a participant
    const conversations = await client.fetch(
      `*[_type == "conversation" && $userId in participants[]._ref] | order(lastMessageAt desc) {
        _id,
        subject,
        participants[]->{
          _id,
          name,
          email,
          image
        },
        listing->{
          _id,
          title,
          image
        },
        lastMessageAt,
        createdAt
      }`,
      { userId }
    );

    // For each conversation, get the last message and count of unread messages
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conversation: any) => {
        // Get the last message
        const lastMessages = await client.fetch(
          `*[_type == "message" && conversation._ref == $conversationId] | order(createdAt desc)[0] {
            _id,
            content,
            sender->{_id},
            createdAt
          }`,
          { conversationId: conversation._id }
        );

        // Count unread messages for the user
        const unreadCount = await client.fetch(
          `count(*[
            _type == "message" &&
            conversation._ref == $conversationId &&
            recipient._ref == $userId &&
            isRead == false
          ])`,
          { conversationId: conversation._id, userId }
        );

        return {
          ...conversation,
          lastMessage: lastMessages || null,
          unreadCount,
        };
      })
    );

    return NextResponse.json({ conversations: conversationsWithDetails });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  // Change to POST
  try {
    const body = await request.json();
    const { conversationId, userId } = body;

    if (!conversationId || !userId) {
      return NextResponse.json(
        { error: "Conversation ID and User ID are required" },
        { status: 400 }
      );
    }

    const transaction = client.transaction();
    const query = `*[_type == "message" && conversation._ref == $conversationId && recipient._ref == $userId && isRead == false]`;
    const messages = await client.fetch(query, { conversationId, userId });

    messages.forEach((message: any) => {
      const patch = transaction.patch(message._id);
      (patch as any).set({ isRead: true });
    });

    const result = await transaction.commit();

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return NextResponse.json(
      { error: "Failed to mark messages as read" },
      { status: 500 }
    );
  }
}
