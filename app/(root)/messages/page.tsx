import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";
import MessagesDisplay from "@/components/MessagesDisplay";
import { redirect } from "next/navigation";

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
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      <MessagesDisplay initialMessages={messages} userId={session.user.id} />
    </div>
  );
}
