import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Inbox,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  MessageSquare,
  AlertCircle,
  RefreshCw,
  BookOpen,
} from 'lucide-react';

export default function IncomingRequests({ onRequestsUpdated }) {
  const { addToast } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, APPROVED, REJECTED
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Reject modal state
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchIncoming = async () => {
    setLoading(true);
    try {
      const res = await api.requests.getIncoming();
      setRequests(res?.data || []);
      if (onRequestsUpdated) onRequestsUpdated();
    } catch (err) {
      console.error('Failed to load incoming requests:', err);
      addToast('Could not load incoming requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncoming();
  }, []);

  const handleApprove = async (id, bookTitle, requesterName) => {
    setActionLoadingId(id);
    try {
      await api.requests.approve(id);
      addToast(`Approved! "${bookTitle}" has been lent to ${requesterName}.`, 'success');
      fetchIncoming();
    } catch (err) {
      addToast(err.message || 'Failed to approve request', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleOpenRejectModal = (id) => {
    setRejectingId(id);
    setRejectReason('');
  };

  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!rejectingId) return;

    setActionLoadingId(rejectingId);
    try {
      await api.requests.reject(rejectingId, rejectReason.trim() || 'Declined by owner');
      addToast('Borrow request rejected.', 'info');
      setRejectingId(null);
      fetchIncoming();
    } catch (err) {
      addToast(err.message || 'Failed to reject request', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (filter === 'ALL') return true;
    return r.status === filter;
  });

  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Incoming Borrow Requests</span>
            {pendingCount > 0 && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                {pendingCount} Pending Action
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Review and approve or reject borrowing requests made by fellow students for your books.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === f
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f}
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
          <Inbox className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No requests found</h3>
          <p className="text-xs text-slate-400 mt-1">
            {filter === 'PENDING'
              ? 'Great news! You have cleared all pending incoming requests.'
              : 'When students request to borrow books from your collection, they will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => {
            const isPending = req.status === 'PENDING';
            const isApproved = req.status === 'APPROVED';
            const isRejected = req.status === 'REJECTED';
            const isReturned = req.status === 'RETURNED';

            return (
              <div
                key={req.id}
                className={`glass-card p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all ${
                  isPending ? 'border-amber-500/30 bg-slate-900/80' : 'bg-slate-900/50'
                }`}
              >
                {/* Book & Requester Details */}
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
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : isReturned
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-0.5">Author: {req.book.author}</p>

                    {/* Requester Profile Snapshot */}
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-300">
                      <div className="flex items-center gap-1.5 font-medium">
                        <User className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{req.requester.name}</span>
                        <span className="text-slate-500">({req.requester.email})</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Duration: <strong>{req.durationDays} days</strong></span>
                      </div>
                    </div>

                    {req.note && (
                      <div className="mt-2.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-1.5 max-w-xl">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                        <span className="italic font-normal">"{req.note}"</span>
                      </div>
                    )}

                    {req.rejectionReason && (
                      <p className="text-xs text-rose-400 mt-1">
                        Reason: {req.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                  {isPending ? (
                    <>
                      <button
                        onClick={() => handleApprove(req.id, req.book.title, req.requester.name)}
                        disabled={actionLoadingId === req.id}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-all disabled:opacity-50"
                      >
                        {actionLoadingId === req.id ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <CheckCircle className="w-3.5 h-3.5" />
                        )}
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => handleOpenRejectModal(req.id)}
                        disabled={actionLoadingId === req.id}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-200 border border-slate-700 hover:border-rose-500/40 font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </>
                  ) : (
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">
                        {isApproved ? 'Book Lent Out' : isReturned ? 'Book Returned' : 'Request Resolved'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-rose-500/30 shadow-2xl relative">
            <h3 className="text-base font-bold text-white mb-2">Reject Borrow Request</h3>
            <p className="text-xs text-slate-400 mb-4">
              Optionally provide a reason why this request cannot be approved right now.
            </p>
            <form onSubmit={handleConfirmReject} className="space-y-4">
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g., Currently preparing for an exam with this textbook."
                rows={3}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setRejectingId(null)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
