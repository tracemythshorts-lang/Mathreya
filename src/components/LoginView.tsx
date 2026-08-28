import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  Mail,
  ArrowRight,
  User,
  ShieldCheck,
  Phone,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Camera,
  RefreshCw,
  Sparkles,
  KeyRound,
} from 'lucide-react';
import { UserProfile } from '../types';
import { triggerHapticFeedback } from '../utils/haptics';
import { useAuth } from '../context/AuthContext';

interface LoginViewProps {
  onLoginSuccess: (user: Partial<UserProfile>) => void;
  onContinueAsGuest: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const {
    signupWithEmail,
    loginWithEmail,
    sendPasswordRecovery,
    setUserPhotoUrl,
    error: authError,
  } = useAuth();

  // Top Tabs
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('register');

  // Registration Form Fields — all start empty
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [password, setPassword] = useState('');
  const [stage, setStage] = useState<'pregnancy_prenatal' | 'puberty' | 'husband'>('pregnancy_prenatal');

  // Password Recovery Modal
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState(false);

  // Security Verification Modal (face / PIN) — shown after email verified or login
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [pendingUser, setPendingUser] = useState<Partial<UserProfile> | null>(null);
  const [securityMode, setSecurityMode] = useState<'face' | 'pin'>('face');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [securityPin, setSecurityPin] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // General states
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => { stopCamera(); };
  }, []);

  // ── Camera helpers ────────────────────────────────────────────────────────
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch {
      setCameraError('Camera access unavailable. Use Security PIN instead.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 320;
    canvas.height = video.videoHeight || 240;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedPhoto(dataUrl);
      stopCamera();
      triggerHapticFeedback('success');
    }
  };

  // ── Register / Login submit ───────────────────────────────────────────────
  // Register flow: Create account → store all prefs → show security step
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHapticFeedback('success');
    setLoading(true);
    setLocalError(null);

    try {
      if (activeTab === 'register') {
        if (!name.trim()) throw new Error('Please enter your full name.');
        if (!dob) throw new Error('Please enter your date of birth.');
        if (!emailInput || !emailInput.includes('@')) throw new Error('Please enter a valid email address.');
        if (!phoneInput.trim()) throw new Error('Please enter your mobile phone number.');
        if (!password || password.length < 8) throw new Error('Password must be at least 8 characters long.');

        // Create account + store all data (name, email, password, phone, dob, stage)
        await signupWithEmail(name, dob, emailInput, password, stage, phoneInput);

        setPendingUser({ name, email: emailInput, phone: phoneInput, stage, isAuthenticated: true });
        setShowSecurityModal(true);
        startCamera();
      } else {
        // Sign In: email + password
        if (!emailInput || !password) throw new Error('Please enter your email address and password.');
        await loginWithEmail(emailInput, password);
        setPendingUser({ email: emailInput, isAuthenticated: true });
        setShowSecurityModal(true);
        startCamera();
      }
    } catch (err: any) {
      setLocalError(err.message || 'Authentication failed. Please check your entries.');
    } finally {
      setLoading(false);
    }
  };

  // ── Security step completion ───────────────────────────────────────────────
  const handleCompleteSecurityStep = () => {
    if (securityMode === 'face' && capturedPhoto) {
      setUserPhotoUrl(capturedPhoto);
    }
    stopCamera();
    setShowSecurityModal(false);
    if (pendingUser) onLoginSuccess(pendingUser);
  };

  // ── Password recovery ─────────────────────────────────────────────────────
  const handleSendRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);
    try {
      await sendPasswordRecovery(recoveryEmail);
      setRecoverySuccess(true);
    } catch (err: any) {
      setLocalError(err.message || 'Password recovery failed.');
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen w-full bg-[#FFF8F5] flex flex-col p-4 sm:p-8 select-none text-[#4D2D22]">

      {/* BRAND HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto text-center space-y-3 pt-2 sm:pt-4"
      >
        <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto filter drop-shadow-md">
          <img
            src="assets/logo.png"
            alt="Mathreya - A Care That Feels Like Home"
            className="w-full h-full object-contain"
          />
        </div>

        {/* TAB SWITCH */}
        <div className="flex bg-[#F7EAE2] p-1 rounded-2xl border border-[#EADCD1] max-w-xs mx-auto">
          {(['login', 'register'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                triggerHapticFeedback('light');
                setActiveTab(tab);
                setLocalError(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-serif font-extrabold transition cursor-pointer text-center ${
                activeTab === tab
                  ? 'bg-[#B76A4B] text-white shadow-2xs'
                  : 'text-[#8B756A] hover:text-[#4D2D22]'
              }`}
            >
              {tab === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ERROR BANNER */}
      <AnimatePresence>
        {(localError || authError) && (
          <motion.div
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full max-w-md mx-auto mt-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-2xl flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{localError || authError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN FORM */}
      <motion.form
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleFormSubmit}
        className="w-full max-w-md mx-auto space-y-3.5 mt-4"
      >
        {activeTab === 'register' ? (
          /* ─── REGISTER FORM ─────────────────────────────────────────────── */
          <>
            {/* 1. Full Name */}
            <div>
              <label className="block text-xs font-bold text-[#8B756A] mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-[#EADCD1] text-xs sm:text-sm text-[#4D2D22] focus:outline-none focus:ring-2 focus:ring-[#B76A4B] font-medium shadow-2xs"
                  placeholder="Enter your full name"
                />
                <User className="w-4 h-4 text-[#8B756A] absolute right-3.5 top-3.5" />
              </div>
            </div>

            {/* 2. Date of Birth */}
            <div>
              <label className="block text-xs font-bold text-[#8B756A] mb-1">
                Date of Birth <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-[#EADCD1] text-xs sm:text-sm text-[#4D2D22] focus:outline-none focus:ring-2 focus:ring-[#B76A4B] font-medium shadow-2xs"
                />
                <Calendar className="w-4 h-4 text-[#8B756A] absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* 3. Email Address */}
            <div>
              <label className="block text-xs font-bold text-[#8B756A] mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-[#EADCD1] text-xs sm:text-sm text-[#4D2D22] focus:outline-none focus:ring-2 focus:ring-[#B76A4B] font-medium shadow-2xs"
                  placeholder="your@email.com"
                />
                <Mail className="w-4 h-4 text-[#8B756A] absolute right-3.5 top-3.5" />
              </div>
            </div>

            {/* 4. Phone Number (mandatory, no OTP) */}
            <div>
              <label className="block text-xs font-bold text-[#8B756A] mb-1">
                Mobile Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-[#EADCD1] text-xs sm:text-sm text-[#4D2D22] focus:outline-none focus:ring-2 focus:ring-[#B76A4B] font-medium shadow-2xs"
                  placeholder="+91 98765 43210"
                />
                <Phone className="w-4 h-4 text-[#8B756A] absolute right-3.5 top-3.5" />
              </div>
            </div>

            {/* 5. Password */}
            <div>
              <label className="block text-xs font-bold text-[#8B756A] mb-1">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-[#EADCD1] text-xs sm:text-sm text-[#4D2D22] focus:outline-none focus:ring-2 focus:ring-[#B76A4B] font-medium shadow-2xs"
                  placeholder="Minimum 8 characters"
                />
                <Lock className="w-4 h-4 text-[#8B756A] absolute right-3.5 top-3.5" />
              </div>
            </div>

            {/* 6. Primary Life Stage */}
            <div>
              <label className="block text-xs font-bold text-[#8B756A] mb-1">Primary Life Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as any)}
                className="w-full px-4 py-3 rounded-2xl bg-white border border-[#EADCD1] text-xs sm:text-sm text-[#4D2D22] focus:outline-none font-medium shadow-2xs"
              >
                <option value="pregnancy_prenatal">Pregnancy &amp; Maternity Care</option>
                <option value="puberty">Puberty &amp; Cycle Guide</option>
                <option value="husband">Partner Sync Hub</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#B76A4B] hover:bg-[#A05A3B] disabled:opacity-60 text-white font-serif font-extrabold rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 mt-2"
            >
              <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        ) : (
          /* ─── SIGN IN FORM ───────────────────────────────────────────────── */
          <>
            <div>
              <label className="block text-xs font-bold text-[#8B756A] mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-[#EADCD1] text-xs sm:text-sm text-[#4D2D22] focus:outline-none focus:ring-2 focus:ring-[#B76A4B] font-medium shadow-2xs"
                  placeholder="your@email.com"
                />
                <Mail className="w-4 h-4 text-[#8B756A] absolute right-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-[#8B756A]">Password</label>
                <button
                  type="button"
                  onClick={() => { setShowRecoveryModal(true); setLocalError(null); }}
                  className="text-[11px] font-bold text-[#B76A4B] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-[#EADCD1] text-xs sm:text-sm text-[#4D2D22] focus:outline-none focus:ring-2 focus:ring-[#B76A4B] font-medium shadow-2xs"
                  placeholder="Enter your password"
                />
                <Lock className="w-4 h-4 text-[#8B756A] absolute right-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#B76A4B] hover:bg-[#A05A3B] disabled:opacity-60 text-white font-serif font-extrabold rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 mt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}
      </motion.form>

      {/* FOOTER */}
      <div className="w-full max-w-md mx-auto text-center mt-6 mb-2">
        <p className="text-[10px] text-[#8B756A] flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Safe &amp; Encrypted Authentication
        </p>
      </div>

      {/* ─── SECURITY VERIFICATION MODAL ──────────────────────────────────── */}
      <AnimatePresence>
        {showSecurityModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-[#F0E8DD] space-y-4 text-[#3D251E]"
            >
              <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                <h3 className="text-base font-serif font-extrabold text-[#5E2211] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#C85A32]" />
                  {activeTab === 'register' ? 'Enroll Device Security' : 'Verify Security Identity'}
                </h3>
                <span className="text-[10px] font-bold bg-[#FFF5ED] text-[#8B3012] px-2.5 py-1 rounded-full border border-[#F4D9CC]">
                  {activeTab === 'register' ? 'Step 3 of 3' : 'Step 2 of 2'}
                </span>
              </div>

              {/* Mode Switcher */}
              <div className="flex bg-[#F7EAE2] p-1 rounded-xl border border-[#EADCD1]">
                <button
                  type="button"
                  onClick={() => { setSecurityMode('face'); if (!cameraActive) startCamera(); }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    securityMode === 'face' ? 'bg-white text-[#B76A4B] shadow-2xs' : 'text-[#8B756A]'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" /> Face Capture
                </button>
                <button
                  type="button"
                  onClick={() => { setSecurityMode('pin'); stopCamera(); }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    securityMode === 'pin' ? 'bg-white text-[#B76A4B] shadow-2xs' : 'text-[#8B756A]'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" /> Security PIN
                </button>
              </div>

              {securityMode === 'face' ? (
                <div className="space-y-3 text-center">
                  <p className="text-xs text-stone-600 font-medium">
                    {capturedPhoto
                      ? 'Face captured! Your photo will be used as your profile avatar.'
                      : 'Position your face in the camera view below.'}
                  </p>

                  <div className="relative w-48 h-48 mx-auto rounded-3xl overflow-hidden border-4 border-[#B76A4B]/20 bg-stone-100 flex items-center justify-center shadow-inner">
                    <canvas ref={canvasRef} className="hidden" />
                    {capturedPhoto ? (
                      <img src={capturedPhoto} alt="Captured Face" className="w-full h-full object-cover" />
                    ) : cameraActive ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transform -scale-x-100"
                      />
                    ) : (
                      <div className="p-4 text-center space-y-2">
                        <Camera className="w-8 h-8 text-stone-400 mx-auto" />
                        <p className="text-[11px] text-stone-500">{cameraError || 'Camera inactive'}</p>
                        <button
                          type="button"
                          onClick={startCamera}
                          className="px-3 py-1 bg-[#B76A4B] text-white text-[11px] font-bold rounded-lg"
                        >
                          Start Camera
                        </button>
                      </div>
                    )}
                  </div>

                  {!capturedPhoto && cameraActive && (
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="px-4 py-2 bg-[#B76A4B] hover:bg-[#A05A3B] text-white font-bold rounded-xl text-xs flex items-center gap-2 mx-auto cursor-pointer"
                    >
                      <Camera className="w-4 h-4" /> Capture Face Photo
                    </button>
                  )}

                  {capturedPhoto && (
                    <button
                      type="button"
                      onClick={() => { setCapturedPhoto(null); startCamera(); }}
                      className="text-xs text-[#B76A4B] font-bold hover:underline flex items-center gap-1 mx-auto cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" /> Retake Photo
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-stone-600 font-medium">
                    {activeTab === 'register'
                      ? 'Set a 4-digit Security PIN to protect your account.'
                      : 'Enter your 4-digit Security PIN to verify login.'}
                  </p>
                  <div>
                    <label className="block text-xs font-bold text-[#8B756A] mb-1">Security PIN</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={securityPin}
                      onChange={(e) => setSecurityPin(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-[#FCFAF7] border border-[#EAE0D2] text-center font-mono text-lg font-bold tracking-widest focus:outline-none focus:border-[#B76A4B]"
                      placeholder="••••"
                    />
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleCompleteSecurityStep}
                className="w-full py-3.5 bg-[#B76A4B] hover:bg-[#A05A3B] text-white font-serif font-extrabold rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>Complete &amp; Enter Sanctuary</span>
                <Sparkles className="w-4 h-4 text-amber-200" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── PASSWORD RECOVERY MODAL ──────────────────────────────────────── */}
      <AnimatePresence>
        {showRecoveryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border border-[#F0E8DD] space-y-4 text-[#3D251E]"
            >
              <h3 className="text-lg font-serif font-bold text-[#5E2211]">Password Recovery</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Enter your registered email to receive a password reset link.
              </p>

              {recoverySuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Recovery link sent! Check your inbox.
                </div>
              ) : (
                <form onSubmit={handleSendRecovery} className="space-y-3">
                  {localError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-xl">
                      {localError}
                    </div>
                  )}
                  <input
                    type="email"
                    required
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#FCFAF7] border border-[#EAE0D2] text-xs text-[#4D2D22] focus:outline-none focus:ring-2 focus:ring-[#B76A4B] font-medium"
                    placeholder="your@email.com"
                  />
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowRecoveryModal(false);
                        setRecoveryEmail('');
                        setRecoverySuccess(false);
                        setLocalError(null);
                      }}
                      className="flex-1 py-2.5 rounded-2xl border border-[#EADCD1] text-xs font-bold text-[#8B756A] cursor-pointer hover:bg-stone-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-2.5 rounded-2xl bg-[#B76A4B] hover:bg-[#A05A3B] text-white text-xs font-bold cursor-pointer transition"
                    >
                      {loading ? 'Sending...' : 'Send Recovery Link'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
