"use client";

interface HeaderProps {
  onMenuToggle?: () => void;
  sidebarOpen?: boolean;
}

export default function Header({ onMenuToggle, sidebarOpen }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
      <div className="flex items-center gap-3">
        {/* Sidebar toggle button */}
        <button
          onClick={onMenuToggle}
          className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={sidebarOpen ? "Chiudi sidebar" : "Apri sidebar"}
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {sidebarOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Allcore Logo - Chat Bubble */}
        <div className="w-10 h-10 bg-[#1e73be] rounded-lg flex items-center justify-center">
          <svg
            className="w-6 h-6 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Assistente Fiscale
          </h1>
          <p className="text-sm text-gray-500">
            Allcore Spa - Consulenza per PMI
          </p>
        </div>
      </div>
    </header>
  );
}
