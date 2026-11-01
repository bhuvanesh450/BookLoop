import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  BookOpen,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Plus,
  Compass,
  CheckCircle2,
  Calendar,
  Sparkles,
  BookMarked,
  User,
  RotateCcw,
} from 'lucide-react';

export default function Overview({ onNavigate, onOpenAddBook, onRefreshStats }) {
  const { user, addToast } = useAuth();
  const [stats, setStats] = useState({
    totalBooks: 0,
    activeLendings: 0,
    activeBorrowings: 0,
    pendingIncomingRequests: 0,
    pendingMyRequests: 0,
  });

  const [lendings, setLendings] = useState([]);
  const [borrowings, setBorrowings] = useState([]);
  const [myBooks, setMyBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOverviewData = async () => {
    setLoading(true);
    try {
      const [statsRes, incomingRes, myRequestsRes, booksRes] = await Promise.all([
        api.user.getStats(),
        api.requests.getIncoming(),
        api.requests.getMyRequests(),
        api.books.getMyBooks(),
      ]);

      if (statsRes?.data) setStats(statsRes.data);
      if (onRefreshStats && statsRes?.data) onRefreshStats(statsRes.data);

      // Active lendings: incoming requests that have status = 'APPROVED'
      const activeLends = (incomingRes?.data || []).filter(
        (r) => r.status === 'APPROVED'
      );
      setLendings(activeLends);

      // Active borrowings: my requests that have status = 'APPROVED'
      const activeBorrows = (myRequestsRes?.data || []).filter(
        (r) => r.status === 'APPROVED'
      );
      setBorrowings(activeBorrows);

      setMyBooks((booksRes?.data || []).slice(0, 4));
    } catch (err) {
      console.error('Failed to load overview data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const handleReturnBook = async (requestId) => {
    if (!window.confirm('Confirm returning this book to its owner?')) return;
    setActionLoading(true);
    try {
      await api.requests.returnBook(requestId);
      addToast('Book marked as returned successfully!', 'success');
      fetchOverviewData();
    } catch (err) {
      addToast(err.message || 'Failed to return book', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-slate-900/80 to-slate-950 p-6 sm:p-8 border border-indigo-500/20 shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Campus BookLoop Live Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">{user?.name}</span>!
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Track your academic book collection, oversee active book lendings to classmates, and manage books you've borrowed.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAddBook}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>List a Book</span>
            </button>
            <button
              onClick={() => onNavigate('discover')}
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 transition-all"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Discover Books</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: My Collection */}
        <div
          onClick={() => onNavigate('collection')}
          className="glass-card p-5 rounded-2xl cursor-pointer hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">My Collection</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-white">{stats.totalBooks}</div>
            <div className="text-xs text-indigo-300 mt-1 flex items-center gap-1">
              <span>Owned academic titles</span>
            </div>
          </div>
        </div>

        {/* Card 2: Active Lendings */}
        <div
          onClick={() => onNavigate('incoming')}
          className="glass-card p-5 rounded-2xl cursor-pointer hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Lendings</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-white">{stats.activeLendings}</div>
            <div className="text-xs text-emerald-300 mt-1 flex items-center gap-1">
              <span>Books lent to peers</span>
            </div>
          </div>
        </div>

        {/* Card 3: Active Borrowings */}
        <div
          onClick={() => onNavigate('requests')}
          className="glass-card p-5 rounded-2xl cursor-pointer hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Borrowings</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-white">{stats.activeBorrowings}</div>
            <div className="text-xs text-cyan-300 mt-1 flex items-center gap-1">
              <span>Books currently with you</span>
            </div>
          </div>
        </div>

        {/* Card 4: Pending Requests */}
        <div
          onClick={() => onNavigate('incoming')}
          className="glass-card p-5 rounded-2xl cursor-pointer hover:-translate-y-1 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Requests</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-white">
              {stats.pendingIncomingRequests + stats.pendingMyRequests}
            </div>
            <div className="text-xs text-amber-300 mt-1 flex items-center gap-1">
              <span>{stats.pendingIncomingRequests} incoming · {stats.pendingMyRequests} sent</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Lendings & Borrowings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Books I Have Lent Out */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Active Lendings</h3>
                <p className="text-xs text-slate-400">Books your peers are currently borrowing from you</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('incoming')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              View Requests →
            </button>
          </div>

          {lendings.length === 0 ? (
            <div className="text-center py-10 bg-slate-900/30 rounded-2xl border border-slate-800/60">
              <BookMarked className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-400">No active lendings right now</p>
              <p className="text-xs text-slate-500 mt-1">
                When a peer requests your book and you approve it, it appears here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {lendings.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.book.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=200'}
                      alt={item.book.title}
                      className="w-12 h-16 object-cover rounded-lg shrink-0 border border-slate-700"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{item.book.title}</h4>
                      <p className="text-xs text-slate-400 truncate">Borrower: {item.requester.name}</p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-emerald-400">
                        <Calendar className="w-3 h-3" />
                        <span>Due in {item.durationDays} days</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                    Lent Out
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Books I Have Borrowed */}
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Active Borrowings</h3>
                <p className="text-xs text-slate-400">Books you currently hold from other students</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('requests')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              All Borrows →
            </button>
          </div>

          {borrowings.length === 0 ? (
            <div className="text-center py-10 bg-slate-900/30 rounded-2xl border border-slate-800/60">
              <Compass className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-400">You haven't borrowed any books yet</p>
              <button
                onClick={() => onNavigate('discover')}
                className="mt-3 px-3.5 py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-semibold"
              >
                Discover Books to Borrow
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {borrowings.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.book.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=200'}
                      alt={item.book.title}
                      className="w-12 h-16 object-cover rounded-lg shrink-0 border border-slate-700"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{item.book.title}</h4>
                      <p className="text-xs text-slate-400 truncate">Owner: {item.owner.name}</p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-cyan-400">
                        <Clock className="w-3 h-3" />
                        <span>Duration: {item.durationDays} days</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleReturnBook(item.id)}
                    disabled={actionLoading}
                    className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Return</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Collection Preview */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Your Book Collection</h3>
              <p className="text-xs text-slate-400">Books you have uploaded for the campus loop</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('collection')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Manage Collection ({myBooks.length}) →
          </button>
        </div>

        {myBooks.length === 0 ? (
          <div className="text-center py-10 bg-slate-900/30 rounded-2xl border border-slate-800/60">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-400">Your collection is empty</p>
            <button
              onClick={onOpenAddBook}
              className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
            >
              + Add Your First Book
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {myBooks.map((b) => (
              <div key={b.id} className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                <img
                  src={b.imageUrl}
                  alt={b.title}
                  className="w-full h-36 object-cover rounded-xl mb-2.5 border border-slate-700/80"
                />
                <div>
                  <h4 className="text-sm font-bold text-white truncate" title={b.title}>{b.title}</h4>
                  <p className="text-xs text-slate-400 truncate">{b.author}</p>
                </div>
                <div className="mt-2.5 flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-semibold border border-indigo-500/20">
                    {b.genre || b.category || 'General'}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      b.status === 'AVAILABLE'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
