import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Filter,
  BookOpen,
  Calendar,
  Send,
  User,
  Sparkles,
  CheckCircle,
  Clock,
  GraduationCap,
  X,
  AlertCircle,
  Building,
} from 'lucide-react';

const GENRES = [
  'All',
  'Computer Science',
  'Artificial Intelligence',
  'Software Engineering',
  'Electronics & Comm',
  'Mechanical Engineering',
  'Mathematics',
  'Competitive Exams',
  'Literature & Fiction',
];

export default function DiscoverBooks() {
  const { addToast } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  // Request Modal State
  const [selectedBook, setSelectedBook] = useState(null);
  const [durationDays, setDurationDays] = useState(14);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await api.books.discover({
        genre: selectedGenre,
        search: search.trim(),
      });
      setBooks(res?.data || []);
    } catch (err) {
      console.error('Failed to discover books:', err);
      addToast('Could not load discoverable books', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBooks();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, selectedGenre]);

  const handleOpenBorrowModal = (book) => {
    setSelectedBook(book);
    setDurationDays(14);
    setNote('');
    setModalError('');
  };

  const handleCloseBorrowModal = () => {
    setSelectedBook(null);
    setModalError('');
  };

  const handleSubmitBorrowRequest = async (e) => {
    e.preventDefault();
    if (!selectedBook) return;

    setSubmitting(true);
    setModalError('');
    try {
      await api.requests.create({
        bookId: selectedBook.id,
        durationDays: parseInt(durationDays, 10),
        note: note.trim(),
      });

      addToast(`Borrow request sent to ${selectedBook.owner.name}!`, 'success');
      handleCloseBorrowModal();
      fetchBooks();
    } catch (err) {
      setModalError(err.message || 'Failed to submit borrow request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Discover Peer Books</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Campus Shelf
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Browse verified academic books shared by fellow students and send borrow requests.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author, subject..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-3 text-xs text-slate-500 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Genre Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-1" />
        {GENRES.map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGenre(g)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedGenre === g
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-card p-4 rounded-2xl h-80 animate-pulse bg-slate-900/40"></div>
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center max-w-md mx-auto my-8">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No books match your criteria</h3>
          <p className="text-xs text-slate-400 mt-1">
            Try searching with a different subject keyword or choose "All" categories.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedGenre('All');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {books.map((book) => (
            <div
              key={book.id}
              className="glass-card p-4 rounded-2xl flex flex-col justify-between group hover:-translate-y-1 transition-all"
            >
              <div>
                {/* Book Cover Image */}
                <div className="relative mb-3 overflow-hidden rounded-xl bg-slate-950 aspect-[3/4] border border-slate-800">
                  <img
                    src={book.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400'}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-slate-950/80 text-emerald-300 backdrop-blur-md border border-emerald-500/30">
                      {book.status}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-950/80 text-indigo-300 backdrop-blur-md border border-indigo-500/30">
                      {book.genre || book.category || 'General'}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-indigo-300 transition-colors" title={book.title}>
                  {book.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-1">{book.author}</p>

                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                    Condition: <strong className="text-indigo-300">{book.bookCondition}</strong>
                  </span>
                </div>

                {book.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 mt-2 font-normal">
                    {book.description}
                  </p>
                )}

                {/* Owner Info */}
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5 truncate">
                    <User className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate">{book.owner?.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0">
                    {book.owner?.department ? book.owner.department.split(' ')[0] : 'Campus'}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4">
                <button
                  onClick={() => handleOpenBorrowModal(book)}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Request to Borrow</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= BORROW REQUEST MODAL ================= */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-lg p-6 sm:p-7 rounded-3xl border border-indigo-500/30 shadow-2xl relative">
            <button
              onClick={handleCloseBorrowModal}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Send Borrowing Request</h3>
                <p className="text-xs text-slate-400">Owner will receive your request immediately</p>
              </div>
            </div>

            {modalError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{modalError}</span>
              </div>
            )}

            {/* Selected Book Summary Card */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3.5 mb-5">
              <img
                src={selectedBook.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=200'}
                alt={selectedBook.title}
                className="w-14 h-20 object-cover rounded-xl border border-slate-700 shrink-0"
              />
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-white truncate">{selectedBook.title}</h4>
                <p className="text-xs text-slate-400 truncate">Author: {selectedBook.author}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">
                    {selectedBook.genre}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Owner: <strong className="text-slate-200">{selectedBook.owner?.name}</strong>
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmitBorrowRequest} className="space-y-4">
              {/* Duration selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                  Requested Duration (Days)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[7, 14, 21, 30].map((days) => (
                    <button
                      type="button"
                      key={days}
                      onClick={() => setDurationDays(days)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        durationDays === days
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {days} Days
                    </button>
                  ))}
                </div>
              </div>

              {/* Note to Owner */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                  Note to Owner (Optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g., Hi! I am in 3rd year CSE preparing for exam/assignment. I'll take good care of the book."
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseBorrowModal}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Send Request Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
