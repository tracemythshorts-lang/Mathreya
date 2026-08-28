import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, ArrowRight, User, ShieldCheck, Phone, AlertCircle, Calendar, CheckCircle2 } from 'lucide-react';
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
    sendPhoneOTP,
    verifyPhoneOTP,
    sendPasswordRecovery,
    error: authError,
  } = useAuth();

  // Top Tabs: ONLY 2 TABS ('login' | 'register')
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Modes
  const [registerMode, setRegisterMode] = useState<'email' | 'phone'>('email');
  const [loginMode, setLoginMode] = useState<'password' | 'phone'>('password');

  // Form Fields
  const [name, setName] = useState('Ananya Sharma');
  const [dob, setDob] = useState('1998-05-14');
  const [emailOrPhone, setEmailOrPhone] = useState('ananya.sharma@example.com');
  const [password, setPassword] = useState('MathreyaSecret123!');
  const [stage, setStage] = useState<'pregnancy_prenatal' | 'puberty' | 'husband'>('pregnancy_prenatal');

  // Phone OTP Flow State (Appwrite)
  const [phoneInput, setPhoneInput] = useState('+91 63624 48976');
  const [phoneTokenUserId, setPhoneTokenUserId] = useState<string | null>(null);
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
        if (registerMode === 'phone') {
          if (!otpSent) {
            const tokenRes = await sendPhoneOTP(phoneInput);
            setPhoneTokenUserId(tokenRes.userId);
            setOtpSent(true);
            setLoading(false);
            return;
          } else {
            if (!phoneTokenUserId) throw new Error('OTP session expired. Please resend code.');
            await verifyPhoneOTP(phoneTokenUserId, otpCode, true, name, dob, stage);
            onLoginSuccess({ name, phone: phoneInput, stage, isAuthenticated: true });
            return;
          }
        } else {
          // Appwrite Email Registration -> Create Account + Session -> Direct Access
          await signupWithEmail(name, dob, emailOrPhone, password, stage);
          onLoginSuccess({ name, email: emailOrPhone, stage, isAuthenticated: true });
        }
      } else {
        // Appwrite Sign In Flow
        if (loginMode === 'phone') {
          if (!otpSent) {
            const tokenRes = await sendPhoneOTP(phoneInput);
            setPhoneTokenUserId(tokenRes.userId);
            setOtpSent(true);
            setLoading(false);
            return;
          } else {
            if (!phoneTokenUserId) throw new Error('OTP session expired. Please resend code.');
            await verifyPhoneOTP(phoneTokenUserId, otpCode, false);
            onLoginSuccess({ phone: phoneInput, isAuthenticated: true });
            return;
          }
        } else {
          // Appwrite Email/Password Sign In
          await loginWithEmail(emailOrPhone, password);
          onLoginSuccess({ email: emailOrPhone, isAuthenticated: true });
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
              setOtpSent(false);
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
          /* REGISTER FORM (APPWRITE ACCOUNT CREATION)                                 */
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

            {/* Registration Mode Switch */}
            <div className="flex justify-between items-center bg-[#F7EAE2] p-1 rounded-xl border border-[#EADCD1]">
              <button
                type="button"
                onClick={() => {
                  setRegisterMode('email');
                  setOtpSent(false);
                }}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                  registerMode === 'email' ? 'bg-white text-[#B76A4B] shadow-2xs' : 'text-[#8B756A]'
                }`}
              >
                <Mail className="w-3.5 h-3.5" /> Email Registration
              </button>
              <button
                type="button"
                onClick={() => {
                  setRegisterMode('phone');
                  setOtpSent(false);
                }}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                  registerMode === 'phone' ? 'bg-white text-[#B76A4B] shadow-2xs' : 'text-[#8B756A]'
                }`}
              >
                <Phone className="w-3.5 h-3.5" /> Mobile OTP Registration
              </button>
            </div>

            {registerMode === 'email' ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-[#8B756A] mb-1">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
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
            ) : (
              <>
                {/* Mobile Phone Input */}
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
                      placeholder="+916362448976"
                    />
                    <Phone className="w-4 h-4 text-[#8B756A] absolute right-3.5 top-3.5" />
                  </div>
                </div>

                {/* 6-Digit SMS OTP Input Box */}
                {otpSent && (
                  <div>
                    <label className="block text-xs font-bold text-[#8B756A] mb-1">Enter 6-digit Appwrite SMS OTP</label>
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
                  : registerMode === 'phone' && !otpSent
                  ? 'Send Appwrite SMS OTP'
                  : 'Create Appwrite Account'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        ) : (
          /* ========================================================================= */
          /* SIGN IN FORM (APPWRITE SESSION AUTHENTICATION)                             */
          /* ========================================================================= */
          <>
            {loginMode === 'password' ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-[#8B756A] mb-1">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
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
                  <span>{loading ? 'Authenticating...' : 'Sign In with Appwrite'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMode('phone');
                      setOtpSent(false);
                    }}
                    className="text-xs text-[#B76A4B] font-bold hover:underline cursor-pointer flex items-center justify-center gap-1 mx-auto"
                  >
                    <Phone className="w-3.5 h-3.5" /> Sign in using Appwrite Mobile SMS OTP
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Mobile Phone Input */}
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
                      placeholder="+916362448976"
                    />
                    <Phone className="w-4 h-4 text-[#8B756A] absolute right-3.5 top-3.5" />
                  </div>
                </div>

                {/* 6-Digit SMS OTP Input Box */}
                {otpSent && (
                  <div>
                    <label className="block text-xs font-bold text-[#8B756A] mb-1">Enter 6-digit Appwrite SMS OTP</label>
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
                  <span>{!otpSent ? 'Send Appwrite SMS OTP' : 'Verify OTP & Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setLoginMode('password')}
                    className="text-xs text-[#B76A4B] font-bold hover:underline cursor-pointer"
                  >
                    Back to Email / Password Sign In
                  </button>
                </div>
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
            <h3 className="text-lg font-serif font-bold text-[#5E2211]">Appwrite Password Recovery</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Enter your registered email address to receive an official Appwrite password recovery link.
            </p>

            {recoverySuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Appwrite recovery email sent! Check your inbox.</span>
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
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Appwrite Cloud Encrypted Authentication
        </p>
      </motion.div>
    </div>
  );
};
