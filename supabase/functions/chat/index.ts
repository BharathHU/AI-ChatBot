import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Simple recommendation engine
function getRecommendations(message: string): string | null {
  const lower = message.toLowerCase();

  const isRecommendation =
    /\b(suggest|recommend|best|top|should i|what .*(learn|use|try|build|start|study)|give me ideas|any tips)\b/.test(lower);

  if (!isRecommendation) return null;

  if (/\b(project|build|portfolio|app|side project)\b/.test(lower)) {
    return `\n\n---\n**🚀 Recommended Projects:**\n
| Project | Tech Stack | Difficulty |
|---------|-----------|------------|
| AI Chatbot (like this one!) | React, TanStack, Gemini API | ⭐⭐⭐ |
| E-commerce Dashboard | React, Supabase, Stripe | ⭐⭐⭐ |
| Real-time Collaboration Tool | WebSockets, React, PostgreSQL | ⭐⭐⭐⭐ |
| Personal Finance Tracker | React, Chart.js, Supabase | ⭐⭐ |
| Blog with CMS | TanStack Start, Markdown, Supabase | ⭐⭐ |`;
  }

  if (/\b(course|learn|study|tutorial|resource|education)\b/.test(lower)) {
    return `\n\n---\n**📚 Recommended Learning Paths:**\n
| Course / Resource | Platform | Level |
|-------------------|----------|-------|
| CS50x — Introduction to CS | Harvard / edX | Beginner |
| Full Stack Open | University of Helsinki | Intermediate |
| Machine Learning Specialization | Coursera (Andrew Ng) | Intermediate |
| The Odin Project | Free / Open Source | Beginner |
| Fast.ai — Practical Deep Learning | fast.ai | Advanced |`;
  }

  if (/\b(career|job|role|position|profession|hire|salary)\b/.test(lower)) {
    return `\n\n---\n**💼 Trending Tech Careers:**\n
| Role | Avg Salary (USD) | Growth |
|------|-----------------|--------|
| AI/ML Engineer | $130k–$180k | 🔥 Very High |
| Full-Stack Developer | $100k–$150k | 📈 High |
| Cloud/DevOps Engineer | $120k–$165k | 📈 High |
| Data Scientist | $110k–$160k | 📈 High |
| Cybersecurity Analyst | $95k–$140k | 🔥 Very High |`;
  }

  if (/\b(language|programming|framework|tech|stack|tool)\b/.test(lower)) {
    return `\n\n---\n**🛠️ Recommended Technologies:**\n
| Technology | Category | Why Learn It |
|-----------|----------|--------------|
| TypeScript | Language | Type safety, huge ecosystem |
| Python | Language | AI/ML, data science, versatile |
| React | Framework | Most popular UI library |
| Rust | Language | Performance, safety, growing fast |
| Go | Language | Backend, cloud-native, simple |`;
  }

  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Check if latest user message triggers recommendations
    const lastUserMsg = [...messages].reverse().find((m: any) => m.role === "user");
    const recommendations = lastUserMsg ? getRecommendations(lastUserMsg.content) : null;

    const systemPrompt = `You are an intelligent, friendly AI assistant. You can answer any question on any topic.
You provide clear, concise, and helpful responses. Use markdown formatting for better readability.
When giving code examples, use fenced code blocks with language identifiers.
${recommendations ? "After your answer, the system will append relevant recommendations automatically." : "If the user asks for suggestions or recommendations about projects, courses, careers, or technologies, provide thoughtful personalized advice."}
Keep responses informative but not overly long unless the user asks for detail.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage credits exhausted. Please add funds in Settings → Workspace → Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If we have recommendations, we need to append them after the stream
    // We'll add a custom header to signal the client
    const headers: Record<string, string> = {
      ...corsHeaders,
      "Content-Type": "text/event-stream",
    };

    if (recommendations) {
      // Create a transform stream that appends recommendation content after the AI stream
      const originalBody = response.body!;
      const encoder = new TextEncoder();

      const transformStream = new TransformStream({
        async start() {},
        async transform(chunk, controller) {
          controller.enqueue(chunk);
        },
        async flush(controller) {
          // After the AI stream ends, inject recommendation data as additional SSE events
          const recChunks = recommendations.match(/.{1,50}/g) || [];
          for (const chunk of recChunks) {
            const data = JSON.stringify({
              choices: [{ delta: { content: chunk } }],
            });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        },
      });

      const newBody = originalBody.pipeThrough(transformStream);
      return new Response(newBody, { headers });
    }

    return new Response(response.body, { headers });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
