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
const API_STREAM_URL = "http://localhost:8000/api/chat/stream";

export async function sendMessage(question: string): Promise<ChatResponse> {
  // Fallback for non-streaming usage if needed, but we should use stream
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  });

  if (!res.ok) throw new Error(`API Error: ${res.statusText}`);

  return await res.json();
}

export async function sendMessageStream(
  question: string,
  onChunk: (text: string) => void,
  onSources?: (sources: Source[]) => void
): Promise<void> {
  /**
   * Streaming endpoint - works like ChatGPT
   * Sends response tokens as Server-Sent Events
   */
  const res = await fetch(API_STREAM_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  });

  if (!res.ok) throw new Error(`API Error: ${res.statusText}`);

  const reader = res.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) throw new Error("No reader available");

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (!line.trim()) continue;
      
      // Handle Server-Sent Events format (data: ...)
      if (line.startsWith('data: ')) {
        const data = line.slice(6); // Remove "data: " prefix
        onChunk(data);
      }
    }
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

