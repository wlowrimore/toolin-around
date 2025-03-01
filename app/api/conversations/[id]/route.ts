import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = (await params).id as string;

    const conversation = await client.fetch(
      `*[_type == "conversation" && _id == $id][0]{
                _id,
                subject,
                participants[]->{
                  _id,
                  name,
                  email,
                  image,
                },
                listing->{
                  _id,
                  title,
                  image
                },
                lastMessageAt,
                createdAt
            }`,
      { id: conversationId }
    );

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    const messages = await client.fetch(
      `*[_type == "message" && conversation._ref == $conversationId] | order(createdAt asc) {
              _id,
              content,
              sender->{
                _id,
                name,
                email,
                image
              },
              recipient->{
                _id,
                name,
                email,
                image
              },
              isRead,
              createdAt
            }`,
      { conversationId }
    );

    return NextResponse.json({
      conversation,
      messages,
    });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversation" },
      { status: 500 }
    );
  }
}
