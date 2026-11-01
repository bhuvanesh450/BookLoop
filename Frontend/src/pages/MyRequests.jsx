import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  SendHorizontal,
  RotateCcw,
  Clock,
  User,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  BookOpen,
} from 'lucide-react';

export default function MyRequests({ onRequestsUpdated }) {
  const { addToast } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, APPROVED, RETURNED, REJECTED
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchMyRequests = async () => {
    setLoading(true);
    try {
      const res = await api.requests.getMyRequests();
      setRequests(res?.data || []);
      if (onRequestsUpdated) onRequestsUpdated();
    } catch (err) {
      console.error('Failed to load my requests:', err);
      addToast('Could not load your borrow requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const handleReturnBook = async (id, bookTitle) => {
    if (!window.confirm(`Confirm returning "${bookTitle}" to its owner?`)) {
      return;
    }

    setActionLoadingId(id);
    try {
      await api.requests.returnBook(id);
      addToast(`"${bookTitle}" returned successfully!`, 'success');
      fetchMyRequests();
    } catch (err) {
      addToast(err.message || 'Failed to return book', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (filter === 'ALL') return true;
    return r.status === filter;
  });

  const activeBorrowsCount = requests.filter((r) => r.status === 'APPROVED').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>My Borrowing Requests</span>
            {activeBorrowsCount > 0 && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {activeBorrowsCount} Active Loans
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track book requests you have sent to peers, view active borrows, and return books when finished.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 overflow-x-auto">
          {['ALL', 'PENDING', 'APPROVED', 'RETURNED', 'REJECTED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                filter === f
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f === 'APPROVED' ? 'ACTIVE BORROWS' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-5 rounded-2xl h-28 animate-pulse bg-slate-900/40"></div>
          ))}
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center max-w-md mx-auto my-8">
          <SendHorizontal className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No requests found</h3>
          <p className="text-xs text-slate-400 mt-1">
            Explore "Discover Books" to find academic texts and request them from classmates.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => {
            const isPending = req.status === 'PENDING';
            const isApproved = req.status === 'APPROVED';
            const isReturned = req.status === 'RETURNED';
            const isRejected = req.status === 'REJECTED';

            return (
              <div
                key={req.id}
                className={`glass-card p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all ${
                  isApproved ? 'border-cyan-500/30 bg-slate-900/80' : 'bg-slate-900/50'
                }`}
              >
                {/* Book & Owner Details */}
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  <img
                    src={req.book.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=200'}
                    alt={req.book.title}
                    className="w-16 h-22 object-cover rounded-xl border border-slate-700 shrink-0 shadow-md"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white truncate">{req.book.title}</h4>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                          isPending
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : isApproved
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-extrabold'
                            : isReturned
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {isApproved ? 'Active Borrow' : req.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-0.5">Author: {req.book.author}</p>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-300">
                      <div className="flex items-center gap-1.5 font-medium">
                        <User className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Owner: {req.owner.name}</span>
                        <span className="text-slate-500">({req.owner.email})</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Duration: <strong>{req.durationDays} days</strong></span>
                      </div>
                    </div>

                    {isApproved && (
                      <p className="text-xs text-cyan-400 mt-1.5 flex items-center gap-1 font-semibold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>You currently have this book in your possession.</span>
                      </p>
                    )}

                    {isReturned && (
                      <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Returned back to {req.owner.name}.</span>
                      </p>
                    )}

                    {req.rejectionReason && (
                      <p className="text-xs text-rose-400 mt-1">
                        Rejection reason: {req.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                  {isApproved ? (
                    <button
                      onClick={() => handleReturnBook(req.id, req.book.title)}
                      disabled={actionLoadingId === req.id}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-cyan-600/30 flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                      {actionLoadingId === req.id ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <RotateCcw className="w-4 h-4" />
                      )}
                      <span>Return Book Now</span>
                    </button>
                  ) : isPending ? (
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      Pending Owner Approval
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
