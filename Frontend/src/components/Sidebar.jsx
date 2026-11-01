import React from 'react';
import UserProfileBadge from './UserProfileBadge';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  Inbox,
  SendHorizontal,
  Settings,
  LogOut,
  Sparkles,
  BookMarked,
} from 'lucide-react';

export default function Sidebar({ currentTab, onNavigate, stats, isOpen, onClose }) {
  const { logout } = useAuth();

  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      desc: 'Books, Lendings & Borrowings',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'discover',
      label: 'Discover Books',
      desc: 'Find & Request Peer Books',
      icon: Compass,
      badge: null,
    },
    {
      id: 'collection',
      label: 'My Collection',
      desc: 'Add & Manage Owned Books',
      icon: BookOpen,
      badge: stats?.totalBooks > 0 ? stats.totalBooks : null,
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    },
    {
      id: 'incoming',
      label: 'Incoming Requests',
      desc: 'Approve or Reject Requests',
      icon: Inbox,
      badge: stats?.pendingIncomingRequests > 0 ? stats.pendingIncomingRequests : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse',
    },
    {
      id: 'requests',
      label: 'My Requests',
      desc: 'Track Borrows & Returns',
      icon: SendHorizontal,
      badge: stats?.pendingMyRequests > 0 ? stats.pendingMyRequests : null,
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    },
    {
      id: 'profile',
      label: 'Profile / Settings',
      desc: 'Manage Account Details',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900/90 backdrop-blur-xl border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Branding */}
        <div className="p-5 pb-3 border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-white font-sans">
                  Book<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Loop</span>
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Peer Academic Book Exchange</p>
            </div>
          </div>
        </div>

        {/* Top-Left User Profile as requested */}
        <div className="p-4 border-b border-slate-800/60 bg-slate-950/30">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 px-1 flex items-center justify-between">
            <span>Signed In Profile</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <UserProfileBadge onNavigate={onNavigate} />
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Navigation Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/25 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-1.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-800 text-slate-400 group-hover:text-indigo-400 group-hover:bg-slate-800/90'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="text-sm leading-tight truncate">{item.label}</div>
                    <div
                      className={`text-[11px] leading-tight truncate ${
                        isActive ? 'text-indigo-200' : 'text-slate-400'
                      }`}
                    >
                      {item.desc}
                    </div>
                  </div>
                </div>

                {item.badge !== null && item.badge !== undefined && (
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold border ${
                      isActive ? 'bg-white/20 text-white border-white/30' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer / Logout */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to log out of BookLoop?')) {
                logout();
              }
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all text-sm font-medium"
          >
            <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400">
              <LogOut className="w-4 h-4" />
            </div>
            <span>Logout / Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
