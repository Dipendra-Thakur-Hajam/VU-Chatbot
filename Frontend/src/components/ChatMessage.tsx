import { User, Sparkles, Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import ReactMarkdown from 'react-markdown';

type ChatMessageProps = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={`group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 ${
        isUser ? "bg-white dark:bg-[#343541]" : "bg-gray-50 dark:bg-[#444654]"
      }`}
    >
      <div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-[38rem] xl:max-w-3xl p-4 md:py-6 flex lg:px-0 m-auto">
        
        {/* Avatar */}
        <div className="w-8 h-8 rounded-sm shrink-0 flex items-center justify-center">
          {isUser ? (
             <div className="bg-purple-600 w-8 h-8 rounded-sm flex items-center justify-center">
                 <User className="w-5 h-5 text-white" />
             </div>
          ) : (
             <div className="bg-green-500 w-8 h-8 rounded-sm flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
             </div>
          )}
        </div>

        {/* Content */}
        <div className="relative flex-1 overflow-hidden">
          <div className="prose dark:prose-invert max-w-none break-words leading-7">
             {isUser ? (
                 <p className="whitespace-pre-wrap">{content}</p>
             ) : (
                <ReactMarkdown>{content}</ReactMarkdown>
             )}
          </div>
          
           {/* Actions for Assistant */}
           {!isUser && (
            <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                    <Copy className="w-4 h-4" />
                </button>
                 <button className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                    <ThumbsUp className="w-4 h-4" />
                </button>
                 <button className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                    <ThumbsDown className="w-4 h-4" />
                </button>
            </div>
           )}

        </div>
      </div>
    </div>
  );
}
