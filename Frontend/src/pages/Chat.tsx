import { useState, useRef, useEffect } from "react";
import { Send, StopCircle, Menu } from "lucide-react";
import Layout from "../components/Layout";
import ChatMessage from "../components/ChatMessage";
import UniversityLogo from "../components/UniversityLogo";
import Sidebar from "../components/Sidebar";
import GraduationCapIcon from "../components/icons/GraduationCapIcon";
import BookIcon from "../components/icons/BookIcon";
import { sendMessage, submitFeedback } from "../services/chatService";
import { useChatSessions } from "../hooks/useChatSessions";

const WELCOME_MESSAGE = {
  role: "assistant" as const,
  content: "Welcome to Vishwakarma University Admissions Assistant! I'm here to help you with information about our programs, admissions, campus life, and more.\n\nI can assist you with:\n- Academic programs and courses\n- Fees and scholarships\n- Campus facilities and life\n- Admission requirements and process\n- Placements and career opportunities\n\nWhat would you like to know about VU?"
};

export default function Chat() {
  const {
    sessions,
    activeSession,
    createSession,
    switchSession,
    addMessage,
    updateMessage,
    deleteSession,
    renameSession
  } = useChatSessions();

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages]);

  // Check system dark mode preference
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  // Create first session if none exist
  useEffect(() => {
    if (sessions.length === 0) {
      const newSession = createSession();
      addMessage(WELCOME_MESSAGE);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleNewChat = () => {
    createSession();
    addMessage(WELCOME_MESSAGE);
    setSidebarOpen(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || !activeSession) return;

    const userMsg = input;
    setInput("");

    // Add user message
    addMessage({ role: "user", content: userMsg });
    setIsLoading(true);

    try {
      // Call API
      const response = await sendMessage(userMsg);

      // Add assistant response with sources
      addMessage({
        role: "assistant",
        content: response.answer,
        sources: response.sources || []
      });
    } catch (error) {
      addMessage({
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (messageId: string, type: 'like' | 'dislike' | null) => {
    updateMessage(messageId, { feedback: type as any });

    // Send to backend
    const message = activeSession?.messages.find(m => m.id === messageId);
    if (message && type) {
      try {
        await submitFeedback({
          messageId,
          feedbackType: type,
          question: activeSession.messages[activeSession.messages.findIndex(m => m.id === messageId) - 1]?.content || '',
          answer: message.content
        });
      } catch (error) {
        console.error('Failed to submit feedback:', error);
      }
    }
  };

  const messages = activeSession?.messages || [];

  return (
    <Layout toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
      <div className={`flex h-full ${isDarkMode ? 'dark' : ''}`}>

        {/* Sidebar */}
        <Sidebar
          sessions={sessions}
          activeSessionId={activeSession?.id || null}
          onNewChat={handleNewChat}
          onSelectSession={switchSession}
          onDeleteSession={deleteSession}
          onRenameSession={renameSession}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Chat Area */}
        <div className="flex flex-col flex-1 h-full">

          {/* Header with University Branding */}
          <div className="border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-[#1B263B]/95 backdrop-blur-md sticky top-0 z-10 shadow-sm">
            <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-[#0A2342] dark:text-[#E0C878]" />
              </button>
              <div className="flex items-center gap-3">
                <GraduationCapIcon className="w-8 h-8 text-[#0A2342] dark:text-[#E0C878]" />
                <div className="flex flex-col">
                  <span className="font-semibold text-[#0A2342] dark:text-[#E0C878] text-lg">VU Assistant</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Vishwakarma University</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto no-scrollbar pb-32 pt-6">
            <div className="flex flex-col items-center">
              {messages.map((msg, i) => (
                <ChatMessage
                  key={msg.id}
                  messageId={msg.id}
                  role={msg.role}
                  content={msg.content}
                  sources={msg.sources}
                  feedback={msg.feedback}
                  onFeedback={handleFeedback}
                  isLatest={i === messages.length - 1 && msg.role === 'assistant'}
                />
              ))}
              {isLoading && (
                <div className="w-full text-gray-800 dark:text-gray-100 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50/40 to-amber-50/40 dark:from-[#1B263B] dark:to-[#263447]">
                  <div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-[38rem] xl:max-w-3xl p-4 md:py-6 flex lg:px-0 m-auto">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#0A2342] to-[#1B3A5F] dark:from-[#E0C878] dark:to-[#D4AF37] rounded-xl shrink-0 flex items-center justify-center animate-pulse shadow-md">
                      <BookIcon className="w-5 h-5 text-white dark:text-[#0A2342]" />
                    </div>
                    <div className="flex items-center">
                      <span className="animate-pulse text-[#0A2342] dark:text-[#E0C878] font-medium">Searching knowledge base...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="absolute bottom-0 left-0 lg:left-64 right-0 bg-gradient-to-t from-white via-white to-transparent dark:from-[#0D1B2A] dark:via-[#0D1B2A] pt-10 pb-6 px-4">
            <div className="max-w-3xl mx-auto">
              <div className={`relative flex items-center w-full p-1 rounded-xl border-2 shadow-lg transition-all duration-200
                 ${isDarkMode
                  ? 'bg-[#1B263B] border-gray-700 text-white focus-within:border-[#E0C878] focus-within:shadow-[#E0C878]/20'
                  : 'bg-white border-gray-300 text-gray-800 focus-within:border-[#D4AF37] focus-within:shadow-[#D4AF37]/20'
                }`}>

                <input
                  className="flex-1 max-h-[200px] m-0 w-full resize-none border-0 bg-transparent p-3 pl-4 pr-10 focus:ring-0 focus-visible:ring-0 outline-none shadow-none placeholder-gray-400 dark:placeholder-gray-500"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask about programs, admissions, fees..."
                  disabled={isLoading}
                />

                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className={`absolute right-2 p-2.5 rounded-lg transition-all duration-200 transform hover:scale-105
                      ${input.trim()
                      ? 'bg-gradient-to-br from-[#0A2342] to-[#1B3A5F] dark:from-[#D4AF37] dark:to-[#E0C878] text-white dark:text-[#0A2342] hover:shadow-lg shadow-md'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                  aria-label={isLoading ? "Stop" : "Send message"}
                >
                  {isLoading ? <StopCircle className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
              <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-3 flex items-center justify-center gap-1">
                <BookIcon className="w-3 h-3" />
                <span>VU Admission Assistant - Please verify important information</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
