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
  // Fallback for non-streaming usage if needed, but we should use stream
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  });

  if (!res.ok) throw new Error(`API Error: ${res.statusText}`);

  // If the backend returns a stream (x-ndjson), we can't use .json() directly here for legacy calls
  // unless we consume it all. For now assuming explicit stream usage in components.
  // This is kept for backward compatibility if backend reverts.
  if (res.headers.get("content-type")?.includes("application/x-ndjson")) {
    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let answer = "";
    let sources: Source[] = [];

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const data = JSON.parse(line);
            if (data.type === 'sources') sources = data.data;
            if (data.type === 'content') answer += data.data;
          } catch (e) { }
        }
      }
    }
    return { answer, sources };
  }

  return await res.json();
}

export async function sendMessageStream(
  question: string,
  onChunk: (text: string) => void,
  onSources: (sources: Source[]) => void
): Promise<void> {
  const res = await fetch(API_URL, {
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
      try {
        const json = JSON.parse(line);
        if (json.type === 'sources') {
          onSources(json.data);
        } else if (json.type === 'content') {
          onChunk(json.data);
        } else if (json.type === 'error') {
          console.error("Stream error:", json.data);
        }
      } catch (e) {
        console.warn("Failed to parse chunk:", line);
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

