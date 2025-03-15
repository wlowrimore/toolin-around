// "use client";

// import React, { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { formatDistanceToNow } from "date-fns";
// import ConversationView from "./ConversationView";
// import Image from "next/image";
// import { LoadingBar } from "../LoadingAnimations";

// export interface Conversation {
//   _id: string;
//   participants: any[];
//   lastMessage: any;
//   lastMessageAt: string;
//   subject: string;
//   unreadCount: number;
// }

// const MessagesInbox = () => {
//   const { data: session, status } = useSession();
//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedConversationId, setSelectedConversationId] = useState<
//     string | null
//   >(null);

//   useEffect(() => {
//     const fetchConversations = async () => {
//       if (status !== "authenticated" || !session?.user?.id) return;

//       try {
//         setLoading(true);
//         const response = await fetch(
//           `/api/conversations?userId=${session.user.id}`
//         );

//         if (!response.ok) {
//           throw new Error("Failed to fetch conversations");
//         }

//         const data = await response.json();
//         setConversations(data.conversations);
//       } catch (error) {
//         console.error("Error fetching conversations:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchConversations();
//   }, [session?.user?.id, status]);

//   const handleConversationSelect = async (conversationId: string) => {
//     setConversations((prevConversations) =>
//       prevConversations.map((conv) =>
//         conv._id === conversationId ? { ...conv, unreadCount: 0 } : conv
//       )
//     );

//     setSelectedConversationId(conversationId);
//     console.log("SELECTEDCONVERSATIONID: ", selectedConversationId);

//     if (status === "loading") {
//       return (
//         <div className="flex flex-col items-center justify-center p-8">
//           <p>Loading...</p>
//           <LoadingBar />
//         </div>
//       );
//     }

//     if (status === "unauthenticated") {
//       return (
//         <div className="p-8 text-center">
//           <p>You must be signed in to view your messages.</p>
//         </div>
//       );
//     }

//     if (status === "authenticated" && session?.user?.id) {
//       try {
//         const response = await fetch("/api/conversations/mark-read", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             conversationId,
//             userId: session.user.id,
//           }),
//         });

//         if (!response.ok) {
//           console.error("Failed to mark conversation as read");
//         }
//       } catch (error) {
//         console.error("Error marking conversation as read:", error);
//       }
//     }
//   };

//   const handleBackFromConversation = () => {
//     // Refresh conversations when returning to inbox
//     setSelectedConversationId(null);
//     if (status === "authenticated" && session?.user?.id) {
//       fetchConversations();
//     }
//   };

//   const fetchConversations = async () => {
//     if (status !== "authenticated" || !session?.user?.id) return;

//     try {
//       setLoading(true);
//       const response = await fetch(
//         `/api/conversations?userId=${session.user.id}`
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch conversations");
//       }

//       const data = await response.json();
//       setConversations(data.conversations);
//     } catch (error) {
//       console.error("Error fetching conversations:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (status === "loading") {
//     return (
//       <div className="flex flex-col items-center justify-center p-8">
//         <p>Loading...</p>
//         <LoadingBar />
//       </div>
//     );
//   }

//   if (status === "unauthenticated") {
//     return (
//       <div className="p-8 text-center">
//         <p>You must be signed in to view your messages.</p>
//       </div>
//     );
//   }

//   if (selectedConversationId) {
//     const selectedConversation = conversations.find(
//       (conv) => conv._id === selectedConversationId
//     );

//     return (
//       <ConversationView
//         conversationId={selectedConversationId}
//         onBack={handleBackFromConversation}
//         participants={selectedConversation?.participants || []}
//         listing={{ _id: "", title: "", image: "" }}
//         subject={selectedConversation?.subject || ""}
//         _id={selectedConversationId}
//       />
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-4">
//       {loading ? (
//         <div className="flex flex-col items-center justify-center py-8">
//           <p>Loading conversations...</p>
//           <LoadingBar />
//         </div>
//       ) : conversations.length === 0 ? (
//         <div className="text-center py-8 border rounded-lg">
//           <p className="text-gray-500">You don't have any messages yet.</p>
//         </div>
//       ) : (
//         <div className="divide-y">
//           {conversations.map((conversation) => {
//             // Find the other participant
//             const otherParticipant = conversation.participants.find(
//               (p) => p._id !== session?.user.id
//             );

//             // Get the last message
//             const lastMessage = conversation.lastMessage;

