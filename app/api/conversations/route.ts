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
