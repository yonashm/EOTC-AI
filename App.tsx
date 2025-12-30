
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { ChatSession, Message, Role } from './types';
import { geminiService } from './services/gemini';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with an empty session if none exist
  useEffect(() => {
    if (sessions.length === 0) {
      const newId = crypto.randomUUID();
      const initialSession: ChatSession = {
        id: newId,
        title: 'New Discussion',
        messages: [],
        lastModified: new Date()
      };
      setSessions([initialSession]);
      setActiveSessionId(newId);
    }
  }, [sessions.length]);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  const handleNewChat = useCallback(() => {
    const newId = crypto.randomUUID();
    const newSession: ChatSession = {
      id: newId,
      title: 'New Discussion',
      messages: [],
      lastModified: new Date()
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newId);
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!activeSessionId) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: Role.USER,
      content: text,
      timestamp: new Date()
    };

    // Optimistically update UI
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        const isFirstMessage = s.messages.length === 0;
        return {
          ...s,
          title: isFirstMessage ? text.slice(0, 30) + (text.length > 30 ? '...' : '') : s.title,
          messages: [...s.messages, userMessage],
          lastModified: new Date()
        };
      }
      return s;
    }));

    setIsLoading(true);

    try {
      const currentMessages = activeSession?.messages || [];
      const assistantMessageId = crypto.randomUUID();
      
      let assistantContent = '';
      
      // Initialize model message
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...s.messages, {
              id: assistantMessageId,
              role: Role.MODEL,
              content: '',
              timestamp: new Date()
            }]
          };
        }
        return s;
      }));

      await geminiService.sendMessageStream(currentMessages, text, (chunk) => {
        assistantContent += chunk;
        setSessions(prev => prev.map(s => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              messages: s.messages.map(m => 
                m.id === assistantMessageId ? { ...m, content: assistantContent } : m
              )
            };
          }
          return s;
        }));
      });

    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    handleSendMessage(`Tell me about ${categoryName} in the Ethiopian Orthodox Tewahedo Church.`);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden text-stone-900">
      <Sidebar 
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewChat={handleNewChat}
        onCategoryClick={handleCategoryClick}
      />
      <main className="flex-1 h-full relative">
        <ChatWindow 
          messages={activeSession?.messages || []}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
};

export default App;
