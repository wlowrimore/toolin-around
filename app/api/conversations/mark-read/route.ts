// import { NextResponse } from "next/server";
// import { client } from "@/sanity/lib/client";

// export async function POST(request: Request) {
//   try {
//     const { messageId } = await request.json();

//     await client.patch(messageId).set({ isRead: true }).commit();

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Error marking message as read:", error);
//     return NextResponse.json(
//       { error: "Failed to mark message as read" },
//       { status: 500 }
//     );
//   }
// }

// import { NextResponse } from "next/server";
// import { client } from "@/sanity/lib/client";

// // For App Router
// export async function POST(request: Request) {
//   try {
//     const { conversationId, userId } = await request.json();

//     if (!conversationId || !userId) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     console.log("Marking conversation as read:", { conversationId, userId });

//     // Find all unread messages in this conversation where the recipient is the current user
//     const query = `*[_type == "message" &&
//                      conversation._ref == $conversationId &&
//                      recipient._ref == $userId &&
//                      isRead == false] {
//                       _id
//                     }`;

//     const unreadMessages = await client.fetch(query, {
//       conversationId,
//       userId,
//     });

//     console.log("Found unread messages:", unreadMessages.length);

//     // Mark all these messages as read in a transaction
//     const transaction = client.transaction();

//     unreadMessages.forEach((message: { _id: string }) => {
//       (transaction.patch(message._id) as any).set({ isRead: true });
//     });

//     await transaction.commit();

//     return NextResponse.json({
//       success: true,
//       markedAsRead: unreadMessages.length,
//     });
//   } catch (error) {
//     console.error("Error marking conversation as read:", error);
//     return NextResponse.json(
//       { error: "Failed to mark conversation as read" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function POST(request: Request) {
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
    const unreadMessages = await client.fetch(query, {
      conversationId,
      userId,
    });

    unreadMessages.forEach((message: { _id: string }) => {
      transaction.patch(message._id, (patch) => patch.set({ isRead: true })); // Correct usage
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