//             // Count unread messages
//             const unreadCount = conversation.unreadCount || 0;

//             return (
//               <div
//                 key={conversation._id}
//                 onClick={() => handleConversationSelect(conversation._id)}
//                 className="relative p-4 hover:bg-sky-50 hover:shadow-md shadow-cyan-800 cursor-pointer grid grid-cols-7"
//               >
//                 <div className="absolute left-[-0.6rem] top-[-0.6rem]">
//                   {unreadCount > 0 && (
//                     <div className="flex justify-end w-full">
//                       <span className="bg-cyan-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                         {unreadCount}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//                 <div className="flex items-center col-span-2">
//                   <div className="mr-3">
//                     <Image
//                       src={otherParticipant?.image as string}
//                       alt={otherParticipant?.name || "User"}
//                       width={500}
//                       height={500}
//                       className="w-12 h-12 rounded-full object-cover"
//                     />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="flex justify-between items-baseline">
//                       <h3 className="font-medium truncate">
//                         {conversation.subject}
//                       </h3>
//                     </div>
//                     <p className="text-sm text-gray-600 truncate">
//                       {otherParticipant?.name || "Unknown user"}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="col-span-3 text-center">
//                   {lastMessage && (
//                     <p className="text-sm text-gray-500 truncate">
//                       {lastMessage.content}
//                     </p>
//                   )}
//                 </div>
//                 <div className="col-span-2 text-right">
//                   <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
//                     {formatDistanceToNow(new Date(conversation.lastMessageAt), {
//                       addSuffix: true,
//                     })}
//                   </span>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MessagesInbox;

"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import ConversationView from "./ConversationView";
import Image from "next/image";
import { LoadingBar } from "../LoadingAnimations";

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

  useEffect(() => {
    fetchConversations();
  }, [session?.user?.id, status]);

  const handleConversationSelect = async (conversationId: string) => {
    // Log the exact URL and payload
    const url = "/api/conversations/mark-read";
    const payload = { conversationId, userId: session?.user?.id };

    console.log("Sending request to:", url);
    console.log("With payload:", payload);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", [...response.headers.entries()]);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error response (${response.status}):`, errorText);
        throw new Error(
          `${response.status} ${response.statusText}: ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Response data:", data);

      setSelectedConversationId(conversationId);
    } catch (error) {
      console.error("Request failed:", error);
      // Error handling...
    }
  };

  const handleBackFromConversation = () => {
    setSelectedConversationId(null);
    fetchConversations(); // Refresh conversations when returning to inbox
  };

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p>Loading...</p>
        <LoadingBar />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="p-8 text-center">
        <p>You must be signed in to view your messages.</p>
      </div>
    );
  }

  if (selectedConversationId) {
    const selectedConversation = conversations.find(
      (conv) => conv._id === selectedConversationId
    );

    return (
      <ConversationView
        conversationId={selectedConversationId}
        onBack={handleBackFromConversation}
        participants={selectedConversation?.participants || []}
        listing={{ _id: "", title: "", image: "" }}
        subject={selectedConversation?.subject || ""}
        _id={selectedConversationId}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <p>Loading conversations...</p>
          <LoadingBar />
        </div>
      ) : conversations?.length === 0 ? (
        <div className="text-center py-8 border rounded-lg">
          <p className="text-gray-500">You don't have any messages yet.</p>
        </div>
      ) : (
        <div className="divide-y">
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
                onClick={(e) => handleConversationSelect(conversation._id)}
                className="relative p-4 hover:bg-sky-50 hover:shadow-md shadow-cyan-800 cursor-pointer grid grid-cols-7"
              >
                <div className="absolute left-[-0.6rem] top-[-0.6rem]">
                  {unreadCount > 0 && (
                    <div className="flex justify-end w-full">
                      <span className="bg-cyan-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center col-span-2">
                  <div className="mr-3">
                    <Image
                      src={otherParticipant?.image as string}
                      alt={otherParticipant?.name || "User"}
                      width={500}
                      height={500}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-medium truncate">
                        {conversation.subject}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {otherParticipant?.name || "Unknown user"}
                    </p>
                  </div>
                </div>
                <div className="col-span-3 text-center">
                  {lastMessage && (
                    <p className="text-sm text-gray-500 truncate">
                      {lastMessage.content}
                    </p>
                  )}
                </div>
                <div className="col-span-2 text-right">
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {formatDistanceToNow(new Date(conversation.lastMessageAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MessagesInbox;
