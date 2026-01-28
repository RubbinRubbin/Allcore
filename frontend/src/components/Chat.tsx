"use client";

import { useRef, useEffect, useMemo } from "react";
import Message, { TypingIndicator } from "./Message";
import InputBar from "./InputBar";
import { sendMessage, generateChatTitle } from "@/lib/api";
import { useChatContext, SUGGESTIONS } from "@/lib/ChatContext";

export default function Chat() {
  const { state, dispatch, activeChat } = useChatContext();
  const { isLoading, streamingContent } = state;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const titleGenerationStarted = useRef(false);

  const messages = useMemo(
    () => activeChat?.messages || [],
    [activeChat?.messages]
  );

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  // Reset title generation flag when active chat changes
  useEffect(() => {
    titleGenerationStarted.current = false;
  }, [activeChat?.id]);

  const handleSend = async (content: string) => {
    if (!activeChat) return;

    const chatId = activeChat.id;
    const shouldGenerateTitle =
      activeChat.title === "Nuova chat" && messages.length === 1;

    // Add user message
    dispatch({
      type: "ADD_MESSAGE",
      chatId,
      message: { role: "user", content },
    });
    dispatch({ type: "SET_LOADING", isLoading: true });
    dispatch({ type: "SET_STREAMING", content: "" });

    const messagesForApi = [...messages, { role: "user" as const, content }];

    try {
      let fullResponse = "";

      await sendMessage(messagesForApi, (chunk) => {
        fullResponse += chunk;
        dispatch({ type: "SET_STREAMING", content: fullResponse });

        // Generate title during streaming (after ~50 chars of response)
        if (
          shouldGenerateTitle &&
          !titleGenerationStarted.current &&
          fullResponse.length > 50
        ) {
          titleGenerationStarted.current = true;
          generateChatTitle(content, fullResponse)
            .then((title) => {
              dispatch({ type: "SET_TITLE", chatId, title });
            })
            .catch(console.error);
        }
      });

      // Add complete assistant message
      dispatch({
        type: "ADD_MESSAGE",
        chatId,
        message: { role: "assistant", content: fullResponse },
      });
    } catch (error) {
      console.error("Chat error:", error);
      dispatch({
        type: "ADD_MESSAGE",
        chatId,
        message: {
          role: "assistant",
          content:
            "Mi scuso, si è verificato un errore. Riprova tra qualche istante o contatta il supporto Allcore.",
        },
      });
    } finally {
      dispatch({ type: "SET_LOADING", isLoading: false });
      dispatch({ type: "SET_STREAMING", content: "" });
    }
  };

  const handleSuggestion = (suggestion: string) => {
    if (!isLoading) {
      handleSend(suggestion);
    }
  };

  // Don't render until hydrated
  if (!state.hydrated) {
    return (
      <div className="flex flex-col flex-1">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#1e73be] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {messages.map((message, index) => (
            <Message key={index} role={message.role} content={message.content} />
          ))}

          {/* Streaming message */}
          {isLoading && streamingContent && (
            <Message role="assistant" content={streamingContent} isStreaming={true} />
          )}

          {/* Typing indicator */}
          {isLoading && !streamingContent && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <InputBar
        onSend={handleSend}
        disabled={isLoading}
        suggestions={messages.length === 1 && !isLoading ? SUGGESTIONS : []}
        onSuggestion={handleSuggestion}
      />
    </div>
  );
}
