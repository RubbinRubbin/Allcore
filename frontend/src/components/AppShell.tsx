"use client";

import { useState } from "react";
import { ChatProvider } from "@/lib/ChatContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Chat from "./Chat";

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <ChatProvider>
      <div className="flex h-screen bg-[#f7f8f9]">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            onMenuToggle={() => setSidebarOpen((prev) => !prev)}
            sidebarOpen={sidebarOpen}
          />
          <Chat />
        </div>
      </div>
    </ChatProvider>
  );
}
