import { createFileRoute } from "@tanstack/react-router";
import { ChatWindow } from "@/components/ChatWindow";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "AI Chatbot — Intelligent Q&A & Recommendations" },
      { name: "description", content: "AI-powered chatbot with open-domain Q&A, smart recommendations, and conversational memory. Built with Gemini AI." },
    ],
  }),
});

function Index() {
  return <ChatWindow />;
}
