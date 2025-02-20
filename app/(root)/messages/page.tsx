import MessageForm from "@/components/Forms/MessageForm";
import MessagesDisplay from "@/components/MessagesDisplay";
import React from "react";

const MessagesPage = () => {
  return (
    <main className="max-w-6xl mx-auto flex flex-col items-center font-[family-name:var(--font-poppins)]">
      <MessagesDisplay />
    </main>
  );
};

export default MessagesPage;
