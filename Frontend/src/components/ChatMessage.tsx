import { User, Bot, Copy, ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { useState } from "react";
import TypewriterText from './TypewriterText';
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
  messageId?: string;
  feedback?: 'like' | 'dislike';
  onFeedback?: (messageId: string, type: 'like' | 'dislike') => void;
  isLatest?: boolean;
};

export default function ChatMessage({
  role,
  content,
  sources,
  messageId,
  feedback,
  onFeedback,
  isLatest = false
}: ChatMessageProps) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);
  const [showFullText, setShowFullText] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleFeedback = (type: 'like' | 'dislike') => {
    if (messageId && onFeedback) {
      onFeedback(messageId, feedback === type ? null as any : type);
    }
  };

  return (
    <div
      className={`group w-full text-gray-800 dark:text-gray-100 border-b border-gray-200/50 dark:border-gray-700/50 ${isUser ? "bg-gray-50/50 dark:bg-[#1B263B]/40" : "bg-gradient-to-r from-blue-50/40 to-amber-50/40 dark:from-[#1B263B]/80 dark:to-[#263447]/80"
        }`}
    >
      <div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-[38rem] xl:max-w-3xl p-4 md:py-6 flex lg:px-0 m-auto">

        {/* Avatar */}
        <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
          {isUser ? (
            <div className="bg-gradient-to-br from-[#0A2342] to-[#1B3A5F] dark:from-[#1B3A5F] dark:to-[#263447] w-10 h-10 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          ) : (
            <div className="bg-gradient-to-br from-[#D4AF37] to-[#E0C878] dark:from-[#E0C878] dark:to-[#D4AF37] w-10 h-10 rounded-xl flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5 text-[#0A2342]" />
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
                {isLatest && !showFullText ? (
                  <TypewriterText
                    text={content}
                    speed={30}
                    onComplete={() => setShowFullText(true)}
                  />
                ) : (
                  <TypewriterText text={content} speed={0} />
                )}
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
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-md hover:bg-white/50 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                title="Copy message"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleFeedback('like')}
                className={`p-1.5 rounded-md hover:bg-white/50 dark:hover:bg-gray-700 transition-colors ${feedback === 'like' ? 'text-green-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                title="Good response"
              >
                <ThumbsUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleFeedback('dislike')}
                className={`p-1.5 rounded-md hover:bg-white/50 dark:hover:bg-gray-700 transition-colors ${feedback === 'dislike' ? 'text-red-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                title="Bad response"
              >
                <ThumbsDown className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
