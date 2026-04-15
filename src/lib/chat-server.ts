import { createServerFn } from "@tanstack/react-start";
import { classifyIntent, getResponse, getFallbackResponse } from "./nlp";

export const chatWithBot = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const data = input as { message: string };
    if (!data.message || typeof data.message !== "string") {
      throw new Error("Message is required");
    }
    return { message: data.message.trim() };
  })
  .handler(async ({ data }: { data: { message: string } }) => {
    const { message } = data;

    const result = classifyIntent(message);

    if (result) {
      return {
        response: getResponse(result.intent),
        intent: result.intent.tag,
        confidence: Math.round(result.confidence * 100),
      };
    }

    return {
      response: getFallbackResponse(),
      intent: "unknown",
      confidence: 0,
    };
  });
