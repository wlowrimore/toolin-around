import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { auth } from "@/auth";

export async function GET(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;
    const session = await auth();
    const author = await client.fetch(`*[_type == 'author' && _id == $id]`, {
      id,
    });

    console.log("AUTHOR IN SERVER:", author);
    console.log("SESSION IN SERVER:", session);

    if (
      author === session?.user?.id ||
      author === `author-${session?.user?.email}`
    ) {
      const sender = author[0];
      return NextResponse.json(sender);
    } else {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error fetching sender data:", error);
    return NextResponse.json(
      { error: "Failed to fetch sender data" },
      { status: 500 }
    );
  }
}
