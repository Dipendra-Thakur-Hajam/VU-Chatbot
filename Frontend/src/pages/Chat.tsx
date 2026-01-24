import { useState, useRef, useEffect } from "react";
import { Send, StopCircle } from "lucide-react";
import Layout from "../components/Layout";
import ChatMessage from "../components/ChatMessage";
import { sendMessage } from "../services/chatService";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your VU Admission Agent. How can I help you today? Ask me about courses, fees, or campus life."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
      // Check system preference on load
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          setIsDarkMode(true);
      }
  }, []);

  const toggleTheme = () => {
      setIsDarkMode(!isDarkMode);
  };

  async function handleSend() {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput("");
    
    // 1. Add user message
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      // 2. Call API
      const response = await sendMessage(userMsg);
      
      // 3. Add assistant response
      setMessages(prev => [...prev, { role: "assistant", content: response.answer }]);
    } catch (error) {
       setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Layout toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
      <div className={`flex flex-col h-full ${isDarkMode ? 'dark' : ''}`}>
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-32 pt-10">
          <div className="flex flex-col items-center">
            {messages.map((msg, i) => (
              <ChatMessage key={i} role={msg.role} content={msg.content} />
            ))}
             {isLoading && (
                 <div className="w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 bg-gray-50 dark:bg-[#444654]">
                    <div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-[38rem] xl:max-w-3xl p-4 md:py-6 flex lg:px-0 m-auto">
                        <div className="w-8 h-8 bg-green-500 rounded-sm shrink-0 flex items-center justify-center animate-pulse">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <div className="flex items-center">
                            <span className="animate-pulse">Thinking...</span>
                        </div>
                    </div>
                </div>
             )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white via-white to-transparent dark:from-[#343541] dark:via-[#343541] pt-10 pb-6 px-4">
          <div className="max-w-3xl mx-auto">
            <div className={`relative flex items-center w-full p-1 rounded-md border shadow-xs transition-colors
               ${isDarkMode 
                   ? 'bg-[#40414F] border-none text-white' 
                   : 'bg-white border-black/10 text-gray-800 focus-within:border-black/20'
               }`}>
              
              <input
                className="flex-1 max-h-[200px] m-0 w-full resize-none border-0 bg-transparent p-3 pl-4 pr-10 focus:ring-0 focus-visible:ring-0 outline-none shadow-none"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Send a message..."
                disabled={isLoading}
              />
              
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={`absolute right-2 p-1.5 rounded-md transition-colors 
                    ${input.trim() 
                        ? 'bg-[#19c37d] text-white hover:bg-[#1a885d]' 
                        : 'bg-transparent text-gray-400 cursor-not-allowed'
                    }`}
              >
               {isLoading ? <StopCircle className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
            <div className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
                VU Admission Agent may produce inaccurate information about people, places, or facts.
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
