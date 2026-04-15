import { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage, type Message } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { streamChat } from "@/lib/chat-stream";

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello! 👋 I'm an AI-powered chatbot that can answer **any question** you have. I can also provide **recommendations** for projects, courses, careers, and technologies.\n\nTry asking me anything — or say *\"recommend me some projects\"*!",
  timestamp: Date.now(),
};

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Build conversation history for context (last 20 messages)
    const history = [...messages, userMessage]
      .filter((m) => m.id !== "welcome")
      .slice(-20)
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    let assistantSoFar = "";

    const upsertAssistant = (nextChunk: string) => {
      assistantSoFar += nextChunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && last.id !== "welcome") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
          );
        }
        return [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant" as const,
            content: assistantSoFar,
            timestamp: Date.now(),
          },
        ];
      });
    };

    try {
      await streamChat({
        messages: history,
        onDelta: (chunk) => {
          setIsTyping(false);
          upsertAssistant(chunk);
        },
        onDone: () => setIsTyping(false),
      });
    } catch (error) {
      setIsTyping(false);
      const errorContent =
        error instanceof Error
          ? error.message
          : "Oops! Something went wrong. Please try again. 😅";

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant" as const,
          content: `⚠️ ${errorContent}`,
          timestamp: Date.now(),
        },
      ]);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-border bg-chat-input-bg px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-primary-foreground"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M2 14h2M20 14h2M15 13v2M9 13v2" />
          </svg>
        </div>
        <div>
          <h1 className="text-sm font-semibold text-foreground">AI Chatbot</h1>
          <p className="text-xs text-muted-foreground">
            {isTyping ? (
              <span className="text-primary">Thinking...</span>
            ) : (
              "Online • Powered by AI"
            )}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-muted-foreground">Active</span>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-4">
        <div className="mx-auto max-w-3xl">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isTyping && <TypingIndicator />}
        </div>
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={isTyping} />
    </div>
  );
}
