import { useState, useCallback, useRef } from 'react';
import { sendMessage, sendMessageStream, Message, Source } from '@/services/chatService';

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

  const abortControllerRef = useRef<AbortController | null>(null);

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

    // Use streaming for real-time response display (like ChatGPT)
    const assistantMessageId = (Date.now() + 1).toString();
    let fullResponse = '';

    try {
      await sendMessageStream(
        content,
        (chunk: string) => {
          // Update message as chunks arrive
          fullResponse += chunk;
          setState(prev => {
            const newMessages = [...prev.messages];
            const lastMsgIndex = newMessages.length - 1;

            // Update or create assistant message
            if (lastMsgIndex >= 0 && newMessages[lastMsgIndex].role === 'assistant') {
              newMessages[lastMsgIndex] = {
                ...newMessages[lastMsgIndex],
                content: fullResponse,
              };
            } else {
              newMessages.push({
                id: assistantMessageId,
                content: fullResponse,
                role: 'assistant',
                timestamp: new Date(),
              });
            }

            return {
              ...prev,
              messages: newMessages,
            };
          });
        }
      );

      setState(prev => ({
        ...prev,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Chat error:', error);
      
      // Fallback to non-streaming if streaming fails
      const response = await sendMessage(content);
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, response.message],
        sources: response.sources,
        isLoading: false,
      }));
    }
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
