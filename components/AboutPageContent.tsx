import { Suspense } from "react";
import { LoadingBar } from "./LoadingAnimations";

const AboutPageContent = () => {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen flex items-center mx-auto">
          <LoadingBar />
        </div>
      }
    >
      <main className="max-w-6xl mx-auto flex flex-col items-center font-[family-name:var(--font-poppins)] w-full my-10 px-6">
        <h1 className="text-slate-600 text-3xl font-semibold w-full">
          About Toolin' Around
        </h1>
        <h2 className="text-2xl text-slate-600 w-full mb-6">
          Aiming to bring the bartering system back to life through community
          sharing.
        </h2>
        <article className="font-normal">
          <p>
            Remember when neighborhoods were places where people knew each
            other? When borrowing a cup of sugar or a ladder from next door
            wasn't just a possibility—it was what neighbors did for one another?
          </p>
          <p>
            At Toolin' Around, we're bringing that spirit of community back, one
            tool at a time.
          </p>
          <br />
          <p>
            Toolin' Around was born from a simple observation: most of us have
            experienced that frustrating moment in the middle of a DIY project
            when we realize we need a specific tool we don't own. Maybe it's a
            power washer for that fence restoration, a tile cutter for your
            bathroom renovation, or simply a specialized wrench that you'll use
            exactly once. Why purchase expensive tools that will gather dust
            after a single use? Why let your own quality tools sit idle when
            they could be helping a neighbor complete their project? We created
            Toolin' Around as a solution to this common dilemma—a platform where
            DIY enthusiasts can connect, share resources, and build community
            around their shared passion for creating and fixing.
          </p>
        </article>
        <div className="mb-3 w-full">
          <h2 className="text-2xl mt-6 font-semibold text-slate-600 w-full">
            How It Works
          </h2>
          <h3 className="text-xl text-slate-600 w-full">
            &quot;Our platrom is remarkably simple...&quot;
          </h3>
        </div>
        <ul className="list-disc w-full ml-20 mb-6">
          <li>Sign up for free and create your profile</li>
          <li>
            List the tools you&apos;re willing to share with the community
          </li>
          <li>Browse available tools in your area when you need something</li>
          <li>Connect with tool owners through our secure messaging system</li>
          <li>Arrange pickups and returns that work for both parties</li>
          <li>Complete your projects with the right tools</li>
        </ul>
        <article>
          <p>
            Whether you're a weekend warrior tackling home improvements, an
            aspiring craftsperson learning new skills, or a seasoned DIY expert
            with a garage full of specialized equipment, Toolin' Around creates
            value for everyone involved.
          </p>
        </article>
        <div className="mb-3 w-full">
          <h2 className="text-2xl mt-6 font-semibold text-slate-600 w-full">
            Our Values
          </h2>
          <h3 className="text-xl text-slate-600 w-full">
            &quot;Community First...&quot;
          </h3>
          <p className="mt-3">
            We believe in the power of local connections. Every tool shared
            represents an opportunity to meet a neighbor and strengthen
            community bonds.
          </p>
          <h2 className="text-2xl mt-6 font-semibold text-slate-600 w-full">
            Sustainability
          </h2>
          <p className="mt-3">
            By sharing resources, we reduce unnecessary consumption and waste.
            One quality tool shared among many is better than multiple cheaper
            tools ending up in landfills.
          </p>
          <h2 className="text-2xl mt-6 font-semibold text-slate-600 w-full">
            Accessibility
          </h2>
          <p className="mt-3">
            DIY shouldn't be limited by your tool budget. We're democratizing
            access to quality tools so more people can experience the
            satisfaction of creating and fixing things themselves.
          </p>
          <h2 className="text-2xl mt-6 font-semibold text-slate-600 w-full">
            Knowledge Sharing
          </h2>
          <p className="mt-3">
            Beyond just tools, our community members often share tips, advice,
            and encouragement. Every connection made through Toolin' Around is
            an opportunity to learn something new.
          </p>
          <h2 className="text-2xl mt-6 font-semibold text-slate-600 w-full">
            Join Our Growing Community
          </h2>
          <p className="mt-3">
            Toolin' Around is more than just a tool-sharing platform—it's a
            movement back to the days when neighbors knew and helped each other.
            Whether you have tools to share or projects to complete, you'll find
            a welcoming community of like-minded DIY enthusiasts ready to
            connect.
          </p>
          <p className="mt-3">
            Sign up today and discover how much more you can accomplish when
            you're not limited by the tools you own. Experience firsthand how a
            simple tool exchange can blossom into meaningful community
            connections.
          </p>
          <p className="mt-3">
            After all, good neighbors don't just borrow cups of sugar—they share
            what they have to help each other thrive.
          </p>
        </div>
        <h5 className="text-2xl font-semibold text-slate-600 w-full italic mt-6">
          &quot;Toolin&apos; Around:&nbsp; Building projects together as a
          community...&quot;
        </h5>
      </main>
    </Suspense>
  );
};

export default AboutPageContent;
