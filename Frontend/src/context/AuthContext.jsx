import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('bookloop_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('bookloop_token') || null);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const login = (authToken, authUser) => {
    setToken(authToken);
    setUser(authUser);
    localStorage.setItem('bookloop_token', authToken);
    localStorage.setItem('bookloop_user', JSON.stringify(authUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('bookloop_token');
    localStorage.removeItem('bookloop_user');
    addToast('You have signed out successfully.', 'info');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('bookloop_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        setLoading,
        login,
        logout,
        updateUser,
        addToast,
      }}
    >
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            onClick={() => removeToast(t.id)}
            className={`pointer-events-auto px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md border text-sm font-medium flex items-center justify-between gap-3 animate-slide-up cursor-pointer transition-all ${
              t.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40'
                : t.type === 'error'
                ? 'bg-rose-950/90 text-rose-200 border-rose-500/40'
                : 'bg-indigo-950/90 text-indigo-200 border-indigo-500/40'
            }`}
          >
            <span className="flex-1">{t.message}</span>
            <span className="text-xs opacity-60 hover:opacity-100">✕</span>
          </div>
        ))}
      </div>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
