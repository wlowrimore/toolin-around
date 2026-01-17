import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";
// import MessagesDisplay from "@/components/MessagesDisplay";
import { redirect } from "next/navigation";
import { Rss } from "lucide-react";
import ConversationView from "@/app/(root)/components/Messaging/ConversationView";
import MessagesInbox from "@/app/(root)/components/Messaging/MessagesInbox";

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
    <div className="min-h-[80vh] overflow-y-auto max-w-[77rem] rounded-xl bg-slate-300 border-2 border-slate-700/10 shadow-md shadow-cyan-900 mx-auto px-5 py-12 my-10">
      <h1 className="flex items-center gap-2 text-3xl font-bold mb-6 px-3">
        <span className="text-green-700">
          <Rss />
        </span>
        Messages Inbox
      </h1>
      <MessagesInbox />
    </div>
  );
}
