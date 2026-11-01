import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, GraduationCap } from 'lucide-react';

export default function UserProfileBadge({ onNavigate }) {
  const { user } = useAuth();

  if (!user) return null;

  // Generate initials
  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <div 
      onClick={() => onNavigate && onNavigate('profile')}
      className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900/80 to-slate-950/90 border border-indigo-500/20 hover:border-indigo-500/40 transition-all cursor-pointer group shadow-lg shadow-indigo-950/20"
      title="View Profile / Account Settings"
    >
      <div className="flex items-center gap-3">
        {/* Avatar with glowing ring */}
        <div className="relative">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-bold text-base shadow-md group-hover:scale-105 transition-transform">
            {initials}
          </div>
          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center" title="Verified Account">
            <ShieldCheck className="w-2.5 h-2.5 text-white" />
          </span>
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
              {user.name}
            </h4>
          </div>
          <p className="text-xs text-slate-400 truncate">
            {user.email}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <GraduationCap className="w-3 h-3" />
              {user.department ? user.department.split(' ')[0] : 'B.Tech 3rd Yr'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
