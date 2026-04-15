// Simple NLP pipeline: tokenization, stopword removal, TF-IDF-like matching
import { intents, type Intent } from "./intents";

const STOPWORDS = new Set([
  "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your",
  "yours", "yourself", "he", "him", "his", "she", "her", "hers", "it", "its",
  "itself", "they", "them", "their", "theirs", "a", "an", "the", "and", "but",
  "or", "for", "nor", "not", "so", "yet", "to", "of", "in", "on", "at", "by",
  "is", "am", "are", "was", "were", "be", "been", "being", "have", "has", "had",
  "do", "does", "did", "will", "would", "shall", "should", "may", "might",
  "can", "could", "must", "this", "that", "these", "those", "with", "from",
]);

/** Tokenize and clean input */
function preprocess(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 0 && !STOPWORDS.has(w));
}

/** Compute similarity between two token arrays using Jaccard + overlap scoring */
function similarity(tokensA: string[], tokensB: string[]): number {
  if (tokensA.length === 0 || tokensB.length === 0) return 0;
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  let overlap = 0;
  for (const t of setA) {
    if (setB.has(t)) overlap++;
  }
  // Weighted: partial match bonus for shorter queries
  const jaccard = overlap / (setA.size + setB.size - overlap);
  const coverage = overlap / Math.min(setA.size, setB.size);
  return jaccard * 0.4 + coverage * 0.6;
}

export interface ClassificationResult {
  intent: Intent;
  confidence: number;
}

const CONFIDENCE_THRESHOLD = 0.25;

/** Classify user input against intent patterns */
export function classifyIntent(userInput: string): ClassificationResult | null {
  const tokens = preprocess(userInput);

  // Direct exact match for short inputs
  const lower = userInput.toLowerCase().trim();
  for (const intent of intents) {
    if (intent.patterns.some((p) => p === lower)) {
      return { intent, confidence: 1.0 };
    }
  }

  let bestMatch: ClassificationResult | null = null;

  for (const intent of intents) {
    for (const pattern of intent.patterns) {
      const patternTokens = preprocess(pattern);
      const score = similarity(tokens, patternTokens);
      if (score > (bestMatch?.confidence ?? 0)) {
        bestMatch = { intent, confidence: score };
      }
    }
  }

  if (bestMatch && bestMatch.confidence >= CONFIDENCE_THRESHOLD) {
    return bestMatch;
  }

  return null;
}

/** Get a random response from an intent */
export function getResponse(intent: Intent): string {
  return intent.responses[Math.floor(Math.random() * intent.responses.length)];
}

const FALLBACK_RESPONSES = [
  "I'm not sure I understand. Could you rephrase that? 🤔",
  "Hmm, I don't have a great answer for that. Try asking about AI, programming, or just say hi!",
  "I'm still learning! Could you try asking something else?",
  "That's beyond my current knowledge, but I'm always improving! Try another question. 💡",
];

export function getFallbackResponse(): string {
  return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
}
