import { auth } from "@/auth";
import { SanityLive } from "@/sanity/lib/live";
import Hero from "./components/Hero";
import AllListingsPage from "./all-listings/page";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (session) {
    redirect("/all-listings");
  }
  return (
    <div className="max-w-6xl mx-auto flex flex-col items-center font-[family-name:var(--font-geist)]">
      <Hero />
      <SanityLive />
    </div>
  );
}
