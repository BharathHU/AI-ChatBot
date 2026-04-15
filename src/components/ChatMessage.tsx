import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number; // epoch ms — avoids hydration mismatch
}

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const [formattedTime, setFormattedTime] = useState<string>("");

  // Format time client-side only to avoid hydration mismatch
  useEffect(() => {
    setFormattedTime(
      new Date(message.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }, [message.timestamp]);

  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3",
        isUser && "flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-chat-bot-bg text-chat-bot-fg"
        )}
      >
        {isUser ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M2 14h2M20 14h2M15 13v2M9 13v2" />
          </svg>
        )}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "rounded-tr-sm bg-primary text-primary-foreground"
            : "rounded-tl-sm bg-chat-bot-bg text-chat-bot-fg"
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm prose-invert max-w-none [&_table]:text-xs [&_th]:px-2 [&_td]:px-2 [&_th]:py-1 [&_td]:py-1 [&_table]:border-border [&_th]:border-b [&_th]:border-border [&_td]:border-b [&_td]:border-border/50 [&_hr]:border-border/30 [&_hr]:my-3 [&_code]:bg-background/30 [&_code]:px-1 [&_code]:rounded [&_pre]:bg-background/30 [&_pre]:rounded-lg [&_a]:text-primary">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
        <div
          className={cn(
            "mt-1 flex items-center gap-2 text-[10px] opacity-50",
            isUser ? "justify-end" : "justify-start"
          )}
        >
          {formattedTime && <span>{formattedTime}</span>}
        </div>
      </div>
    </div>
  );
}
