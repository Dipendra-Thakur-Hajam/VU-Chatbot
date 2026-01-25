import { useState, useCallback } from 'react';
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

    const [activeSession, setActiveSession] = useState<ChatSession | null>(() => {
        return data.sessions.find(s => s.id === data.activeSessionId) || null;
    });

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
        setActiveSession(newSession);
        return newSession;
    }, [setData]);

    // Switch session
    const switchSession = useCallback((sessionId: string) => {
        const session = data.sessions.find(s => s.id === sessionId);
        if (session) {
            setData(prev => ({ ...prev, activeSessionId: sessionId }));
            setActiveSession(session);
        }
    }, [data.sessions, setData]);

    // Add message to active session
    const addMessage = useCallback((message: Omit<Message, 'id' | 'createdAt'>) => {
        if (!activeSession) return;

        const newMessage: Message = {
            ...message,
            id: generateId(),
            createdAt: Date.now(),
        };

        const updatedSession = {
            ...activeSession,
            messages: [...activeSession.messages, newMessage],
            updatedAt: Date.now(),
            // Update title from first user message
            title: activeSession.messages.length === 0 && message.role === 'user'
                ? generateTitle(message.content)
                : activeSession.title,
        };

        setData(prev => ({
            ...prev,
            sessions: prev.sessions.map(s =>
                s.id === activeSession.id ? updatedSession : s
            ),
        }));
        setActiveSession(updatedSession);
    }, [activeSession, setData]);

    // Update message (for feedback)
    const updateMessage = useCallback((messageId: string, updates: Partial<Message>) => {
        if (!activeSession) return;

        const updatedSession = {
            ...activeSession,
            messages: activeSession.messages.map(m =>
                m.id === messageId ? { ...m, ...updates } : m
            ),
            updatedAt: Date.now(),
        };

        setData(prev => ({
            ...prev,
            sessions: prev.sessions.map(s =>
                s.id === activeSession.id ? updatedSession : s
            ),
        }));
        setActiveSession(updatedSession);
    }, [activeSession, setData]);

    // Delete session
    const deleteSession = useCallback((sessionId: string) => {
        setData(prev => {
            const newSessions = prev.sessions.filter(s => s.id !== sessionId);
            const newActiveId = sessionId === prev.activeSessionId
                ? (newSessions[0]?.id || null)
                : prev.activeSessionId;

            return {
                sessions: newSessions,
                activeSessionId: newActiveId,
            };
        });

        if (sessionId === activeSession?.id && data.sessions.length > 1) {
            const nextSession = data.sessions.find(s => s.id !== sessionId);
            setActiveSession(nextSession || null);
        }
    }, [activeSession, data.sessions, setData]);

    // Rename session
    const renameSession = useCallback((sessionId: string, newTitle: string) => {
        setData(prev => ({
            ...prev,
            sessions: prev.sessions.map(s =>
                s.id === sessionId ? { ...s, title: newTitle, updatedAt: Date.now() } : s
            ),
        }));

        if (activeSession?.id === sessionId) {
            setActiveSession(prev => prev ? { ...prev, title: newTitle } : null);
        }
    }, [activeSession, setData]);

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
