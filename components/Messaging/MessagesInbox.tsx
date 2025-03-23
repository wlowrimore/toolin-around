// "use client";

// import React, { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { formatDistanceToNow } from "date-fns";
// import ConversationView from "./ConversationView";
// import Image from "next/image";
// import { LoadingBar } from "../LoadingAnimations";
// import { Checkbox } from "@radix-ui/react-checkbox";
// import DeleteMsgForm from "../Forms/DeleteMsgForm";

// export interface Conversation {
//   _id: string;
//   participants: any[];
//   lastMessage: any;
//   lastMessageAt: string;
//   subject: string;
//   unreadCount: number;
// }

// export interface DeletedMessage {
//   _id: string;
//   sender: {
//     _id: string;
//     name: string;
//     image: string;
//   };
//   recipient: {
//     _id: string;
//     name: string;
//   };
//   text: string;
//   createdAt: string;
//   onDeleteMessage: () => void;
// }

// const MessagesInbox = () => {
//   const { data: session, status } = useSession();
//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedConversationId, setSelectedConversationId] = useState<
//     string | null
//   >(null);

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

//   useEffect(() => {
//     fetchConversations();
//   }, [session?.user?.id, status]);

//   const handleConversationSelect = async (conversationId: string) => {
//     // Log the exact URL and payload
//     const url = "/api/conversations/mark-read";
//     const payload = { conversationId, userId: session?.user?.id };

//     console.log("Sending request to:", url);
//     console.log("With payload:", payload);

//     try {
//       const response = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       console.log("Response status:", response.status);
//       console.log("Response headers:", [...response.headers.entries()]);

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error(`Error response (${response.status}):`, errorText);
//         throw new Error(
//           `${response.status} ${response.statusText}: ${errorText}`
//         );
//       }

//       const data = await response.json();
//       console.log("Response data:", data);

//       setSelectedConversationId(conversationId);
//     } catch (error) {
//       console.error("Request failed:", error);
//       // Error handling...
//     }
//   };

//   const handleBackFromConversation = () => {
//     setSelectedConversationId(null);
//     fetchConversations(); // Refresh conversations when returning to inbox
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
//       ) : conversations?.length === 0 ? (
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
//               // <main className='flex items-center gap-2'>
//               //   <div className=''>

