import React, { useState } from 'react';
import { AppScreen, UserProfile } from './types';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { LoginView } from './components/LoginView';
import { ProfileView } from './components/ProfileView';
import { PubertyView } from './components/PubertyView';
import { PregnancyView } from './components/PregnancyView';
import { VirtualMomView } from './components/VirtualMomView';
import { HusbandDashboardView } from './components/HusbandDashboardView';
import { FlutterCodeModal } from './components/FlutterCodeModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ArrowLeft, Sparkles } from 'lucide-react';
import { triggerHapticFeedback } from './utils/haptics';

function MainAppContent() {
  const {
    user: authUser,
    status: authStatus,
    logout,
  } = useAuth();

  // DEFAULT SCREEN IS 'login' ON FIRST OPEN (NOT DASHBOARD)
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('login');
  const [isFlutterModalOpen, setIsFlutterModalOpen] = useState<boolean>(false);
  const [localProfile, setLocalProfile] = useState<UserProfile>({
    name: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '+91 98765 43210',
    age: 26,
    stage: 'pregnancy_prenatal',
    avatarUrl: typeof window !== 'undefined' ? localStorage.getItem('mathreya_user_face_photo') || undefined : undefined,
    faceAuthEnabled: true,
    isAuthenticated: false,
    pregnancyWeek: 24,
    emergencyContactName: 'Dr. Priya Sharma (Sister / OB-GYN)',
    emergencyContactPhone: '+91 98111 22233',
    location: 'Bengaluru, Karnataka',
  });

  const isAuthenticated = authStatus === 'authenticated';

  const currentUser: UserProfile = authUser
    ? { ...localProfile, ...authUser, isAuthenticated }
    : { ...localProfile, isAuthenticated };

  const handleUpdateUser = (updated: Partial<UserProfile>) => {
    setLocalProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleLoginSuccess = (loginData: Partial<UserProfile>) => {
    setLocalProfile((prev) => ({
      ...prev,
      ...loginData,
      isAuthenticated: true,
    }));
    setCurrentScreen('dashboard');
  };

  const [logoutToast, setLogoutToast] = useState<string | null>(null);

  const handleLogout = async () => {
    await logout();
    setLogoutToast('Thanks for having with us! Have a great time ✨');
    setCurrentScreen('login');
    setTimeout(() => setLogoutToast(null), 5000);
  };

  const primaryScreens: AppScreen[] = [
    'dashboard',
    'puberty',
    'pregnancy_prenatal',
    'virtual_mother',
    'husband_dashboard',
  ];

  const handleSwipeEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    const swipeThreshold = 60;
    const currentIndex = primaryScreens.indexOf(currentScreen);
    if (currentIndex === -1) return;

    if (info.offset.x < -swipeThreshold && currentIndex < primaryScreens.length - 1) {
      triggerHapticFeedback('light');
      setCurrentScreen(primaryScreens[currentIndex + 1]);
    } else if (info.offset.x > swipeThreshold && currentIndex > 0) {
      triggerHapticFeedback('light');
      setCurrentScreen(primaryScreens[currentIndex - 1]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#FFF8F5] text-[#4D2D22] antialiased selection:bg-[#B76A4B]/20 selection:text-[#B76A4B]">
      {/* Signout Toast Banner */}
      <AnimatePresence>
        {logoutToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            className="fixed top-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none"
          >
            <div className="bg-gradient-to-r from-[#8B3012] via-[#C85A32] to-[#D97757] text-white px-6 py-3.5 rounded-full shadow-2xl border border-amber-200/40 text-xs sm:text-sm font-serif font-extrabold flex items-center gap-2.5 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
              <span>{logoutToast}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navbar */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        user={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Application Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 md:px-6 py-3 md:py-6 pb-20 md:pb-6 overflow-hidden">
        {/* Clean Back Button Header */}
        {currentScreen !== 'dashboard' && currentScreen !== 'login' && currentScreen !== 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center justify-between"
          >
            <button
              onClick={() => {
                triggerHapticFeedback('light');
                setCurrentScreen('dashboard');
              }}
              className="flex items-center gap-2 text-xs font-bold text-[#B76A4B] bg-white px-4 py-2 rounded-2xl border border-[#EADCD1] shadow-2xs hover:bg-[#F7EAE2] transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#B76A4B]" />
              <span className="font-serif">Back to Home</span>
            </button>

            <span className="text-xs font-extrabold text-[#B76A4B] bg-[#F7EAE2] border border-[#EADCD1] px-3.5 py-1 rounded-full flex items-center gap-1 shadow-2xs">
              🪷 Mathreya Sanctuary
            </span>
          </motion.div>
        )}

        {/* Animated View Routing */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={handleSwipeEnd}
            initial={{ opacity: 0, x: 20, scale: 0.99 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.99 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="touch-pan-y"
          >
            {currentScreen === 'dashboard' && (
              <DashboardView user={currentUser} onNavigate={setCurrentScreen} />
            )}

            {currentScreen === 'login' && (
              <LoginView
                onLoginSuccess={handleLoginSuccess}
                onContinueAsGuest={() => setCurrentScreen('dashboard')}
              />
            )}

            {currentScreen === 'profile' && (
              <ProfileView
                user={currentUser}
                onUpdateUser={handleUpdateUser}
                onNavigate={setCurrentScreen}
                onOpenFlutterCode={() => setIsFlutterModalOpen(true)}
              />
            )}

            {currentScreen === 'puberty' && (
              <PubertyView fontSizeClass="text-base" highContrast={false} />
            )}

            {(currentScreen === 'pregnancy_prenatal' || currentScreen === 'pregnancy_postnatal') && (
              <PregnancyView
                initialSubStage={currentScreen === 'pregnancy_postnatal' ? 'postnatal' : 'prenatal'}
                fontSizeClass="text-base"
                highContrast={false}
              />
            )}

            {currentScreen === 'virtual_mother' && (
              <VirtualMomView fontSizeClass="text-base" highContrast={false} />
            )}

            {currentScreen === 'husband_dashboard' && (
              <HusbandDashboardView fontSizeClass="text-base" highContrast={false} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Flutter Source Modal */}
      <FlutterCodeModal
        isOpen={isFlutterModalOpen}
        onClose={() => setIsFlutterModalOpen(false)}
        activeStage={
          currentScreen === 'login' || currentScreen === 'profile' || currentScreen === 'dashboard'
            ? 'pregnancy_prenatal'
            : currentScreen
        }
        activeSubTab="tracker"
      />

      {/* FLOATING ACTION BUTTON (FAB) FOR VIRTUAL MOTHER CHAT ON MOBILE */}
      {currentUser.isAuthenticated &&
        currentScreen !== 'dashboard' &&
        currentScreen !== 'virtual_mother' &&
        currentScreen !== 'login' && (
          <div className="fixed bottom-6 right-5 z-50 md:hidden flex items-center gap-2">
            <button
              onClick={() => {
                triggerHapticFeedback('pulse');
                setCurrentScreen('virtual_mother');
              }}
              className="fab-warm-pulse px-4 py-3 rounded-full bg-gradient-to-r from-[#B76A4B] to-[#C85A32] text-white border-2 border-white shadow-2xl flex items-center gap-2.5 cursor-pointer active:scale-95 transition-transform"
              title="Launch Virtual Mother AI Chat"
            >
              <div className="relative flex items-center justify-center">
                <Heart className="w-5 h-5 text-amber-200 fill-amber-200 animate-pulse" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-black tracking-wide font-serif leading-none text-white">
                  Virtual Amma
                </span>
                <span className="text-[9px] font-bold text-amber-200/90 leading-none mt-0.5 uppercase tracking-wider">
                  Ask Amma AI
                </span>
              </div>
            </button>
          </div>
        )}
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}

export default App;
