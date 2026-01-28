"use client";

import { useState } from "react";
import { ChatProvider } from "@/lib/ChatContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Chat from "./Chat";

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <ChatProvider>
      <div className="flex h-screen bg-[#f7f8f9] overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        <div className="flex-1 flex flex-col min-w-0 h-screen">
          <Header sidebarOpen={sidebarOpen} onToggle={toggleSidebar} />
          <div className="flex-1 overflow-hidden">
            <Chat />
          </div>
        </div>
      </div>
    </ChatProvider>
  );
}