//               //   </div>
//               <div
//                 key={conversation._id}
//                 onClick={(e) => handleConversationSelect(conversation._id)}
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
//                 <div className="absolute z-150 top-12 right-4 bg-cyan-800/60 border-black w-4 h-4">
//                   <DeleteMsgForm />
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
//               // </main>
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
import { LoadingBar, LoadingSpinnerWhite } from "../LoadingAnimations";
import { Checkbox } from "@/components/ui/checkbox";
import DeleteMsgForm from "../Forms/DeleteMsgForm";
import { Button } from "@/components/ui/button";
import { CheckIcon, Trash2Icon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export interface Conversation {
  _id: string;
  participants: any[];
  lastMessage: any;
  lastMessageAt: string;
  subject: string;
  unreadCount: number;
}

export interface DeletedMessage {
  _id: string;
  sender: {
    _id: string;
    name: string;
    image: string;
  };
  recipient: {
    _id: string;
    name: string;
  };
  text: string;
  createdAt: string;
  onDeleteMessage: () => void;
}

const MessagesInbox = () => {
  const { data: session, status } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
    // If we're in delete mode, don't navigate to conversation
    if (isDeleteMode) {
      return;
    }

    // Log the exact URL and payload
    const url = "/api/conversations/mark-read";
    const payload = { conversationId, userId: session?.user?.id };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `${response.status} ${response.statusText}: ${errorText}`
        );
      }

      setSelectedConversationId(conversationId);
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  const handleBackFromConversation = () => {
    setSelectedConversationId(null);
    fetchConversations(); // Refresh conversations when returning to inbox
  };

  const toggleSelectMessage = (messageId: string) => {
    setSelectedMessages((prev) =>
      prev.includes(messageId)
        ? prev.filter((id) => id !== messageId)
        : [...prev, messageId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedMessages.length === conversations.length) {
      // If all are selected, unselect all
      setSelectedMessages([]);
    } else {
      // Otherwise select all
      setSelectedMessages(conversations.map((conv) => conv._id));
    }
  };

  const toggleDeleteMode = () => {
    if (isDeleteMode) {
      // Exit delete mode and clear selections
      setSelectedMessages([]);
    }
    setIsDeleteMode(!isDeleteMode);
  };

  const deleteSelectedMessages = async () => {
    if (selectedMessages.length === 0) return;

    try {
      setIsDeleting(true);

      // For single deletions, use messageId parameter
      if (selectedMessages.length === 1) {
        const response = await fetch("/api/conversations/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messageId: selectedMessages[0] }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete message");
        }

        toast({
          title: "Success",
          variant: "success",
          description: "Message deleted successfully",
        });
      }
      // For bulk deletions, use messageIds parameter
      else {
        const response = await fetch("/api/conversations/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messageIds: selectedMessages }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete messages");
        }

        const result = await response.json();

        if (result.failCount > 0) {
          toast({
            title: "Partial Success",
            description: `Deleted ${result.successCount} messages, but ${result.failCount} failed.`,
            variant: "default",
          });
        } else {
          toast({
            title: "Success",
            description: `${selectedMessages.length} messages deleted successfully`,
          });
        }
      }

      // Clear selections
      setSelectedMessages([]);

      // Refresh the conversation list
      fetchConversations();
    } catch (error) {
      console.error("Error deleting messages:", error);
      toast({
        title: "Error",
        description: String(error) || "Failed to delete messages",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center p-8">
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

  const handleMessageDeleted = (success: boolean) => {
    if (success) {
      fetchConversations();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {conversations?.length > 0 && (
        <div className="flex justify-between items-center mb-4">
          <Button
            variant={isDeleteMode ? "destructive" : "outline"}
            onClick={toggleDeleteMode}
            className="flex items-center gap-2"
          >
            <Trash2Icon size={16} />
            {isDeleteMode ? "Cancel" : "Delete Messages"}
          </Button>

          {isDeleteMode && (
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Checkbox
                  id="select-all"
                  checked={
                    selectedMessages.length === conversations.length &&
                    conversations.length > 0
                  }
                  onCheckedChange={toggleSelectAll}
                  className="mr-2 w-4 h-4"
                />
                <label htmlFor="select-all" className="text-sm cursor-pointer">
                  Select All
                </label>
              </div>

              <Button
                variant="destructive"
                onClick={deleteSelectedMessages}
                disabled={selectedMessages.length === 0 || isDeleting}
                className="flex items-center gap-2"
              >
                <Trash2Icon size={16} />
                {isDeleting ? (
                  <span className="flex items-center gap-2">
                    <LoadingSpinnerWhite />
                    <span>Deleting...</span>
                  </span>
                ) : (
                  <span>Delete</span>
                )}
                {selectedMessages.length > 0
                  ? `(${selectedMessages.length})`
                  : ""}
              </Button>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center mt-3">
          <LoadingBar />
        </div>
      ) : conversations?.length === 0 ? (
        <div className="text-center py-8 border rounded-lg">
          <p className="text-gray-500">You have no messages at this time.</p>
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
                onClick={(e) => {
                  // Only handle conversation selection if we didn't click on a checkbox
                  if (
                    !(e.target as HTMLElement).closest(
                      'button, [role="checkbox"]'
                    )
                  ) {
                    handleConversationSelect(conversation._id);
                  }
                }}
                className={`relative p-4 hover:bg-sky-50 hover:shadow-md shadow-cyan-800 cursor-pointer grid grid-cols-7 ${
                  selectedMessages.includes(conversation._id)
                    ? "bg-sky-100"
                    : ""
                }`}
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

                {isDeleteMode && (
                  <div
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DeleteMsgForm
                      messageId={conversation._id}
                      onDelete={handleMessageDeleted}
                      // isChecked={selectedMessages.includes(conversation._id)}
                      // onToggleSelect={toggleSelectMessage}
                    />
                  </div>
                )}

                <div
                  className={`flex items-center col-span-2 ${isDeleteMode ? "pl-8" : ""}`}
                >
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
