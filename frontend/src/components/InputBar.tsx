"use client";

import { useState, useRef, useEffect } from "react";

interface InputBarProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  suggestions?: string[];
  onSuggestion?: (suggestion: string) => void;
}

export default function InputBar({ onSend, disabled, suggestions = [], onSuggestion }: InputBarProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end gap-3 bg-[#f7f8f9] rounded-2xl px-4 py-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Scrivi una domanda fiscale..."
            disabled={disabled}
            rows={1}
            className="flex-1 bg-transparent resize-none outline-none text-gray-800 placeholder-gray-500 text-sm leading-relaxed max-h-[150px]"
          />
          <button
            onClick={handleSubmit}
            disabled={disabled || !input.trim()}
            className={`p-2 rounded-xl transition-all ${
              disabled || !input.trim()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#1e73be] text-white hover:bg-[#1a5fa0] active:scale-95"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
        {suggestions.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-3">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSuggestion?.(suggestion)}
                className="px-3 py-2 bg-[#f7f8f9] border border-gray-200 rounded-lg text-xs text-gray-600 hover:border-[#1e73be] hover:text-[#1e73be] transition-colors text-center"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
