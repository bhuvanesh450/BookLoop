import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Building,
  Lock,
  ShieldCheck,
  Save,
  KeyRound,
  AlertCircle,
  Sparkles,
  Calendar,
} from 'lucide-react';

export default function ProfileSettings() {
  const { user, updateUser, addToast } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    department: user?.department || 'Computer Science & Engineering',
    college: user?.college || 'B.Tech Engineering College',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Name cannot be empty.');
      return;
    }

    if (formData.newPassword) {
      if (!formData.currentPassword) {
        setError('Please enter your current password to set a new password.');
        return;
      }
      if (formData.newPassword.length < 6) {
        setError('New password must be at least 6 characters.');
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match.');
        return;
      }
    }

    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        department: formData.department.trim(),
        college: formData.college.trim(),
        ...(formData.newPassword
          ? {
              currentPassword: formData.currentPassword,
              newPassword: formData.newPassword,
            }
          : {}),
      };

      const res = await api.user.updateProfile(payload);
      if (res?.data) {
        updateUser(res.data);
      }
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <span>Student Profile & Settings</span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Account Details
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage your student credentials, college affiliation, and account security.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Student ID Card Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-slate-900/90 to-cyan-950/70 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-indigo-500/30">
              {initials}
            </div>
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center text-white">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="text-center sm:text-left flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="text-xl font-bold text-white truncate">{user?.name}</h3>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Verified Student
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-0.5 flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span>{user?.email}</span>
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                <span>{user?.department || 'B.Tech Computer Science'}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800">
                <Building className="w-3.5 h-3.5 text-cyan-400" />
                <span>{user?.college || 'B.Tech Campus Hub'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Edit Form */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
        <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-400" />
          <span>Edit Account Details</span>
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-400 cursor-not-allowed"
                title="Email is verified and cannot be altered directly"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +91 9876543210"
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                Department / Branch
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Electrical & Electronics">Electrical & Electronics</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Artificial Intelligence & DS">Artificial Intelligence & DS</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
              College / Institution
            </label>
            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={handleChange}
              placeholder="e.g. National Institute of Technology / Engineering College"
              className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Change Password Card */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>Change Password (Leave blank to keep current)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-type new password"
                  className="w-full px-3 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
