import { supabase } from "../lib/supabase";
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, ArrowRight, Sparkles, User, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';
import { triggerHapticFeedback } from '../utils/haptics';

interface LoginViewProps {
  onLoginSuccess: (user: Partial<UserProfile>) => void;
  onContinueAsGuest: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onContinueAsGuest }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Form State
  const [name, setName] = useState('Ananya Sharma');
  const [emailOrPhone, setEmailOrPhone] = useState('+91 98765 43210');
  const [password, setPassword] = useState('••••••••••••');
  const [stage, setStage] = useState<'pregnancy_prenatal' | 'puberty' | 'husband'>('pregnancy_prenatal');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHapticFeedback("success");

    if (activeTab === "register") {
      const { error } = await supabase.auth.signUp({
        email: emailOrPhone,
        password: password,
        options: {
          data: {
            full_name: name,
            stage: stage,
          },
        },
      });

      if (error) {
        alert(error.message);
        return;
      }

      alert("Account created successfully. Please check your email and verify your account.");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailOrPhone,
      password: password,
    });

    console.log(data);
    console.log(error);
    if (error) {
      alert(error.message);
      return;
    }

    onLoginSuccess({
      name: data.user.user_metadata.full_name || "User",
      email: data.user.email || "",
      phone: "",
      stage: (data.user.user_metadata.stage || "pregnancy_prenatal") as any,
      isAuthenticated: true,
      faceAuthEnabled: false,
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#FFF8F5] flex flex-col justify-between p-5 sm:p-8 select-none text-[#4D2D22]">

      {/* 1. TOP BRAND HEADER WITH TRANSPARENT CIRCULAR MATHREYA LOGO */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto text-center space-y-3 pt-2 sm:pt-6"
      >
        {/* Transparent Circular Logo Emblem */}
        <div className="w-36 h-36 sm:w-44 sm:h-44 mx-auto filter drop-shadow-md">
          <img
            src="assets/logo.png"
            alt="Mathreya - A Care That Feels Like Home"
            className="w-full h-full object-contain"
          />
        </div>

        {/* ROBINHOOD SEGMENTED PILL TAB SWITCH */}
        <div className="flex bg-[#F7EAE2] p-1 rounded-2xl border border-[#EADCD1] max-w-xs mx-auto mt-2">
          <button
            type="button"
            onClick={() => {
              triggerHapticFeedback('light');
              setActiveTab('login');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-serif font-extrabold transition cursor-pointer text-center ${activeTab === 'login'
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
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-serif font-extrabold transition cursor-pointer text-center ${activeTab === 'register'
              ? 'bg-[#B76A4B] text-white shadow-2xs'
              : 'text-[#8B756A] hover:text-[#4D2D22]'
              }`}
          >
            Register
          </button>
        </div>
      </motion.div>

      {/* 2. UNCONGESTED FULL-PAGE AUTH FORM */}
      <motion.form
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleFormSubmit}
        className="w-full max-w-md mx-auto space-y-3.5 my-auto py-4"
      >
        {activeTab === 'register' && (
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
        )}

        <div>
          <label className="block text-xs font-bold text-[#8B756A] mb-1">Mobile Number or Email</label>
          <div className="relative">
            <input
              type="text"
              required
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white border border-[#EADCD1] text-xs sm:text-sm text-[#4D2D22] focus:outline-none focus:ring-2 focus:ring-[#B76A4B] font-medium shadow-2xs"
              placeholder="Enter +91 mobile or email"
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

        {activeTab === 'register' && (
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
        )}

        <button
          type="submit"
          className="w-full py-3.5 px-4 bg-[#B76A4B] hover:bg-[#A05A3B] text-white font-serif font-extrabold rounded-2xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 mt-1"
        >
          <span>{activeTab === 'register' ? 'Create Account & Enter' : 'Sign In to Sanctuary'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.form>

      {/* 3. DIRECT ACCESS LINK */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-md mx-auto text-center space-y-2.5 pb-2"
      >
        <div className="flex items-center gap-2 text-[#8B756A] text-[9px] uppercase font-bold tracking-wider">
          <div className="flex-1 border-t border-[#EADCD1]" />
          <span>Or Explore Instantly</span>
          <div className="flex-1 border-t border-[#EADCD1]" />
        </div>

        <button
          type="button"
          onClick={() => {
            triggerHapticFeedback('light');
            onContinueAsGuest();
          }}
          className="w-full py-2.5 px-4 bg-white hover:bg-[#F7EAE2] text-[#B76A4B] font-extrabold rounded-2xl text-xs border border-[#EADCD1] transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
        >
          <Sparkles className="w-4 h-4 text-[#B76A4B]" />
          <span>Continue to Home Directory</span>
        </button>

        <p className="text-[10px] text-[#8B756A] font-medium flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> AES-256 Encrypted & Private Medical Shell
        </p>
      </motion.div>

    </div>
  );
};
