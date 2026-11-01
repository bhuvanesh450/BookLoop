import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Menu,
  Plus,
  Compass,
  BookMarked,
  Bell,
  Sparkles,
} from 'lucide-react';

export default function TopHeader({ onToggleSidebar, onOpenAddBook, currentTabTitle }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-950/70 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile Menu Toggle & Current Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <span>{currentTabTitle}</span>
          </h2>
        </div>
      </div>

      {/* Right: Quick Actions & Live Indicator */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] font-medium text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Peer Loop Active</span>
        </div>

        <button
          onClick={onOpenAddBook}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Book</span>
        </button>
      </div>
    </header>
  );
}
