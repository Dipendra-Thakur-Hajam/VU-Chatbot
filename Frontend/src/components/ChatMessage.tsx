import { User, Bot, Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import SourceCitation from './SourceCitation';

type Source = {
  category: string;
  filename: string;
  snippet: string;
};

type ChatMessageProps = {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
};

export default function ChatMessage({ role, content, sources }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={`group w-full text-gray-800 dark:text-gray-100 border-b border-gray-200/50 dark:border-gray-700/50 ${
        isUser ? "bg-white dark:bg-[#1A1A2E]" : "bg-gradient-to-r from-orange-50/30 to-blue-50/30 dark:from-orange-900/10 dark:to-blue-900/10"
      }`}
    >
      <div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-[38rem] xl:max-w-3xl p-4 md:py-6 flex lg:px-0 m-auto">
        
        {/* Avatar */}
        <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
          {isUser ? (
             <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-10 h-10 rounded-xl flex items-center justify-center">
                 <User className="w-5 h-5 text-white" />
             </div>
          ) : (
             <div className="bg-gradient-to-br from-orange-500 to-blue-600 w-10 h-10 rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
             </div>
          )}
        </div>

        {/* Content */}
        <div className="relative flex-1 overflow-hidden">
          <div className="prose dark:prose-invert max-w-none break-words leading-7">
             {isUser ? (
                 <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">{content}</p>
             ) : (
                <div className="text-gray-800 dark:text-gray-200">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
             )}
          </div>
          
          {/* Sources */}
          {!isUser && sources && sources.length > 0 && (
            <SourceCitation sources={sources} />
          )}
          
           {/* Actions for Assistant */}
           {!isUser && (
            <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 rounded-md hover:bg-white/50 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                    <Copy className="w-4 h-4" />
                </button>
                 <button className="p-1.5 rounded-md hover:bg-white/50 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                </button>
                 <button className="p-1.5 rounded-md hover:bg-white/50 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                    <ThumbsDown className="w-4 h-4" />
                </button>
            </div>
           )}

        </div>
      </div>
    </div>
  );
}
