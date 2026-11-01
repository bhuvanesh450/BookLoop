import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  BookMarked,
  Mail,
  Lock,
  User,
  GraduationCap,
  KeyRound,
  ArrowRight,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  BookOpen,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Share2,
} from 'lucide-react';

export default function AuthModal() {
  const { login, addToast } = useAuth();

  // Mode: 'auth' (Step 1) or 'otp' (Step 2)
  const [step, setStep] = useState('auth'); // 'auth' | 'otp'
  const [authMode, setAuthMode] = useState('otp-flow'); // 'otp-flow' | 'password-login'
  const [showPassword, setShowPassword] = useState(false);

  // Form data: dynamic typing, zero fake prefilled mock values like 'alex'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    department: 'Computer Science & Engineering',
    college: 'B.Tech Engineering College',
  });

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  // Step 1: Submit Details & Trigger OTP
  const handleInitiateAuth = async (e) => {
    e.preventDefault();
    setError('');

    if (authMode === 'otp-flow' && !formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!formData.password) {
      setError('Please enter your password.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (authMode === 'password-login') {
        const res = await api.auth.directLogin({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        });

        if (res.token && res.user) {
          login(res.token, res.user);
          addToast('Welcome back to BookLoop!', 'success');
        } else {
          setError(res.message || 'Login failed.');
        }
      } else {
        const res = await api.auth.loginOrRegister({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          phone: formData.phone.trim() || undefined,
          department: formData.department.trim() || undefined,
          college: formData.college.trim() || undefined,
        });

        if (res.requiresOtp) {
          setStep('otp');
          setOtp(['', '', '', '', '', '']);
          addToast(res.message || 'OTP sent! Please check your email inbox.', 'info');
        } else if (res.token && res.user) {
          login(res.token, res.user);
          addToast('Welcome to BookLoop!', 'success');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication error. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Handle individual OTP inputs
  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Paste handling
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        newOtp[i] = d;
      });
      setOtp(newOtp);
      const nextInput = document.getElementById(`otp-${Math.min(digits.length, 5)}`);
      if (nextInput) nextInput.focus();
      return;
    }

    const cleanVal = value.replace(/\D/g, '');
    const newOtp = [...otp];
    newOtp[index] = cleanVal;
    setOtp(newOtp);

    // Auto-advance
    if (cleanVal && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Step 2: Verify 6-digit OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');

    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.auth.verifyOtp({
        email: formData.email.trim().toLowerCase(),
        otp: fullOtp,
      });

      if (res.success && res.token && res.user) {
        login(res.token, res.user);
        addToast('Verification successful! Welcome to BookLoop.', 'success');
      } else {
        setError(res.message || 'Invalid or expired OTP code.');
      }
    } catch (err) {
      setError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    setError('');
    try {
      const res = await api.auth.resendOtp({
        email: formData.email.trim().toLowerCase(),
      });
      addToast(res.message || 'A new verification code has been dispatched.', 'info');
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      setError(err.message || 'Failed to resend code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center relative overflow-hidden font-sans">
      {/* Dynamic Background Auras */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-indigo-600/15 to-cyan-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-purple-600/10 to-indigo-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      
      {/* Decorative Grid Lines */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ================= LEFT HERO SHOWCASE ================= */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Top Brand Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-xl shadow-lg shadow-indigo-950/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-white">B.Tech 3rd Year Academic Network</span>
              <span className="text-slate-500">|</span>
              <span className="text-indigo-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Live Book Loop
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Share Knowledge. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-300">
                  Zero Textbook Barriers.
                </span>
              </h1>
              <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                BookLoop is the premier peer-to-peer campus exchange where engineering students lend, borrow, and circulate textbooks, reference manuals, and lecture prep materials.
              </p>
            </div>

            {/* Feature Perks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md text-left">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                  <Share2 className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Peer-to-Peer</h4>
                <p className="text-xs text-slate-400 mt-1 leading-snug">
                  Borrow directly from classmates in your department with zero intermediaries.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md text-left">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Email OTP Verified</h4>
                <p className="text-xs text-slate-400 mt-1 leading-snug">
                  Authentic campus security ensuring trusted handovers and safe book loops.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md text-left">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">Live Tracking</h4>
                <p className="text-xs text-slate-400 mt-1 leading-snug">
                  Track active borrowings, approve incoming requests, and return books easily.
                </p>
              </div>
            </div>

            {/* Campus Metrics Bar */}
            <div className="pt-4 border-t border-slate-800/60 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                <span>Active Branch Collections</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>Real-Time Request Approval</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Zero Late Fees Guaranteed</span>
              </div>
            </div>
          </div>

          {/* ================= RIGHT AUTHENTICATION CARD ================= */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-2xl border border-indigo-500/20 relative">
              
              {/* Header Branding */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
                    <BookMarked className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white tracking-tight">
                      Book<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Loop</span>
                    </h2>
                    <p className="text-[11px] text-slate-400 font-medium">Campus Peer Portal</p>
                  </div>
                </div>

                <div className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {step === 'otp' ? 'Step 2 of 2' : 'Authentication'}
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2.5 animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {step === 'auth' ? (
                /* ================= STEP 1: AUTHENTICATION FORM ================= */
                <div>
                  {/* Mode Selector */}
                  <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 mb-5">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('otp-flow');
                        setError('');
                      }}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        authMode === 'otp-flow'
                          ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Sign In / Register (OTP)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('password-login');
                        setError('');
                      }}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        authMode === 'password-login'
                          ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Direct Password
                    </button>
                  </div>

                  <form onSubmit={handleInitiateAuth} className="space-y-4">
                    {authMode === 'otp-flow' && (
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                          Full Name <span className="text-indigo-400">*</span>
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your student name"
                            required={authMode === 'otp-flow'}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                        Email Address <span className="text-indigo-400">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="student@college.edu or personal email"
                          required
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                          Password <span className="text-indigo-400">*</span>
                        </label>
                        <span className="text-[10px] text-slate-500">Min 6 characters</span>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter your password"
                          required
                          className="w-full pl-10 pr-10 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-3 text-slate-500 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {authMode === 'otp-flow' && (
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                          Department / Branch
                        </label>
                        <div className="relative">
                          <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                          <select
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                          >
                            <option value="Computer Science & Engineering">CSE (Computer Science)</option>
                            <option value="Information Technology">IT (Information Technology)</option>
                            <option value="Electronics & Communication">ECE (Electronics & Comm)</option>
                            <option value="Electrical & Electronics">EEE (Electrical)</option>
                            <option value="Mechanical Engineering">Mechanical Engineering</option>
                            <option value="Artificial Intelligence & DS">AI & Data Science</option>
                          </select>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 group transition-all disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Authenticating...</span>
                        </>
                      ) : (
                        <>
                          <span>{authMode === 'otp-flow' ? 'Send Verification OTP' : 'Sign In Now'}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-center text-slate-400 mt-2">
                      {authMode === 'otp-flow' 
                        ? '🔒 A 6-digit OTP will be dispatched to your email for authentication.'
                        : '🔑 Direct access for students with an existing verified account.'}
                    </p>
                  </form>
                </div>
              ) : (
                /* ================= STEP 2: CLEAN OTP VERIFICATION ================= */
                /* NO DEV OTP BANNER SHOWN ON SCREEN AS EXPLICITLY REQUESTED */
                <form onSubmit={handleVerifyOtp} className="space-y-6 animate-fade-in">
                  <div className="text-center space-y-1">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto mb-3">
                      <KeyRound className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Enter Authentication OTP</h3>
                    <p className="text-xs text-slate-400">
                      A 6-digit verification code was sent to:
                    </p>
                    <p className="text-xs font-semibold text-indigo-300">
                      {formData.email}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      (Please check your email inbox or backend console logs. Valid for 10 minutes.)
                    </p>
                  </div>

                  {/* 6 Individual Digit Boxes */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block text-center mb-3">
                      6-Digit Security Code
                    </label>
                    <div className="flex items-center justify-center gap-2">
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`otp-${idx}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          autoFocus={idx === 0}
                          className="w-11 h-13 text-center text-xl font-bold font-mono bg-slate-900 border border-indigo-500/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <button
                      type="submit"
                      disabled={loading || otp.join('').length !== 6}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 group transition-all disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Verifying OTP...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Verify & Access Dashboard</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-between text-xs pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setStep('auth');
                          setError('');
                        }}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        ← Back / Change Email
                      </button>

                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={resending}
                        className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3 h-3 ${resending ? 'animate-spin' : ''}`} />
                        <span>Resend OTP</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
