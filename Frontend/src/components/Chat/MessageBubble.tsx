import React from 'react';
import { User, Bot } from 'lucide-react';
import { Message } from '@/services/chatService';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div
      className={`flex gap-3 animate-message-in ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground'
        }`}
      >
        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>

      {/* Message Content */}
      <div
        className={`max-w-[80%] md:max-w-[70%] px-4 py-3 rounded-2xl ${
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-sm'
            : 'bg-card border border-border rounded-tl-sm shadow-sm'
        }`}
      >
        <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        <p
          className={`text-[10px] mt-2 ${
            isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
