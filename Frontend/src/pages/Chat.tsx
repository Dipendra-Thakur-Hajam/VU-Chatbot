import { useState, useRef, useEffect } from "react";
import { Send, StopCircle } from "lucide-react";
import Layout from "../components/Layout";
import ChatMessage from "../components/ChatMessage";
import UniversityLogo from "../components/UniversityLogo";
import { sendMessage } from "../services/chatService";

type Source = {
  category: string;
  filename: string;
  snippet: string;
};

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "👋 Welcome to Vishwakarma University! I'm here to help you learn about our programs, admissions, fees, campus life, and more.\n\nFeel free to ask me anything about:\n- 📚 Academic programs and courses\n- 💰 Fees and scholarships\n- 🏫 Campus facilities\n- 📝 Admission process\n- 🎓 Placements and careers\n\nHow can I assist you today?"
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
      
      // 3. Add assistant response with sources
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: response.answer,
        sources: response.sources || []
      }]);
    } catch (error) {
       setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Layout toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
      <div className={`flex flex-col h-full ${isDarkMode ? 'dark' : ''}`}>
        
        {/* Header with University Logo */}
        <div className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-[#1A1A2E]/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 py-3">
            <UniversityLogo size="sm" />
          </div>
        </div>
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-32 pt-6">
          <div className="flex flex-col items-center">
            {messages.map((msg, i) => (
              <ChatMessage 
                key={i} 
                role={msg.role} 
                content={msg.content}
                sources={msg.sources}
              />
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
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white via-white to-transparent dark:from-[#1A1A2E] dark:via-[#1A1A2E] pt-10 pb-6 px-4">
          <div className="max-w-3xl mx-auto">
            <div className={`relative flex items-center w-full p-1 rounded-xl border-2 shadow-lg transition-all
               ${isDarkMode 
                   ? 'bg-gray-800 border-gray-700 text-white focus-within:border-orange-500' 
                   : 'bg-white border-gray-200 text-gray-800 focus-within:border-orange-500 focus-within:shadow-orange-100'
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
                className={`absolute right-2 p-2 rounded-lg transition-all transform hover:scale-105
                    ${input.trim() 
                        ? 'bg-gradient-to-r from-orange-500 to-blue-600 text-white hover:from-orange-600 hover:to-blue-700 shadow-md' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
              >
               {isLoading ? <StopCircle className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3">
                Vishwakarma University Admission Assistant - Information may not always be accurate. Please verify important details.
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
