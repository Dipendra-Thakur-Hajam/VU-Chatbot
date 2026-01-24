import { useState } from "react";
import { sendMessage } from "../services/chatService";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");

  async function handleSend() {
    if (!userInput.trim()) return;

    // 1️⃣ Show user message
    setMessages(prev => [
      ...prev,
      { role: "user", content: userInput }
    ]);

    // 2️⃣ Call backend
    const response = await sendMessage(userInput);

    // 3️⃣ Show assistant message
    setMessages(prev => [
      ...prev,
      { role: "assistant", content: response.answer }
    ]);

    setUserInput("");
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">
        🎓 College Admission Agent
      </h1>

      <div className="border p-4 h-96 overflow-y-auto mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 ${
              msg.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <b>{msg.role === "user" ? "You" : "Agent"}:</b>{" "}
            {msg.content}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="border p-2 flex-1"
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          placeholder="Ask about admission, eligibility, fees..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4"
        >
          Send
        </button>
      </div>
    </div>
  );
}
