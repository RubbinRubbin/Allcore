"use client";

interface HeaderProps {
  sidebarOpen: boolean;
  onToggle: () => void;
}

export default function Header({ sidebarOpen, onToggle }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-3 py-3 flex-shrink-0 h-[57px]">
      <div className="flex items-center gap-3 h-full">
        {/* Toggle button - only visible when sidebar is closed */}
        <button
          onClick={onToggle}
          className={`
            p-2 rounded-lg hover:bg-gray-100 transition-all duration-300
            ${sidebarOpen ? "w-0 opacity-0 overflow-hidden p-0" : "opacity-100"}
          `}
          aria-label="Apri sidebar"
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Allcore Logo - Chat Bubble */}
        <div className="w-9 h-9 bg-[#1e73be] rounded-lg flex items-center justify-center flex-shrink-0">
          <svg
            className="w-5 h-5 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            Assistente Fiscale
          </h1>
          <p className="text-xs text-gray-500">
            Allcore Spa - Consulenza per PMI
          </p>
        </div>
      </div>
    </header>
  );
}
