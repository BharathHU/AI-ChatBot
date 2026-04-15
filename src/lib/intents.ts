// NLP Intent Dataset — patterns and responses for intent classification
export interface Intent {
  tag: string;
  patterns: string[];
  responses: string[];
}

export const intents: Intent[] = [
  {
    tag: "greeting",
    patterns: ["hi", "hello", "hey", "good morning", "good evening", "what's up", "howdy", "greetings", "sup"],
    responses: [
      "Hello! 👋 How can I help you today?",
      "Hey there! What can I do for you?",
      "Hi! I'm here to assist you. What would you like to know?",
      "Greetings! How may I help you today?",
    ],
  },
  {
    tag: "goodbye",
    patterns: ["bye", "goodbye", "see you", "see ya", "take care", "later", "farewell", "good night"],
    responses: [
      "Goodbye! Have a great day! 👋",
      "See you later! Don't hesitate to come back if you need help.",
      "Take care! It was nice chatting with you.",
      "Bye! Hope I was helpful! 😊",
    ],
  },
  {
    tag: "thanks",
    patterns: ["thanks", "thank you", "appreciate it", "thanks a lot", "thx", "ty", "much appreciated"],
    responses: [
      "You're welcome! 😊",
      "Happy to help!",
      "Anytime! Let me know if you need anything else.",
      "Glad I could assist! 🙌",
    ],
  },
  {
    tag: "about",
    patterns: ["who are you", "what are you", "tell me about yourself", "what can you do", "your name", "what's your purpose"],
    responses: [
      "I'm an AI-powered chatbot built with NLP intent classification! I can answer your questions, help with information, and have friendly conversations. 🤖",
      "I'm your friendly AI assistant! I use natural language processing to understand your messages and respond intelligently.",
    ],
  },
  {
    tag: "help",
    patterns: ["help", "i need help", "can you help", "assist me", "support", "what can you help with"],
    responses: [
      "Of course! I can help with general questions, tell you about AI & NLP, share jokes, and more. Just ask away! 💡",
      "I'm here to help! Try asking me about programming, AI, or just have a chat.",
    ],
  },
  {
    tag: "programming",
    patterns: ["what is programming", "tell me about coding", "programming languages", "best language to learn", "how to code", "what language should i learn"],
    responses: [
      "Programming is the art of telling computers what to do using code! Popular languages include Python, JavaScript, TypeScript, and Rust. Python is great for beginners! 🐍",
      "Coding is like writing instructions for computers. Start with Python or JavaScript — they're beginner-friendly and incredibly versatile!",
    ],
  },
  {
    tag: "ai",
    patterns: ["what is ai", "artificial intelligence", "tell me about ai", "machine learning", "what is ml", "deep learning", "nlp"],
    responses: [
      "AI (Artificial Intelligence) is the simulation of human intelligence by machines. It includes Machine Learning, Deep Learning, and NLP (Natural Language Processing) — which is what powers me! 🧠",
      "Artificial Intelligence enables machines to learn from data and make decisions. NLP, a subset of AI, helps me understand your messages!",
    ],
  },
  {
    tag: "joke",
    patterns: ["tell me a joke", "joke", "make me laugh", "funny", "something funny", "humor"],
    responses: [
      "Why do programmers prefer dark mode? Because light attracts bugs! 🐛😄",
      "Why did the developer go broke? Because he used up all his cache! 💰",
      "What's a computer's favorite snack? Microchips! 🍟",
      "Why do Java developers wear glasses? Because they don't C#! 😎",
    ],
  },
  {
    tag: "weather",
    patterns: ["what's the weather", "weather today", "is it raining", "temperature", "forecast", "how's the weather"],
    responses: [
      "I don't have real-time weather data, but I'd recommend checking weather.com or your phone's weather app for the latest forecast! 🌤️",
      "I wish I could check the weather for you! Try a weather service like AccuWeather for accurate forecasts. ☁️",
    ],
  },
  {
    tag: "time",
    patterns: ["what time is it", "current time", "what's the time", "time now"],
    responses: [
      "I don't have access to real-time clock, but you can check the time on your device! ⏰",
    ],
  },
  {
    tag: "motivation",
    patterns: ["motivate me", "inspiration", "i'm feeling down", "cheer me up", "encourage me", "i need motivation"],
    responses: [
      "You're doing amazing! Remember: every expert was once a beginner. Keep pushing forward! 🚀",
      "Believe in yourself! The only limit is the one you set. You've got this! 💪",
      "\"The best time to plant a tree was 20 years ago. The second best time is now.\" — Keep going! 🌱",
    ],
  },
  {
    tag: "creator",
    patterns: ["who made you", "who created you", "who built you", "your creator", "developer"],
    responses: [
      "I was built as a portfolio project showcasing NLP-powered intent classification! Built with modern web technologies and AI. 🛠️",
      "I'm a creation of modern web development + AI/NLP techniques. Pretty cool, right? 😎",
    ],
  },
];
