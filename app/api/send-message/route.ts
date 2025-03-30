import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

type Message = {
  content: string;
  recipientId: string;
  listingId: string;
  senderId: string;
  conversationId: string;
};

type Error = {
  message: string;
  status: number;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, recipientId, listingId, senderId, conversationId } = body;

    console.log("SENDERID", senderId);

    // Validate required fields
    if (!content || !recipientId || !listingId || !senderId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const [recipientExists, listingExists] = await Promise.all([
      // client.fetch('*[_type == "user" && _id == $id][0]', { id: senderId }),
      client.fetch('*[_type == "author" && _id == $id][0]', {
        id: recipientId,
      }),
      client.fetch('*[_type == "listing" && _id == $id][0]', { id: listingId }),
    ]);

    // console.log("Sender Exists:", senderExists);
    console.log("Recipient Exists:", recipientExists);
    console.log("Listing Exists:", listingExists);

    if (!recipientExists || !listingExists) {
      return NextResponse.json(
        { message: "One or more referenced documents do not exist" },
        { status: 400 }
      );
    }

    let conversation;

    if (conversationId) {
      const existingConversation = await client.fetch(
        `*[_type == "conversation" && _id == $id && $senderId in participants[]._ref][0]`,
        { id: conversationId, senderId }
      );

      if (!existingConversation) {
        return NextResponse.json(
          { message: "Conversation not found or you're not a participant" },
          { status: 404 }
        );
      }

      conversation = existingConversation;
    } else {
      const existingConversation = await client.fetch(
        `*[_type == "conversation" && $senderId in participants[]._ref && $recipientId in participants[]._ref && listing._ref == $listingId][0]`,
        { senderId, recipientId, listingId }
      );

      if (existingConversation) {
        conversation = existingConversation;
      } else {
        const listing = await client.fetch(
          `*[_type == "listing" && _id == $id][0]`,
          { id: listingId }
        );

        const newConversation = await client.create({
          _type: "conversation",
          subject: `Re: ${listing.title || "Listing"}`,
          participants: [
            {
              _type: "reference",
              _ref: senderId,
            },
            {
              _type: "reference",
              _ref: recipientId,
            },
          ],
          listing: {
            _type: "reference",
            _ref: listingId,
          },
          lastMessageAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        });

        conversation = newConversation;
      }
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
      conversation: {
        _type: "reference",
        _ref: conversation._id,
      },
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    await client
      .patch(conversation._id)
      .set({ lastMessageAt: new Date().toISOString() })
      .commit();

    return NextResponse.json(
      {
        message: "Message sent successfully",
        data: message,
        conversation: conversation,
      },
      { status: 200 }
    );
  } catch (error: Error | any) {
    console.error("Error sending message:", error);

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
