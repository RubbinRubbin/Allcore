"use client";

import { useChatContext } from "@/lib/ChatContext";
import { ChatSession } from "@/lib/types";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

function getDateGroup(timestamp: number): string {
  const now = new Date();
  const date = new Date(timestamp);

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  if (date >= today) return "Oggi";
  if (date >= yesterday) return "Ieri";
  if (date >= weekAgo) return "Ultimi 7 giorni";
  return "Precedenti";
}

function groupChatsByDate(chats: ChatSession[]): Map<string, ChatSession[]> {
  const groups = new Map<string, ChatSession[]>();
  const order = ["Oggi", "Ieri", "Ultimi 7 giorni", "Precedenti"];

  for (const group of order) {
    groups.set(group, []);
  }

  for (const chat of chats) {
    const group = getDateGroup(chat.updatedAt);
    groups.get(group)!.push(chat);
  }

  return groups;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { state, dispatch, activeChat } = useChatContext();
  const { sessions, isLoading } = state;

  const handleNewChat = () => {
    dispatch({ type: "CREATE_CHAT" });
  };

  const handleSelectChat = (chatId: string) => {
    if (isLoading) return;
    dispatch({ type: "SET_ACTIVE_CHAT", chatId });
  };

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    if (isLoading) return;
    if (confirm("Eliminare questa chat?")) {
      dispatch({ type: "DELETE_CHAT", chatId });
    }
  };

  const groupedChats = groupChatsByDate(sessions);

  return (
    <>
      {/* Backdrop (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden transition-opacity duration-300"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative inset-y-0 left-0 z-40 w-56 bg-white border-r border-gray-200
          transform transition-all duration-300 ease-in-out overflow-hidden
          ${isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 md:w-0 md:border-0 md:pointer-events-none"}
        `}
      >
        <div className="flex flex-col h-full w-56">
          {/* Header - same height as main header (57px) */}
          <div className="flex items-center justify-between px-3 h-[57px] border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-[#1e73be] rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                </svg>
              </div>
              <span className="font-semibold text-gray-900">Chat</span>
            </div>
            {/* Close button */}
            <button
              onClick={onToggle}
              className="p-2 -mr-1 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Chiudi sidebar"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7"
                />
              </svg>
            </button>
          </div>

          {/* New Chat Button */}
          <div className="p-3">
            <button
              onClick={handleNewChat}
              disabled={isLoading}
              className={`
                w-full flex items-center justify-center gap-2 px-3 py-2.5
                bg-[#1e73be] text-white rounded-lg font-medium text-sm
                transition-all
                ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#1a5fa0] active:scale-[0.98]"}
              `}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Nuova Chat
            </button>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto px-2">
            {Array.from(groupedChats.entries()).map(([group, chats]) => {
              if (chats.length === 0) return null;
              return (
                <div key={group} className="mb-3">
                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {group}
                  </div>
                  <div className="space-y-0.5">
                    {chats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => handleSelectChat(chat.id)}
                        className={`
                          group flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer
                          transition-colors
                          ${isLoading ? "pointer-events-none opacity-50" : ""}
                          ${
                            activeChat?.id === chat.id
                              ? "bg-[#1e73be]/10 text-[#1e73be] border-l-2 border-[#1e73be]"
                              : "hover:bg-gray-50 text-gray-700"
                          }
                        `}
                      >
                        <svg
                          className={`w-3.5 h-3.5 flex-shrink-0 ${
                            activeChat?.id === chat.id
                              ? "text-[#1e73be]"
                              : "text-gray-400"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        <span className="flex-1 text-xs truncate">
                          {chat.title}
                        </span>
                        <button
                          onClick={(e) => handleDeleteChat(e, chat.id)}
                          className={`
                            p-1 rounded opacity-0 group-hover:opacity-100
                            text-gray-400 hover:text-red-500 hover:bg-red-50
                            transition-all
                            ${isLoading ? "hidden" : ""}
                          `}
                          aria-label="Elimina chat"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}
