
import React from 'react';
import { CATEGORIES, APP_THEME } from '../constants';
import { ChatSession } from '../types';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onCategoryClick: (name: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  sessions, 
  activeSessionId, 
  onSelectSession, 
  onNewChat,
  onCategoryClick
}) => {
  return (
    <aside className="w-80 h-full bg-white border-r border-stone-200 flex flex-col overflow-hidden hidden md:flex">
      <div className="p-6 border-b border-stone-100 ethiopian-gradient">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <span>⛪</span> EOTC AI Assistant
        </h1>
        <p className="text-xs text-white/90 mt-1">Ethiopian Orthodox Tewahedo Church</p>
      </div>

      <div className="p-4">
        <button 
          onClick={onNewChat}
          className="w-full py-3 px-4 rounded-xl border-2 border-[#D4AF37] text-[#D4AF37] font-semibold hover:bg-[#D4AF37] hover:text-white transition-all flex items-center justify-center gap-2"
        >
          <span>➕</span> New Spiritual Inquiry
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-6">
        <div>
          <h2 className="px-4 text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Recent Discussions</h2>
          <div className="space-y-1">
            {sessions.map(session => (
              <button
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors flex items-center gap-3 ${
                  activeSessionId === session.id 
                    ? 'bg-amber-50 text-amber-900 border-l-4 border-amber-500' 
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <span className="truncate">{session.title || "New Discussion"}</span>
              </button>
            ))}
            {sessions.length === 0 && (
              <p className="px-4 text-sm text-stone-400 italic">No recent chats.</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="px-4 text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Knowledge Areas</h2>
          <div className="space-y-1">
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => onCategoryClick(category.name)}
                className="w-full text-left px-4 py-3 rounded-lg text-sm transition-colors group hover:bg-amber-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{category.icon}</span>
                  <div>
                    <p className="font-medium text-stone-800 group-hover:text-amber-900">{category.name}</p>
                    <p className="text-xs text-stone-500">{category.nameAmh}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-stone-50 text-xs text-stone-500 text-center border-t">
        <p>© 2024 EOTC AI Platform</p>
        <p className="mt-1">Dedicated to the glory of God</p>
      </div>
    </aside>
  );
};

export default Sidebar;
