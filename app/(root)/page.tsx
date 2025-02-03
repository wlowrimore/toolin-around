import { SanityLive } from "@/sanity/lib/live";
import Hero from "../../components/Hero";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto flex flex-col items-center font-[family-name:var(--font-poppins)]">
      <Hero />
      <SanityLive />
    </div>
  );
}
