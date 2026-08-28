import React, { useState, useRef } from 'react';
import { AppScreen, UserProfile } from '../types';
import { 
  Heart, 
  User, 
  Baby, 
  Users, 
  Flame, 
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldAlert,
  BookOpen,
  Settings,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { triggerHapticFeedback } from '../utils/haptics';

interface NavbarProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  user: UserProfile;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  user,
  onLogout,
}) => {
  // Hide Navbar completely on Login Page for zero clutter!
  if (currentScreen === 'login') {
    return null;
  }

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSilentEmergencyOpen, setIsSilentEmergencyOpen] = useState(false);

  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startLongPress = () => {
    longPressTimerRef.current = setTimeout(() => {
      triggerHapticFeedback('heavy');
      setIsSilentEmergencyOpen(true);
    }, 700);
  };

  const cancelLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  // Robinhood Stagger Animation Variants
  const drawerVariants = {
    hidden: { x: '-100%' },
    visible: {
      x: 0,
      transition: {
        type: 'spring',
        damping: 26,
        stiffness: 260,
        staggerChildren: 0.04,
        delayChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -16 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <>
      {/* Robinhood Top Header Bar */}
      <header className="border-b sticky top-0 z-40 bg-[#FFF8F5]/95 backdrop-blur-xl text-[#4D2D22] border-[#EADCD1] shadow-2xs">
        <div className="w-full max-w-full sm:max-w-2xl md:max-w-4xl xl:max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-2.5 flex items-center justify-between gap-3">
          
          {/* Left: Drawer Toggle Button & Brand Title */}
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                triggerHapticFeedback('light');
                setIsDrawerOpen(true);
              }}
              className="p-2 rounded-2xl bg-white hover:bg-[#F7EAE2] text-[#B76A4B] border border-[#EADCD1] transition cursor-pointer flex items-center justify-center shadow-2xs"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 text-[#B76A4B]" />
            </motion.button>

            {/* Brand Logo & Name */}
            <div 
              className="flex items-center gap-2 cursor-pointer group" 
              onClick={() => onNavigate('dashboard')}
            >
              <div className="w-9 h-9 rounded-xl bg-[#B76A4B] p-0.5 overflow-hidden shadow-2xs border border-white">
                <img 
                  src="assets/logo.png" 
                  alt="Mathreya Logo" 
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div>
                <h1 className="text-base font-extrabold tracking-tight font-serif text-[#4D2D22] leading-tight">
                  Mathreya
                </h1>
                <p className="text-[9px] text-[#B76A4B] font-serif italic font-bold">
                  The Care That Feels Like Home
                </p>
              </div>
            </div>
          </div>

          {/* Right: Profile Avatar Icon Button */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => onNavigate('profile')}
            onTouchStart={startLongPress}
            onTouchEnd={cancelLongPress}
            onMouseDown={startLongPress}
            onMouseUp={cancelLongPress}
            onMouseLeave={cancelLongPress}
            title="Profile • Long Press for Emergency SOS"
            className="w-9 h-9 rounded-full bg-[#B76A4B] text-white text-xs font-extrabold flex items-center justify-center border-2 border-white shadow-2xs cursor-pointer overflow-hidden"
          >
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user.name ? user.name.charAt(0) : 'A'
            )}
          </motion.button>
        </div>
      </header>

      {/* SLEEK HIGH-LEVEL ROBINHOOD & INDIAN TRADITIONAL DRAWER */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs"
            />

            {/* Slide-out Drawer Panel */}
            <motion.aside
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed top-0 left-0 bottom-0 z-50 w-76 max-w-[82vw] bg-[#FFF8F5] border-r border-[#EADCD1] shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              {/* Drawer Content Wrapper */}
              <div className="p-4 sm:p-5 space-y-5">
                
                {/* 1. ELEVATED INDIAN TRADITIONAL USER HEADER CARD */}
                <div className="bg-gradient-to-br from-[#B76A4B] to-[#C87958] text-white rounded-3xl p-4 shadow-sm relative overflow-hidden space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-white text-[#B76A4B] font-extrabold flex items-center justify-center text-lg shadow-2xs border border-white/20 overflow-hidden p-0.5">
                        <img src="assets/logo.png" alt="Mathreya" className="w-full h-full object-cover rounded-xl" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-amber-100 uppercase tracking-wider flex items-center gap-1">
                          <span>Namaste 🪷</span>
                        </p>
                        <h3 className="font-serif font-extrabold text-base text-white leading-tight">
                          {user.name.split(' ')[0]}
                        </h3>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsDrawerOpen(false)}
                      className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-white/90 pt-1 border-t border-white/20 font-serif italic">
                    <span>"The Care That Feels Like Home"</span>
                  </div>
                </div>

                {/* 2. HIGH-LEVEL ESSENTIAL MENU */}
                <div className="space-y-2">
                  <motion.div variants={itemVariants}>
                    <button
                      onClick={() => {
                        triggerHapticFeedback('light');
                        onNavigate('dashboard');
                        setIsDrawerOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition cursor-pointer text-left ${
                        currentScreen === 'dashboard'
                          ? 'bg-[#F7EAE2] text-[#B76A4B] border border-[#B76A4B]/30 shadow-2xs'
                          : 'bg-white text-[#4D2D22] border border-[#EADCD1] hover:border-[#B76A4B]/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-base">🏠</span>
                        <span className="font-serif font-bold text-xs text-[#4D2D22]">Home Sanctuary</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#8B756A]" />
                    </button>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <button
                      onClick={() => {
                        onNavigate('puberty');
                        setIsDrawerOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition cursor-pointer text-left ${
                        currentScreen === 'puberty'
                          ? 'bg-[#F7EAE2] text-[#B76A4B] border border-[#B76A4B]/30 shadow-2xs'
                          : 'bg-white text-[#4D2D22] border border-[#EADCD1] hover:border-[#B76A4B]/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-base">🌸</span>
                        <span className="font-serif font-bold text-xs text-[#4D2D22]">Puberty & Adolescent Care</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#8B756A]" />
                    </button>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <button
                      onClick={() => {
                        onNavigate('pregnancy_prenatal');
                        setIsDrawerOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition cursor-pointer text-left ${
                        currentScreen === 'pregnancy_prenatal' || currentScreen === 'pregnancy_postnatal'
                          ? 'bg-[#F7EAE2] text-[#B76A4B] border border-[#B76A4B]/30 shadow-2xs'
                          : 'bg-white text-[#4D2D22] border border-[#EADCD1] hover:border-[#B76A4B]/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-base">🤰</span>
                        <span className="font-serif font-bold text-xs text-[#4D2D22]">Pregnancy Care Hub</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#8B756A]" />
                    </button>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <button
                      onClick={() => {
                        triggerHapticFeedback('light');
                        onNavigate('virtual_mother');
                        setIsDrawerOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition cursor-pointer text-left ${
                        currentScreen === 'virtual_mother'
                          ? 'bg-[#F7EAE2] text-[#B76A4B] border border-[#B76A4B]/30 shadow-2xs'
                          : 'bg-white text-[#4D2D22] border border-[#EADCD1] hover:border-[#B76A4B]/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-base">🤱</span>
                        <span className="font-serif font-bold text-xs text-[#4D2D22]">Virtual Amma AI</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#8B756A]" />
                    </button>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <button
                      onClick={() => {
                        triggerHapticFeedback('light');
                        onNavigate('husband_dashboard');
                        setIsDrawerOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition cursor-pointer text-left ${
                        currentScreen === 'husband_dashboard'
                          ? 'bg-[#F7EAE2] text-[#B76A4B] border border-[#B76A4B]/30 shadow-2xs'
                          : 'bg-white text-[#4D2D22] border border-[#EADCD1] hover:border-[#B76A4B]/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-base">👨</span>
                        <span className="font-serif font-bold text-xs text-[#4D2D22]">Partner Dashboard</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#8B756A]" />
                    </button>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        setIsSilentEmergencyOpen(true);
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold text-rose-900 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-base">🚨</span>
                        <span className="font-serif font-bold text-xs text-rose-900">Silent Emergency SOS</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-rose-600" />
                    </button>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <button
                      onClick={() => {
                        triggerHapticFeedback('light');
                        onNavigate('profile');
                        setIsDrawerOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition cursor-pointer text-left ${
                        currentScreen === 'profile'
                          ? 'bg-[#F7EAE2] text-[#B76A4B] border border-[#B76A4B]/30 shadow-2xs'
                          : 'bg-white text-[#4D2D22] border border-[#EADCD1] hover:border-[#B76A4B]/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-base">⚙️</span>
                        <span className="font-serif font-bold text-xs text-[#4D2D22]">Settings & Profile</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#8B756A]" />
                    </button>
                  </motion.div>

                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-[#EADCD1] bg-white/60">
                <button
                  onClick={() => {
                    onLogout();
                    setIsDrawerOpen(false);
                  }}
                  className="w-full py-2.5 rounded-2xl bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border border-[#EADCD1] shadow-2xs"
                >
                  <LogOut className="w-4 h-4 text-stone-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Emergency SOS Modal */}
      {isSilentEmergencyOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border-2 border-rose-500 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <h3 className="font-bold text-lg text-rose-900 font-serif">Silent Emergency Help</h3>
              <button
                onClick={() => setIsSilentEmergencyOpen(false)}
                className="p-1.5 rounded-xl bg-stone-100 text-stone-600 hover:bg-stone-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-2 text-xs">
              <p className="font-bold text-stone-800">{user.emergencyContactName || 'Dr. Priya Sharma (OB-GYN)'}</p>
              <p className="text-rose-700 font-mono font-bold text-sm">{user.emergencyContactPhone || '+91 98111 22233'}</p>
            </div>

            <button
              onClick={() => setIsSilentEmergencyOpen(false)}
              className="w-full py-3 bg-rose-600 text-white font-bold text-xs rounded-2xl shadow-lg"
            >
              Close SOS
            </button>
          </div>
        </div>
      )}
    </>
  );
};
