"use client";

import { useState, useRef, useEffect } from "react";
import Message, { TypingIndicator } from "./Message";
import InputBar from "./InputBar";
import { sendMessage, Message as MessageType } from "@/lib/api";

const WELCOME_MESSAGE = `Buongiorno! Sono l'assistente fiscale virtuale di Allcore Spa. Come posso esserti utile oggi?`;

const SUGGESTIONS = [
  "Posso dedurre l'auto aziendale?",
  "Quali sono i requisiti per il regime forfettario?",
  "Scadenze fiscali di febbraio",
  "Come funzionano i crediti d'imposta 4.0?",
];

export default function Chat() {
  const [messages, setMessages] = useState<MessageType[]>([
    { role: "assistant", content: WELCOME_MESSAGE },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  const handleSend = async (content: string) => {
    // Add user message
    const userMessage: MessageType = { role: "user", content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);
    setStreamingContent("");

    try {
      let fullResponse = "";

      await sendMessage(newMessages, (chunk) => {
        fullResponse += chunk;
        setStreamingContent(fullResponse);
      });

      // Add complete assistant message
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: fullResponse },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Mi scuso, si è verificato un errore. Riprova tra qualche istante o contatta il supporto Allcore.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setStreamingContent("");
    }
  };

  const handleSuggestion = (suggestion: string) => {
    if (!isLoading) {
      handleSend(suggestion);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {messages.map((message, index) => (
            <Message
              key={index}
              role={message.role}
              content={message.content}
            />
          ))}

          {/* Streaming message */}
          {isLoading && streamingContent && (
            <Message
              role="assistant"
              content={streamingContent}
              isStreaming={true}
            />
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
