import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";
// import MessagesDisplay from "@/components/MessagesDisplay";
import { redirect } from "next/navigation";
import { Rss } from "lucide-react";
import ConversationView from "@/components/Messaging/ConversationView";
import MessagesInbox from "@/components/Messaging/MessagesInbox";

async function getMessages(userId: string) {
  const query = `*[_type == "message" && (recipient._ref == $userId || sender._ref == $userId)] | order(createdAt desc) {
    _id,
    content,
    createdAt,
    isRead,
    sender-> {
      _id,
      name,
      image
    },
    recipient-> {
      _id,
      name,
      image
    },
    listing-> {
      _id,
      title
    }
  }`;

  return client.fetch(query, { userId });
}

export default async function MessagesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const messages = await getMessages(session.user.id);

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      <h1 className="flex items-center gap-2 text-3xl font-bold mb-6">
        <span className="text-green-700">
          <Rss />
        </span>
        Messages Inbox
      </h1>
      <MessagesInbox />
    </div>
  );
}
