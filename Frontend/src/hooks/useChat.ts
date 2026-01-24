import { useState, useCallback } from 'react';
import { sendMessage, Message, Source } from '@/services/chatService';

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  sources: Source[];
}

export const useChat = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    sources: [],
  });

  const send = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
    }));

    const response = await sendMessage(content);

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, response.message],
      sources: response.sources,
      isLoading: false,
    }));
  }, []);

  const clearChat = useCallback(() => {
    setState({
      messages: [],
      isLoading: false,
      sources: [],
    });
  }, []);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    sources: state.sources,
    sendMessage: send,
    clearChat,
  };
};
