import { auth } from "@/auth";
import { NextStudio } from "next-sanity/studio";
import { redirect } from "next/navigation";
import config from "../../../sanity.config";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return <NextStudio config={config} />;
}
