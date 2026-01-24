import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MessageBubble from './MessageBubble';
import SourceCard from './SourceCard';
import { useChat } from '@/hooks/useChat';

const suggestedQuestions = [
  "What are the admission requirements?",
  "Tell me about available courses",
  "What are the tuition fees?",
  "When are the application deadlines?",
  "Is hostel accommodation available?",
];

const ChatBox: React.FC = () => {
  const { messages, isLoading, sources, sendMessage, clearChat } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  const handleSuggestionClick = (question: string) => {
    if (!isLoading) {
      sendMessage(question);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Admission Assistant</h2>
              <p className="text-xs text-muted-foreground">IBM Granite AI • Always ready to help</p>
            </div>
          </div>
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mb-6">
                <Sparkles className="w-10 h-10 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Welcome to College Admission Agent
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md">
                I'm powered by IBM Granite AI and designed for IBM Cloud Lite. 
                Ask me anything about admissions, courses, fees, or deadlines!
              </p>
              <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(question)}
                    className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-card border border-border">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground animate-typing" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground animate-typing" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground animate-typing" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-muted/30">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask admission questions (IBM Granite AI)"
              className="flex-1 px-4 py-3 rounded-xl bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-6"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </form>
      </div>

      {/* Sources Panel */}
      <div className="lg:w-80 flex flex-col">
        <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-muted/30">
            <h3 className="font-semibold text-foreground">Sources & References</h3>
            <p className="text-xs text-muted-foreground mt-1">RAG-retrieved documents</p>
          </div>
          <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
            {sources.length > 0 ? (
              sources.map((source) => (
                <SourceCard key={source.id} source={source} />
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Sources will appear here when you ask a question
              </p>
            )}
          </div>
        </div>

        {/* IBM Branding */}
        <div className="mt-4 p-4 rounded-xl bg-secondary/50 border border-border">
          <p className="text-xs text-center text-muted-foreground">
            <span className="font-medium text-secondary-foreground">Designed for IBM Cloud Lite</span>
            <br />
            Enterprise-grade AI on a lightweight deployment
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
