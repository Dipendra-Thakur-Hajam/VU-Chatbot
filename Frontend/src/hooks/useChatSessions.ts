import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface Source {
    category: string;
    filename: string;
    snippet: string;
}

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    sources?: Source[];
    createdAt: number;
    feedback?: 'like' | 'dislike';
}

export interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
    createdAt: number;
    updatedAt: number;
}

interface ChatSessionsData {
    sessions: ChatSession[];
    activeSessionId: string | null;
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const generateTitle = (firstMessage: string): string => {
    const words = firstMessage.split(' ').slice(0, 5).join(' ');
    return words.length > 50 ? words.substring(0, 50) + '...' : words;
};

export function useChatSessions() {
    const [data, setData] = useLocalStorage<ChatSessionsData>('vu-chat-sessions', {
        sessions: [],
        activeSessionId: null,
    });

    // Derive activeSession directly from data
    const activeSession = data.sessions.find(s => s.id === data.activeSessionId) || null;

    // Create new session
    const createSession = useCallback(() => {
        const newSession: ChatSession = {
            id: generateId(),
            title: 'New Chat',
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        setData(prev => ({
            sessions: [newSession, ...prev.sessions],
            activeSessionId: newSession.id,
        }));
        return newSession;
    }, [setData]);

    // Switch session
    const switchSession = useCallback((sessionId: string) => {
        setData(prev => {
            const session = prev.sessions.find(s => s.id === sessionId);
            if (session) {
                return { ...prev, activeSessionId: sessionId };
            }
            return prev;
        });
    }, [setData]);

    // Add message to active session
    const addMessage = useCallback((message: Omit<Message, 'id' | 'createdAt'>) => {
        const id = generateId();
        const newMessage: Message = {
            ...message,
            id,
            createdAt: Date.now(),
        };

        setData(prev => {
            if (!prev.activeSessionId) return prev;

            const existingSession = prev.sessions.find(s => s.id === prev.activeSessionId);
            if (!existingSession) return prev;

            const updatedSession = {
                ...existingSession,
                messages: [...existingSession.messages, newMessage],
                updatedAt: Date.now(),
                // Update title from first user message
                title: existingSession.messages.length === 0 && message.role === 'user'
                    ? generateTitle(message.content)
                    : existingSession.title,
            };

            return {
                ...prev,
                sessions: prev.sessions.map(s =>
                    s.id === prev.activeSessionId ? updatedSession : s
                ),
            };
        });

        return newMessage;
    }, [setData]);

    // Update message (for feedback or streaming updates)
    const updateMessage = useCallback((messageId: string, updates: Partial<Message>) => {
        setData(prev => {
            if (!prev.activeSessionId) return prev;

            const existingSession = prev.sessions.find(s => s.id === prev.activeSessionId);
            if (!existingSession) return prev;

            // Check if update is actually needed (optimization for streaming)
            const msgIndex = existingSession.messages.findIndex(m => m.id === messageId);
            if (msgIndex === -1) return prev;

            const updatedMessages = [...existingSession.messages];
            updatedMessages[msgIndex] = { ...updatedMessages[msgIndex], ...updates };

            const updatedSession = {
                ...existingSession,
                messages: updatedMessages,
                updatedAt: Date.now(),
            };

            return {
                ...prev,
                sessions: prev.sessions.map(s =>
                    s.id === prev.activeSessionId ? updatedSession : s
                ),
            };
        });
    }, [setData]);

    // Delete session
    const deleteSession = useCallback((sessionId: string) => {
        setData(prev => {
            const newSessions = prev.sessions.filter(s => s.id !== sessionId);
            // If deleting active session, switch to the first available one or null
            let newActiveId = prev.activeSessionId;

            if (sessionId === prev.activeSessionId) {
                newActiveId = newSessions.length > 0 ? newSessions[0].id : null;
            }

            return {
                sessions: newSessions,
                activeSessionId: newActiveId,
            };
        });
    }, [setData]);

    // Rename session
    const renameSession = useCallback((sessionId: string, newTitle: string) => {
        setData(prev => ({
            ...prev,
            sessions: prev.sessions.map(s =>
                s.id === sessionId ? { ...s, title: newTitle, updatedAt: Date.now() } : s
            ),
        }));
    }, [setData]);

    return {
        sessions: data.sessions,
        activeSession,
        createSession,
        switchSession,
        addMessage,
        updateMessage,
        deleteSession,
        renameSession,
    };
}
