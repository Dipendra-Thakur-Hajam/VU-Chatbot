// Chat service to communicate with the backend

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface Source {
  category: string;
  filename: string;
  snippet: string;
}

export interface ChatResponse {
  answer: string;
  sources: Source[];
}

const API_URL = "http://localhost:8000/api/chat";

export async function sendMessage(question: string): Promise<ChatResponse> {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to send message:", error);
    throw error;
  }
}

export async function submitFeedback(data: {
  messageId: string;
  feedbackType: 'like' | 'dislike';
  question: string;
  answer: string;
}): Promise<void> {
  try {
    const res = await fetch("http://localhost:8000/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      console.error("Failed to submit feedback");
    }
  } catch (error) {
    console.error("Error submitting feedback:", error);
  }
}

