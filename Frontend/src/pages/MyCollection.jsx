import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Image,
  AlertCircle,
  X,
  Check,
  Sparkles,
  BookMarked,
  Layers,
} from 'lucide-react';

const PRESET_COVERS = [
  {
    name: 'Algorithms / CS',
    url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Operating Systems',
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'AI & Data Science',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Software Eng',
    url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop',
  },
  {
    name: 'Database Systems',
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format&fit=crop',
  },
];

export default function MyCollection({ isAddModalOpen, onCloseAddModal, onBookAdded }) {
  const { addToast } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: 'Computer Science',
    bookCondition: 'GOOD',
    description: '',
    imageUrl: PRESET_COVERS[0].url,
    status: 'AVAILABLE',
  });

  const fetchMyBooks = async () => {
    setLoading(true);
    try {
      const res = await api.books.getMyBooks();
      setBooks(res?.data || []);
    } catch (err) {
      console.error('Failed to load my books:', err);
      addToast('Could not load your collection', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBooks();
  }, []);

  // Sync external add modal trigger from header/overview
  useEffect(() => {
    if (isAddModalOpen) {
      handleOpenCreate();
    }
  }, [isAddModalOpen]);

  const handleOpenCreate = () => {
    setEditingBook(null);
    setFormData({
      title: '',
      author: '',
      isbn: '',
      genre: 'Computer Science',
      bookCondition: 'GOOD',
      description: '',
      imageUrl: PRESET_COVERS[0].url,
      status: 'AVAILABLE',
    });
    setError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn || '',
      genre: book.genre,
      bookCondition: book.bookCondition || 'GOOD',
      description: book.description || '',
      imageUrl: book.imageUrl || PRESET_COVERS[0].url,
      status: book.status || 'AVAILABLE',
    });
    setError('');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingBook(null);
    setError('');
    if (onCloseAddModal) onCloseAddModal();
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSaveBook = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Book title is required.');
      return;
    }
    if (!formData.author.trim()) {
      setError('Author name is required.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        ...formData,
        category: formData.genre,
        genre: formData.genre,
      };

      if (editingBook) {
        await api.books.update(editingBook.id, payload);
        addToast(`"${formData.title}" updated successfully!`, 'success');
      } else {
        await api.books.create(payload);
        addToast(`"${formData.title}" added to your collection!`, 'success');
      }
      handleCloseModal();
      fetchMyBooks();
      if (onBookAdded) onBookAdded();
    } catch (err) {
      setError(err.message || 'Failed to save book.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBook = async (book) => {
    if (book.status === 'BORROWED') {
      addToast('Cannot delete a book that is currently lent out!', 'error');
      return;
    }

    if (!window.confirm(`Are you sure you want to remove "${book.title}" from your collection?`)) {
      return;
    }

    try {
      await api.books.delete(book.id);
      addToast(`"${book.title}" removed from collection.`, 'info');
      fetchMyBooks();
      if (onBookAdded) onBookAdded();
    } catch (err) {
      addToast(err.message || 'Failed to delete book', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>My Book Collection</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {books.length} Books
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Add, update, or remove academic textbooks and reference materials you own.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Book</span>
        </button>
      </div>

      {/* Collection Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card p-4 rounded-2xl h-80 animate-pulse bg-slate-900/40"></div>
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center max-w-md mx-auto my-8">
          <BookMarked className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">Your collection is empty</h3>
          <p className="text-xs text-slate-400 mt-1">
            Share textbooks and engineering references with your classmates to build the loop!
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
          >
            + Add Your First Book
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
                <div className="relative mb-3 overflow-hidden rounded-xl bg-slate-950 aspect-[3/4] border border-slate-800">
                  <img
                    src={book.imageUrl || PRESET_COVERS[0].url}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${
                        book.status === 'AVAILABLE'
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                          : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {book.status}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-950/80 text-indigo-300 border border-indigo-500/30">
                      {book.genre || book.category || 'General'}
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white line-clamp-1" title={book.title}>
                  {book.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-1">{book.author}</p>

                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                    Condition: <strong className="text-indigo-300">{book.bookCondition}</strong>
                  </span>
                </div>

                {book.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 mt-2">
                    {book.description}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(book)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteBook(book)}
                  disabled={book.status === 'BORROWED'}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-transparent hover:border-rose-500/30 transition-all disabled:opacity-40"
                  title={book.status === 'BORROWED' ? 'Cannot delete while lent out' : 'Delete Book'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= ADD / EDIT BOOK MODAL ================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="glass-panel w-full max-w-lg p-6 sm:p-7 rounded-3xl border border-indigo-500/30 shadow-2xl relative my-8">
            <button
              onClick={handleCloseModal}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">
                  {editingBook ? 'Edit Book Details' : 'Add Book to Collection'}
                </h3>
                <p className="text-xs text-slate-400">
                  {editingBook ? 'Update book info and status' : 'Make your textbook discoverable to peers'}
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSaveBook} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                  Book Title <span className="text-indigo-400">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="e.g., Computer Networks (Tanenbaum)"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                    Author <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleFormChange}
                    placeholder="e.g., Andrew S. Tanenbaum"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                    ISBN (Optional)
                  </label>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleFormChange}
                    placeholder="e.g., 978-0132126953"
                    className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                    Category / Genre
                  </label>
                  <select
                    name="genre"
                    value={formData.genre}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Electronics & Comm">Electronics & Comm</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Competitive Exams">Competitive Exams (GATE/GRE)</option>
                    <option value="Literature & Fiction">Literature & Fiction</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                    Condition
                  </label>
                  <select
                    name="bookCondition"
                    value={formData.bookCondition}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="NEW">New (Pristine)</option>
                    <option value="LIKE_NEW">Like New (Barely used)</option>
                    <option value="GOOD">Good (Lightly used / notes)</option>
                    <option value="FAIR">Fair (Readable / wear)</option>
                  </select>
                </div>
              </div>

              {/* Book Cover URL */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                  Cover Image URL (Optional)
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleFormChange}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                  Description / Edition Notes
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={2}
                  placeholder="e.g., 5th Global Edition. Includes highlighted summaries for Semester 6."
                  className="w-full px-3.5 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {editingBook && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                    Availability Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="AVAILABLE">AVAILABLE (Open for borrow requests)</option>
                    <option value="BORROWED">BORROWED (Currently out on loan)</option>
                  </select>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingBook ? 'Save Changes' : 'Add to Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
