import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

type Message = {
  content: string;
  recipientId: string;
  listingId: string;
  senderId: string;
};

type Error = {
  message: string;
  status: number;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, recipientId, listingId, senderId } = body;

    // Validate required fields
    if (!content || !recipientId || !listingId || !senderId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const [senderExists, recipientExists, listingExists] = await Promise.all([
      client.fetch('*[_type == "author" && _id == $id][0]', { id: senderId }),
      client.fetch('*[_type == "author" && _id == $id][0]', {
        id: recipientId,
      }),
      client.fetch('*[_type == "listing" && _id == $id][0]', { id: listingId }),
    ]);

    if (!senderExists || !recipientExists || !listingExists) {
      return NextResponse.json(
        { message: "One or more referenced documents do not exist" },
        { status: 400 }
      );
    }

    // Create a new message document in Sanity
    const message = await client.create({
      _type: "message",
      content,
      sender: {
        _type: "reference",
        _ref: senderId,
      },
      recipient: {
        _type: "reference",
        _ref: recipientId,
      },
      listing: {
        _type: "reference",
        _ref: listingId,
      },
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    console.log("Message sent successfully: ", message);
    return NextResponse.json(
      { message: "Message sent successfully", data: message },
      { status: 200 }
    );
  } catch (error: Error | any) {
    console.error("Error sending message:", error);

    // Check if it's a permissions error
    if (error.statusCode === 403) {
      return NextResponse.json(
        {
          message:
            "Permission denied. Please check your Sanity token permissions.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { message: "Failed to send message" },
      { status: 500 }
    );
  }
}
