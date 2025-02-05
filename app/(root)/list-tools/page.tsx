import ListToolsForm from "@/components/Forms/ListToolsForm";
import React from "react";

const ListTools = () => {
  return (
    <main className="max-w-6xl mx-auto flex flex-col items-center font-[family-name:var(--font-poppins)]">
      <ListToolsForm authorEmail="example@example.com" />
    </main>
  );
};

export default ListTools;
