import React from "react";
import Image from "next/image";
import { Search, UserCircle, MessageCircle } from "lucide-react";
import { SearchModal } from "../SearchModal";

const Header = () => {
  return (
    <div className="bg-sky-900 text-slate-400">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-2">
            <Image
              src="/logos/headerLogo.png"
              alt="Tooling Around Logo"
              width={1000}
              height={1000}
              className="w-64 h-auto"
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-8 text-xl">
            <SearchModal />
            <button className="flex items-center hover:text-blue-200">
              <MessageCircle className="h-5 w-5 -mr-1" />
              <span className="relative z-20 bottom-2 right-1 w-2 h-2 bg-green-300 rounded-full"></span>
              <span>Messages</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-blue-200">
              <UserCircle className="h-5 w-5" />
              <span>Profile</span>
            </button>
            <button className="bg-white/70 text-slate-700 px-4 py-2 hover:bg-blue-50">
              List a Tool
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
