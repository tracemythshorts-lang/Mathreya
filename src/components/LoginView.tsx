import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, ArrowRight, User, ShieldCheck, Phone, AlertCircle, Calendar, CheckCircle2, KeyRound } from 'lucide-react';
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
    error: authError,
  } = useAuth();

  // Top Tabs: ONLY 2 TABS ('login' | 'register')
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Modes
  const [registerMode, setRegisterMode] = useState<'email_pass' | 'email_otp' | 'phone_otp'>('email_pass');
  const [loginMode, setLoginMode] = useState<'password' | 'email_otp' | 'phone_otp'>('password');

  // Form Fields
  const [name, setName] = useState('Ananya Sharma');
  const [dob, setDob] = useState('1998-05-14');
  const [emailInput, setEmailInput] = useState('ananya.sharma@example.com');
  const [password, setPassword] = useState('MathreyaSecret123!');
  const [stage, setStage] = useState<'pregnancy_prenatal' | 'puberty' | 'husband'>('pregnancy_prenatal');

  // OTP Flow States
  const [phoneInput, setPhoneInput] = useState('+91 63624 48976');
  const [activeTokenUserId, setActiveTokenUserId] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Recovery Modal State
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState(false);

  // Loading & Error States
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Handle Form Submissions
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHapticFeedback('success');
    setLoading(true);
    setLocalError(null);

    try {
      if (activeTab === 'register') {
        if (registerMode === 'email_pass') {
          await signupWithEmail(name, dob, emailInput, password, stage);
          onLoginSuccess({ name, email: emailInput, stage, isAuthenticated: true });
        } else if (registerMode === 'email_otp') {
          if (!otpSent) {
            const tokenRes = await sendEmailOTP(emailInput);
            setActiveTokenUserId(tokenRes.userId);
            setOtpSent(true);
            setLoading(false);
            return;
          } else {
            if (!activeTokenUserId) throw new Error('OTP session expired. Please resend OTP.');
            await verifyEmailOTP(activeTokenUserId, otpCode, true, name, dob, stage);
            onLoginSuccess({ name, email: emailInput, stage, isAuthenticated: true });
          }
        } else if (registerMode === 'phone_otp') {
          if (!otpSent) {
            const tokenRes = await sendPhoneOTP(phoneInput);
            setActiveTokenUserId(tokenRes.userId);
            setOtpSent(true);
            setLoading(false);
            return;
          } else {
            if (!activeTokenUserId) throw new Error('OTP session expired. Please resend OTP.');
            await verifyPhoneOTP(activeTokenUserId, otpCode, true, name, dob, stage);
            onLoginSuccess({ name, phone: phoneInput, stage, isAuthenticated: true });
          }
        }
      } else {
        // Sign In Flow
        if (loginMode === 'password') {
          await loginWithEmail(emailInput, password);
          onLoginSuccess({ email: emailInput, isAuthenticated: true });
        } else if (loginMode === 'email_otp') {
          if (!otpSent) {
            const tokenRes = await sendEmailOTP(emailInput);
            setActiveTokenUserId(tokenRes.userId);
            setOtpSent(true);
            setLoading(false);
            return;
          } else {
            if (!activeTokenUserId) throw new Error('OTP session expired. Please resend OTP.');
            await verifyEmailOTP(activeTokenUserId, otpCode, false);
            onLoginSuccess({ email: emailInput, isAuthenticated: true });
          }
        } else if (loginMode === 'phone_otp') {
          if (!otpSent) {
            const tokenRes = await sendPhoneOTP(phoneInput);
            setActiveTokenUserId(tokenRes.userId);
            setOtpSent(true);
            setLoading(false);
            return;
          } else {
            if (!activeTokenUserId) throw new Error('OTP session expired. Please resend OTP.');
            await verifyPhoneOTP(activeTokenUserId, otpCode, false);
            onLoginSuccess({ phone: phoneInput, isAuthenticated: true });
          }
        }
      }
    } catch (err: any) {
      setLocalError(err.message || 'Authentication failed. Please check details.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleResendOTP = async () => {
    setLoading(true);
    setLocalError(null);
    try {
      if (activeTab === 'register' ? registerMode === 'email_otp' : loginMode === 'email_otp') {
        const tokenRes = await sendEmailOTP(emailInput);
        setActiveTokenUserId(tokenRes.userId);
      } else {
        const tokenRes = await sendPhoneOTP(phoneInput);
        setActiveTokenUserId(tokenRes.userId);
      }
      triggerHapticFeedback('light');
    } catch (err: any) {
      setLocalError(err.message || 'Failed to resend OTP.');
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

        {/* 2-TAB SWITCH (SIGN IN / REGISTER) */}
        <div className="flex bg-[#F7EAE2] p-1 rounded-2xl border border-[#EADCD1] max-w-xs mx-auto mt-2">
          <button
            type="button"
            onClick={() => {
              triggerHapticFeedback('light');
              setActiveTab('login');
              setLocalError(null);
              setOtpSent(false);
              setActiveTokenUserId(null);
              setOtpCode('');
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
              setOtpSent(false);
              setActiveTokenUserId(null);
              setOtpCode('');
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
          /* REGISTER FORM                                                             */
          /* ========================================================================= */
          <>
            <div>
              <label className="block text-xs font-bold text-[#8B756A] mb-1">Full Name</label>
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

            <div>
              <label className="block text-xs font-bold text-[#8B756A] mb-1">Date of Birth</label>
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

            {/* Registration Method Switch */}
            <div className="grid grid-cols-3 gap-1 bg-[#F7EAE2] p-1 rounded-xl border border-[#EADCD1]">
              <button
                type="button"
                onClick={() => {
                  setRegisterMode('email_pass');
                  setOtpSent(false);
                  setOtpCode('');
                }}
                className={`py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                  registerMode === 'email_pass' ? 'bg-white text-[#B76A4B] shadow-2xs' : 'text-[#8B756A]'
                }`}
              >
                <Mail className="w-3 h-3" /> Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setRegisterMode('email_otp');
                  setOtpSent(false);
                  setOtpCode('');
                }}
                className={`py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                  registerMode === 'email_otp' ? 'bg-white text-[#B76A4B] shadow-2xs' : 'text-[#8B756A]'
                }`}
              >
                <KeyRound className="w-3 h-3" /> Email OTP
              </button>
              <button
                type="button"
                onClick={() => {
                  setRegisterMode('phone_otp');
                  setOtpSent(false);
                  setOtpCode('');
                }}
                className={`py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                  registerMode === 'phone_otp' ? 'bg-white text-[#B76A4B] shadow-2xs' : 'text-[#8B756A]'
                }`}
              >
                <Phone className="w-3 h-3" /> Phone OTP
              </button>
            </div>

            {registerMode === 'email_pass' && (
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
                  <label className="block text-xs font-bold text-[#8B756A] mb-1">Password</label>
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
              </>
            )}

            {registerMode === 'email_otp' && (
              <>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-[#8B756A]">Email Address</label>
                    {otpSent && (
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="text-[11px] text-[#B76A4B] font-bold hover:underline cursor-pointer"
                      >
                        Change Email
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      disabled={otpSent}
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-[#EADCD1] text-xs sm:text-sm text-[#4D2D22] focus:outline-none focus:ring-2 focus:ring-[#B76A4B] font-medium shadow-2xs disabled:bg-stone-100"
                      placeholder="ananya.sharma@example.com"
                    />
                    <Mail className="w-4 h-4 text-[#8B756A] absolute right-3.5 top-3.5" />
                  </div>
                </div>

                {otpSent && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-[#8B756A]">Enter Email OTP</label>
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={loading}
                        className="text-[11px] text-[#B76A4B] font-bold hover:underline cursor-pointer"
                      >
                        Resend OTP
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-white border border-[#EADCD1] text-xs sm:text-sm text-[#4D2D22] focus:outline-none focus:ring-2 focus:ring-[#B76A4B] font-medium tracking-widest text-center shadow-2xs font-mono"
                        placeholder="123456"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {registerMode === 'phone_otp' && (
              <>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-[#8B756A]">Mobile Phone Number</label>
                    {otpSent && (
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="text-[11px] text-[#B76A4B] font-bold hover:underline cursor-pointer"
                      >
                        Change Number
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      disabled={otpSent}
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-[#EADCD1] text-xs sm:text-sm text-[#4D2D22] focus:outline-none focus:ring-2 focus:ring-[#B76A4B] font-medium shadow-2xs disabled:bg-stone-100"
                      placeholder="+91 63624 48976"
                    />
                    <Phone className="w-4 h-4 text-[#8B756A] absolute right-3.5 top-3.5" />
                  </div>
                </div>

                {otpSent && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-[#8B756A]">Enter SMS OTP</label>
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={loading}
                        className="text-[11px] text-[#B76A4B] font-bold hover:underline cursor-pointer"
                      >
                        Resend OTP
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-white border border-[#EADCD1] text-xs sm:text-sm text-[#4D2D22] focus:outline-none focus:ring-2 focus:ring-[#B76A4B] font-medium tracking-widest text-center shadow-2xs font-mono"
                        placeholder="123456"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#B76A4B] hover:bg-[#A05A3B] text-white font-serif font-extrabold rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 mt-1"
            >
              <span>
                {loading
                  ? 'Processing...'
                  : registerMode === 'email_pass'
                  ? 'Create Account'
                  : registerMode === 'email_otp'
                  ? !otpSent ? 'Send Email OTP' : 'Verify OTP'
                  : !otpSent ? 'Send SMS OTP' : 'Verify OTP'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        ) : (
          /* ========================================================================= */
          /* SIGN IN FORM                                                              */
          /* ========================================================================= */
          <>
            {/* Sign In Mode Switch */}
            <div className="grid grid-cols-3 gap-1 bg-[#F7EAE2] p-1 rounded-xl border border-[#EADCD1] mb-2">
              <button
                type="button"
                onClick={() => {
                  setLoginMode('password');
                  setOtpSent(false);
                  setOtpCode('');
                }}
                className={`py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                  loginMode === 'password' ? 'bg-white text-[#B76A4B] shadow-2xs' : 'text-[#8B756A]'
                }`}
              >
                <Lock className="w-3 h-3" /> Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMode('email_otp');
                  setOtpSent(false);
                  setOtpCode('');
                }}
                className={`py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                  loginMode === 'email_otp' ? 'bg-white text-[#B76A4B] shadow-2xs' : 'text-[#8B756A]'
                }`}
              >
                <KeyRound className="w-3 h-3" /> Email OTP
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMode('phone_otp');
                  setOtpSent(false);
                  setOtpCode('');
                }}
                className={`py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                  loginMode === 'phone_otp' ? 'bg-white text-[#B76A4B] shadow-2xs' : 'text-[#8B756A]'
                }`}
              >
                <Phone className="w-3 h-3" /> Phone OTP
              </button>
            </div>

            {loginMode === 'password' && (
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
                  className="w-full py-3.5 px-4 bg-[#B76A4B] hover:bg-[#A05A3B] text-white font-serif font-extrabold rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 mt-1"
                >
                  <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}

            {loginMode === 'email_otp' && (
              <>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-[#8B756A]">Email Address</label>
                    {otpSent && (
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="text-[11px] text-[#B76A4B] font-bold hover:underline cursor-pointer"
                      >
                        Change Email
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      disabled={otpSent}
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-[#EADCD1] text-xs sm:text-sm text-[#4D2D22] focus:outline-none focus:ring-2 focus:ring-[#B76A4B] font-medium shadow-2xs disabled:bg-stone-100"
                      placeholder="ananya.sharma@example.com"
                    />
                    <Mail className="w-4 h-4 text-[#8B756A] absolute right-3.5 top-3.5" />
                  </div>
                </div>

                {otpSent && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-[#8B756A]">Enter Email OTP</label>
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={loading}
                        className="text-[11px] text-[#B76A4B] font-bold hover:underline cursor-pointer"
                      >
                        Resend OTP
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-white border border-[#EADCD1] text-xs sm:text-sm text-[#4D2D22] focus:outline-none focus:ring-2 focus:ring-[#B76A4B] font-medium tracking-widest text-center shadow-2xs font-mono"
                        placeholder="123456"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-[#B76A4B] hover:bg-[#A05A3B] text-white font-serif font-extrabold rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 mt-1"
                >
                  <span>
                    {loading
                      ? 'Processing...'
                      : !otpSent
                      ? 'Send Email OTP'
                      : 'Verify OTP'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}

            {loginMode === 'phone_otp' && (
              <>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-[#8B756A]">Mobile Phone Number</label>
                    {otpSent && (
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="text-[11px] text-[#B76A4B] font-bold hover:underline cursor-pointer"
                      >
                        Change Number
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      disabled={otpSent}
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-[#EADCD1] text-xs sm:text-sm text-[#4D2D22] focus:outline-none focus:ring-2 focus:ring-[#B76A4B] font-medium shadow-2xs disabled:bg-stone-100"
                      placeholder="+91 63624 48976"
                    />
                    <Phone className="w-4 h-4 text-[#8B756A] absolute right-3.5 top-3.5" />
                  </div>
                </div>

                {otpSent && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-[#8B756A]">Enter SMS OTP</label>
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={loading}
                        className="text-[11px] text-[#B76A4B] font-bold hover:underline cursor-pointer"
                      >
                        Resend OTP
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-white border border-[#EADCD1] text-xs sm:text-sm text-[#4D2D22] focus:outline-none focus:ring-2 focus:ring-[#B76A4B] font-medium tracking-widest text-center shadow-2xs font-mono"
                        placeholder="123456"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-[#B76A4B] hover:bg-[#A05A3B] text-white font-serif font-extrabold rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95"
                >
                  <span>
                    {loading
                      ? 'Processing...'
                      : !otpSent
                      ? 'Send SMS OTP'
                      : 'Verify OTP'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </>
        )}
      </motion.form>

      {/* PASSWORD RECOVERY MODAL */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
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
