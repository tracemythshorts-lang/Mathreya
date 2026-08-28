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
    sendEmailOTP,
    verifyEmailOTP,
    sendPhoneOTP,
    verifyPhoneOTP,
    sendPasswordRecovery,
    setUserPhotoUrl,
    error: authError,
  } = useAuth();

  // Top Tabs: ONLY 2 TABS ('login' | 'register')
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('register');

  // Registration Form Fields
  const [name, setName] = useState('Ananya Sharma');
  const [dob, setDob] = useState('1998-05-14');
  const [emailInput, setEmailInput] = useState('ananya.sharma@example.com');
  const [phoneInput, setPhoneInput] = useState('+91 63624 48976');
  const [password, setPassword] = useState('MathreyaSecret123!');
  const [stage, setStage] = useState<'pregnancy_prenatal' | 'puberty' | 'husband'>('pregnancy_prenatal');

  // Email OTP States
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailTokenUserId, setEmailTokenUserId] = useState<string | null>(null);
  const [emailOtpCode, setEmailOtpCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailOtpLoading, setEmailOtpLoading] = useState(false);

  // Phone OTP States (Optional)
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneTokenUserId, setPhoneTokenUserId] = useState<string | null>(null);
  const [phoneOtpCode, setPhoneOtpCode] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneOtpLoading, setPhoneOtpLoading] = useState(false);

  // Recovery Modal State
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState(false);

  // Security Verification Modal State (Face / Security Step after Signup / Login)
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [pendingUser, setPendingUser] = useState<Partial<UserProfile> | null>(null);
  const [securityMode, setSecurityMode] = useState<'face' | 'pin'>('face');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [securityPin, setSecurityPin] = useState('1234');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // General Loading & Local Error States
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Video & Canvas refs for camera face verification
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err: any) {
      setCameraError('Camera access unavailable. You can use Security PIN verification.');
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

  // 1. Handle Send Email OTP
  const handleSendEmailOTP = async () => {
    if (!emailInput || !emailInput.includes('@')) {
      setLocalError('Please enter a valid email address first.');
      return;
    }
    setEmailOtpLoading(true);
    setLocalError(null);
    try {
      const tokenRes = await sendEmailOTP(emailInput);
      setEmailTokenUserId(tokenRes.userId);
      setEmailOtpSent(true);
      triggerHapticFeedback('light');
    } catch (err: any) {
      setLocalError(err.message || 'Failed to send Email OTP.');
    } finally {
      setEmailOtpLoading(false);
    }
  };

  // 2. Handle Validate Email OTP
  const handleValidateEmailOTP = async () => {
    if (!emailOtpCode || emailOtpCode.length < 4) {
      setLocalError('Please enter the valid OTP code sent to your email.');
      return;
    }
    setEmailOtpLoading(true);
    setLocalError(null);
    try {
      if (!emailTokenUserId) throw new Error('OTP token expired. Please resend.');
      await verifyEmailOTP(emailTokenUserId, emailOtpCode, true, name, dob, stage);
      setEmailVerified(true);
      triggerHapticFeedback('success');
    } catch (err: any) {
      setLocalError(err.message || 'Invalid Email OTP code.');
    } finally {
      setEmailOtpLoading(false);
    }
  };

  // 3. Handle Send Phone OTP (Optional)
  const handleSendPhoneOTP = async () => {
    if (!phoneInput || phoneInput.length < 8) {
      setLocalError('Please enter a valid phone number.');
      return;
    }
    setPhoneOtpLoading(true);
    setLocalError(null);
    try {
      const tokenRes = await sendPhoneOTP(phoneInput);
      setPhoneTokenUserId(tokenRes.userId);
      setPhoneOtpSent(true);
      triggerHapticFeedback('light');
    } catch (err: any) {
      setLocalError(err.message || 'Failed to send Phone OTP.');
    } finally {
      setPhoneOtpLoading(false);
    }
  };

  // 4. Handle Validate Phone OTP (Optional)
  const handleValidatePhoneOTP = async () => {
    if (!phoneOtpCode || phoneOtpCode.length < 4) {
      setLocalError('Please enter the OTP code sent to your mobile phone.');
      return;
    }
    setPhoneOtpLoading(true);
    setLocalError(null);
    try {
      if (!phoneTokenUserId) throw new Error('OTP token expired. Please resend.');
      await verifyPhoneOTP(phoneTokenUserId, phoneOtpCode, true, name, dob, stage);
      setPhoneVerified(true);
      triggerHapticFeedback('success');
    } catch (err: any) {
      setLocalError(err.message || 'Invalid Phone OTP code.');
    } finally {
      setPhoneOtpLoading(false);
    }
  };

  // 5. Handle Primary Form Submission (Signup / Login)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHapticFeedback('success');
    setLoading(true);
    setLocalError(null);

    try {
      if (activeTab === 'register') {
        // Appwrite Password Validation
        if (!password || password.length < 8) {
          throw new Error('Password must be at least 8 characters long as required by Appwrite security.');
        }

        // Email OTP Validation check
        if (!emailVerified) {
          throw new Error('Please click "Send OTP" and validate your Email OTP before creating your account.');
        }

        // Primary Appwrite Registration
        await signupWithEmail(name, dob, emailInput, password, stage);

        // Set pending user and open security verification step
        const userObj: Partial<UserProfile> = {
          name,
          email: emailInput,
          phone: phoneInput,
          stage,
          isAuthenticated: true,
        };
        setPendingUser(userObj);
        setShowSecurityModal(true);
        startCamera();
      } else {
        // Sign In Flow (Email + Password)
        if (!emailInput || !password) {
          throw new Error('Please enter your registered email address and password.');
        }
        await loginWithEmail(emailInput, password);

        const userObj: Partial<UserProfile> = {
          email: emailInput,
          isAuthenticated: true,
        };
        setPendingUser(userObj);
        setShowSecurityModal(true);
        startCamera();
      }
    } catch (err: any) {
      setLocalError(err.message || 'Authentication failed. Please check your entries.');
    } finally {
      setLoading(false);
    }
  };

  // 6. Complete Security Verification Step
  const handleCompleteSecurityStep = () => {
    if (securityMode === 'face' && capturedPhoto) {
      setUserPhotoUrl(capturedPhoto);
    }
    stopCamera();
    setShowSecurityModal(false);
    if (pendingUser) {
      onLoginSuccess(pendingUser);
    }
  };

  // Handle Forgot Password Recovery
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

  return (
    <div className="min-h-screen w-full bg-[#FFF8F5] flex flex-col justify-between p-4 sm:p-8 select-none text-[#4D2D22]">
      {/* 1. TOP BRAND HEADER */}
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

        {/* 2-TAB SWITCH (SIGN IN / REGISTER ONLY) */}
        <div className="flex bg-[#F7EAE2] p-1 rounded-2xl border border-[#EADCD1] max-w-xs mx-auto mt-2">
          <button
            type="button"
            onClick={() => {
              triggerHapticFeedback('light');
              setActiveTab('login');
              setLocalError(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-serif font-extrabold transition cursor-pointer text-center ${
              activeTab === 'login'
                ? 'bg-[#B76A4B] text-white shadow-2xs'
                : 'text-[#8B756A] hover:text-[#4D2D22]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHapticFeedback('light');
              setActiveTab('register');
              setLocalError(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-serif font-extrabold transition cursor-pointer text-center ${
              activeTab === 'register'
                ? 'bg-[#B76A4B] text-white shadow-2xs'
                : 'text-[#8B756A] hover:text-[#4D2D22]'
            }`}
          >
            Register
          </button>
        </div>
      </motion.div>

      {/* ERROR DISPLAY */}
      {(localError || authError) && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto my-2 bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-2xl flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{localError || authError}</span>
        </motion.div>
      )}

      {/* MAIN FORM */}
      <motion.form
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleFormSubmit}
        className="w-full max-w-md mx-auto space-y-3.5 my-auto py-3"
      >
        {activeTab === 'register' ? (
          /* ========================================================================= */
          /* REGISTER FORM (SINGLE UNIFIED SECTION)                                    */
          /* ========================================================================= */
          <>
            {/* 1. FULL NAME (MANDATORY) */}
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
                  placeholder="Enter full name"
                />
                <User className="w-4 h-4 text-[#8B756A] absolute right-3.5 top-3.5" />
              </div>
            </div>

            {/* 2. DATE OF BIRTH (MANDATORY) */}
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

            {/* 3. EMAIL ADDRESS + INTEGRATED SEND OTP & VALIDATE (MANDATORY) */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-[#8B756A]">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                {emailVerified ? (
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Email Verified
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-700">Mandatory Verification</span>
                )}
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="email"
                    required
                    disabled={emailVerified}
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-[#EADCD1] text-xs sm:text-sm text-[#4D2D22] focus:outline-none focus:ring-2 focus:ring-[#B76A4B] font-medium shadow-2xs disabled:bg-stone-100"
                    placeholder="ananya.sharma@example.com"
                  />
                  <Mail className="w-4 h-4 text-[#8B756A] absolute right-3.5 top-3.5" />
                </div>
                {!emailVerified && (
                  <button
                    type="button"
                    onClick={handleSendEmailOTP}
                    disabled={emailOtpLoading}
                    className="px-3.5 py-3 bg-[#F7EAE2] hover:bg-[#EADCD1] text-[#B76A4B] border border-[#EADCD1] text-xs font-bold rounded-2xl transition cursor-pointer shrink-0"
                  >
                    {emailOtpLoading ? 'Sending...' : emailOtpSent ? 'Resend OTP' : 'Send OTP'}
                  </button>
                )}
              </div>

              {/* Email OTP Text Box & Validate Button */}
              {emailOtpSent && !emailVerified && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2 p-3 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-2"
                >
                  <label className="block text-[11px] font-bold text-amber-900">
                    Enter 6-digit Email OTP sent to {emailInput}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={emailOtpCode}
                      onChange={(e) => setEmailOtpCode(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-white border border-amber-300 text-xs font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-[#B76A4B]"
                      placeholder="123456"
                    />
                    <button
                      type="button"
                      onClick={handleValidateEmailOTP}
                      disabled={emailOtpLoading}
                      className="px-4 py-2 bg-[#B76A4B] hover:bg-[#A05A3B] text-white text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      {emailOtpLoading ? 'Validating...' : 'Validate OTP'}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* 4. PHONE NUMBER + OPTIONAL SEND OTP & VALIDATE */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-[#8B756A]">
                  Mobile Phone Number <span className="text-stone-400 font-normal">(Optional)</span>
                </label>
                {phoneVerified && (
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Phone Verified
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    disabled={phoneVerified}
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-[#EADCD1] text-xs sm:text-sm text-[#4D2D22] focus:outline-none focus:ring-2 focus:ring-[#B76A4B] font-medium shadow-2xs disabled:bg-stone-100"
                    placeholder="+91 63624 48976"
                  />
                  <Phone className="w-4 h-4 text-[#8B756A] absolute right-3.5 top-3.5" />
                </div>
                {!phoneVerified && phoneInput.trim().length > 5 && (
                  <button
                    type="button"
                    onClick={handleSendPhoneOTP}
                    disabled={phoneOtpLoading}
                    className="px-3.5 py-3 bg-[#F7EAE2] hover:bg-[#EADCD1] text-[#B76A4B] border border-[#EADCD1] text-xs font-bold rounded-2xl transition cursor-pointer shrink-0"
                  >
                    {phoneOtpLoading ? 'Sending...' : phoneOtpSent ? 'Resend' : 'Send OTP'}
                  </button>
                )}
              </div>

              {/* Phone OTP Text Box & Validate Button */}
              {phoneOtpSent && !phoneVerified && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2 p-3 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-2"
                >
                  <label className="block text-[11px] font-bold text-amber-900">
                    Enter SMS OTP sent to {phoneInput}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={phoneOtpCode}
                      onChange={(e) => setPhoneOtpCode(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-white border border-amber-300 text-xs font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-[#B76A4B]"
                      placeholder="123456"
                    />
                    <button
                      type="button"
                      onClick={handleValidatePhoneOTP}
                      disabled={phoneOtpLoading}
                      className="px-4 py-2 bg-[#B76A4B] hover:bg-[#A05A3B] text-white text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      {phoneOtpLoading ? 'Validating...' : 'Validate OTP'}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* 5. PASSWORD (MANDATORY WITH APPWRITE VALIDATION) */}
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
                  placeholder="Min 8 characters (Appwrite requirement)"
                />
                <Lock className="w-4 h-4 text-[#8B756A] absolute right-3.5 top-3.5" />
              </div>
            </div>

            {/* 6. PRIMARY LIFE STAGE */}
            <div>
              <label className="block text-xs font-bold text-[#8B756A] mb-1">Primary Life Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as any)}
                className="w-full px-4 py-3 rounded-2xl bg-white border border-[#EADCD1] text-xs sm:text-sm text-[#4D2D22] focus:outline-none font-medium shadow-2xs"
              >
                <option value="pregnancy_prenatal">Pregnancy & Maternity Care</option>
                <option value="puberty">Puberty & Cycle Guide</option>
                <option value="husband">Partner Sync Hub</option>
              </select>
            </div>

            {/* CREATE ACCOUNT SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#B76A4B] hover:bg-[#A05A3B] text-white font-serif font-extrabold rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 mt-2"
            >
              <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        ) : (
          /* ========================================================================= */
          /* SIGN IN FORM (EMAIL & PASSWORD)                                           */
          /* ========================================================================= */
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
                  placeholder="ananya.sharma@example.com"
                />
                <Mail className="w-4 h-4 text-[#8B756A] absolute right-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-[#8B756A]">Password</label>
                <button
                  type="button"
                  onClick={() => setShowRecoveryModal(true)}
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
                  placeholder="Enter secure password"
                />
                <Lock className="w-4 h-4 text-[#8B756A] absolute right-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#B76A4B] hover:bg-[#A05A3B] text-white font-serif font-extrabold rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 mt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}
      </motion.form>

      {/* SECURITY VERIFICATION MODAL (FACE / DEVICE PASSWORD STEP AFTER REGISTER & LOGIN) */}
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
                  {activeTab === 'register' ? 'Enroll Device Security & Face' : 'Verify Security Identity'}
                </h3>
                <span className="text-[10px] font-bold bg-[#FFF5ED] text-[#8B3012] px-2.5 py-1 rounded-full border border-[#F4D9CC]">
                  Step 2 of 2
                </span>
              </div>

              {/* Mode Switcher */}
              <div className="flex bg-[#F7EAE2] p-1 rounded-xl border border-[#EADCD1]">
                <button
                  type="button"
                  onClick={() => {
                    setSecurityMode('face');
                    if (!cameraActive) startCamera();
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    securityMode === 'face' ? 'bg-white text-[#B76A4B] shadow-2xs' : 'text-[#8B756A]'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" /> Face Capture
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSecurityMode('pin');
                    stopCamera();
                  }}
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
                      ? 'Face capture verified successfully! Your avatar photo is ready.'
                      : 'Position your face clearly in the camera view below.'}
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
                      className="px-4 py-2 bg-[#B76A4B] hover:bg-[#A05A3B] text-white font-bold rounded-xl text-xs flex items-center gap-2 mx-auto cursor-pointer shadow-xs"
                    >
                      <Camera className="w-4 h-4" /> Capture Face Photo
                    </button>
                  )}

                  {capturedPhoto && (
                    <button
                      type="button"
                      onClick={() => {
                        setCapturedPhoto(null);
                        startCamera();
                      }}
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
                      ? 'Set a 4-digit Security PIN for your device access.'
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
                      placeholder="1234"
                    />
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleCompleteSecurityStep}
                className="w-full py-3.5 bg-[#B76A4B] hover:bg-[#A05A3B] text-white font-serif font-extrabold rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>Complete & Enter Sanctuary</span>
                <Sparkles className="w-4 h-4 text-amber-200" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PASSWORD RECOVERY MODAL */}
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
                Enter your registered email address to receive a password recovery link.
              </p>

              {recoverySuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Recovery email sent! Check your inbox.</span>
                </div>
              ) : (
                <form onSubmit={handleSendRecovery} className="space-y-3">
                  <input
                    type="email"
                    required
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="Enter registered email address"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FCFAF7] border border-[#EAE0D2] text-xs focus:outline-none focus:border-[#C85A32]"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-2.5 bg-[#C85A32] text-white font-bold rounded-xl text-xs hover:bg-[#B34D29] transition cursor-pointer"
                    >
                      Send Recovery Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRecoveryModal(false)}
                      className="py-2.5 px-4 bg-stone-100 text-stone-700 font-bold rounded-xl text-xs hover:bg-stone-200 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER BADGE */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-md mx-auto text-center pb-2 pt-1"
      >
        <p className="text-[10px] text-[#8B756A] font-medium flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Safe & Encrypted Authentication
        </p>
      </motion.div>
    </div>
  );
};
