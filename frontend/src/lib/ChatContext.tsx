"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { ChatSession, Message } from "./types";
import { loadChats, saveChats } from "./storage";

export const WELCOME_MESSAGE = `Buongiorno! Sono l'assistente fiscale virtuale di Allcore Spa. Come posso esserti utile oggi?`;

export const SUGGESTIONS = [
  "Posso dedurre l'auto aziendale?",
  "Quali sono i requisiti per il regime forfettario?",
  "Scadenze fiscali di febbraio",
  "Come funzionano i crediti d'imposta 4.0?",
];

interface ChatState {
  sessions: ChatSession[];
  activeChatId: string | null;
  isLoading: boolean;
  streamingContent: string;
  hydrated: boolean;
}

type ChatAction =
  | { type: "LOAD_FROM_STORAGE"; sessions: ChatSession[] }
  | { type: "CREATE_CHAT" }
  | { type: "DELETE_CHAT"; chatId: string }
  | { type: "SET_ACTIVE_CHAT"; chatId: string }
  | { type: "ADD_MESSAGE"; chatId: string; message: Message }
  | { type: "SET_TITLE"; chatId: string; title: string }
  | { type: "SET_LOADING"; isLoading: boolean }
  | { type: "SET_STREAMING"; content: string };

function createNewChat(): ChatSession {
  return {
    id: crypto.randomUUID(),
    title: "Nuova chat",
    messages: [{ role: "assistant", content: WELCOME_MESSAGE }],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "LOAD_FROM_STORAGE": {
      if (action.sessions.length === 0) {
        const newChat = createNewChat();
        return {
          ...state,
          sessions: [newChat],
          activeChatId: newChat.id,
          hydrated: true,
        };
      }
      return {
        ...state,
        sessions: action.sessions,
        activeChatId: action.sessions[0].id,
        hydrated: true,
      };
    }

    case "CREATE_CHAT": {
      const newChat = createNewChat();
      return {
        ...state,
        sessions: [newChat, ...state.sessions],
        activeChatId: newChat.id,
      };
    }

    case "DELETE_CHAT": {
      const filtered = state.sessions.filter((s) => s.id !== action.chatId);
      if (filtered.length === 0) {
        const newChat = createNewChat();
        return {
          ...state,
          sessions: [newChat],
          activeChatId: newChat.id,
        };
      }
      const newActiveId =
        state.activeChatId === action.chatId
          ? filtered[0].id
          : state.activeChatId;
      return {
        ...state,
        sessions: filtered,
        activeChatId: newActiveId,
      };
    }

    case "SET_ACTIVE_CHAT": {
      return {
        ...state,
        activeChatId: action.chatId,
      };
    }

    case "ADD_MESSAGE": {
      return {
        ...state,
        sessions: state.sessions.map((s) =>
          s.id === action.chatId
            ? {
                ...s,
                messages: [...s.messages, action.message],
                updatedAt: Date.now(),
              }
            : s
        ),
      };
    }

    case "SET_TITLE": {
      return {
        ...state,
        sessions: state.sessions.map((s) =>
          s.id === action.chatId ? { ...s, title: action.title } : s
        ),
      };
    }

    case "SET_LOADING": {
      return {
        ...state,
        isLoading: action.isLoading,
      };
    }

    case "SET_STREAMING": {
      return {
        ...state,
        streamingContent: action.content,
      };
    }

    default:
      return state;
  }
}

interface ChatContextValue {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  activeChat: ChatSession | null;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, {
    sessions: [],
    activeChatId: null,
    isLoading: false,
    streamingContent: "",
    hydrated: false,
  });

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = loadChats();
    dispatch({ type: "LOAD_FROM_STORAGE", sessions: stored });
  }, []);

  // Save to localStorage when sessions change and not loading
  useEffect(() => {
    if (!state.hydrated || state.isLoading) return;
    saveChats(state.sessions);
  }, [state.sessions, state.hydrated, state.isLoading]);

  const activeChat =
    state.sessions.find((s) => s.id === state.activeChatId) || null;

  return (
    <ChatContext.Provider value={{ state, dispatch, activeChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}
