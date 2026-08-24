import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  ArrowRight, 
  Volume2, 
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Users,
  X,
  Calendar,
  Sparkle
} from 'lucide-react';
import { AppScreen, UserProfile } from '../types';
import { triggerHapticFeedback } from '../utils/haptics';

interface DashboardViewProps {
  user: UserProfile;
  onNavigate: (screen: AppScreen) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ user, onNavigate }) => {
  // Dynamic Amma Messages tailored for her daughter based on Mood
  const ammaMoodMessages: Record<string, string> = {
    '😊': "Seeing you smile makes my heart blossom, my child! Keep shining bright today! ✨",
    '😀': "Your happiness brings warmth to our entire home! May God bless you always, Kanna!",
    '😐': "You worked so hard today, Beti. Take a rest, drink a warm cup of haldi milk, and let Amma handle things.",
    '😔': "Come here, my child... Amma is holding your hand. Eat a warm meal and rest your mind. Everything will be okay.",
    '😭': "Don't cry my precious child... Amma is right here with you. Take a deep breath and let Amma wrap you in a warm hug."
  };

  // Interactive Mood State
  const [selectedMood, setSelectedMood] = useState<string>('😊');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showMenopauseModal, setShowMenopauseModal] = useState(false);

  const currentAmmaQuote = ammaMoodMessages[selectedMood] || ammaMoodMessages['😊'];

  // Audio Playback Simulation for "Listen to Amma"
  const handleListenToAmma = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHapticFeedback('medium');
    setIsPlayingAudio(true);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentAmmaQuote);
      utterance.rate = 0.88;
      utterance.pitch = 1.05;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingAudio(false), 3000);
    }
  };

  // Lifestage Modules with Indian Traditional Artwork and Reliable Fallbacks
  const lifestageCards = [
    {
      id: 'puberty' as AppScreen,
      title: 'Puberty',
      subtitle: 'Understanding your body and cycle tracking.',
      primaryImage: 'assets/puberty.png',
      fallbackImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      badge: 'Cycle Guide',
      actionText: 'Enter →',
      isComingSoon: false,
    },
    {
      id: 'pregnancy_prenatal' as AppScreen,
      title: 'Pregnancy',
      subtitle: 'Weekly fetal growth & prenatal health care.',
      primaryImage: 'assets/pregnancy.png',
      fallbackImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      badge: 'Week 24 Care',
      actionText: 'Enter →',
      isComingSoon: false,
    },
    {
      id: 'menopause' as any,
      title: 'Menopause',
      subtitle: 'Hormonal balance & Ayurvedic yoga care.',
      primaryImage: 'assets/puberty.png',
      fallbackImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      badge: 'Coming Soon 🪷',
      actionText: 'Coming Soon →',
      isComingSoon: true,
    },
    {
      id: 'husband_dashboard' as AppScreen,
      title: 'Partner Care',
      subtitle: 'Husband support checklists & doctor visit sync.',
      primaryImage: 'assets/partner.png',
      fallbackImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      badge: 'Family Sync',
      actionText: 'Enter →',
      isComingSoon: false,
    },
    {
      id: 'virtual_mother' as AppScreen,
      title: 'Virtual Mom',
      subtitle: 'WhatsApp video call & Grandma Nuskhe.',
      primaryImage: 'assets/amma.png',
      fallbackImage: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80',
      badge: 'Ask Amma AI',
      actionText: 'Enter →',
      isComingSoon: false,
    },
  ];

  return (
    <div className="w-full max-w-full sm:max-w-2xl md:max-w-4xl xl:max-w-6xl mx-auto px-3 sm:px-6 md:px-8 py-3 space-y-4 select-none text-[#4D2D22] bg-[#FFF8F5]">
      
      {/* Top Hero & Quick Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        
        {/* 1. Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="md:col-span-3 bg-gradient-to-br from-[#B76A4B] via-[#C57655] to-[#D48D68] text-white rounded-[32px] p-5 sm:p-6 shadow-md space-y-1.5 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <p className="text-[11px] sm:text-xs font-bold text-amber-100 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Shubha Sandhya • Good Evening</span>
            </p>
            <span className="text-base">🪷</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>{user.name.split(' ')[0]}</span>
            <span className="text-xl sm:text-2xl animate-pulse">🌸</span>
          </h1>
          <p className="text-xs sm:text-sm text-white/90 font-serif italic pt-0.5">
            "The Care That Feels Like Home"
          </p>
        </motion.div>

        {/* 2. Dynamic Mood Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="md:col-span-1 bg-[#F7EAE2] rounded-[28px] p-4 sm:p-5 border border-[#EADCD1] shadow-2xs space-y-2 overflow-hidden w-full flex flex-col justify-between"
        >
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-bold text-[#8B756A] uppercase tracking-wider">
              How are you feeling?
            </p>
            <span className="text-[10px] font-extrabold text-[#B76A4B] bg-white px-2 py-0.5 rounded-full border border-[#EADCD1]">
              Amma Listens 💖
            </span>
          </div>
          
          <div className="flex items-center justify-between gap-1 pt-1 w-full">
            {['😊', '😀', '😐', '😔', '😭'].map((emoji) => {
              const isSelected = selectedMood === emoji;
              return (
                <motion.button
                  key={emoji}
                  whileTap={{ scale: 0.85 }}
                  whileHover={{ scale: 1.15 }}
                  onClick={() => {
                    triggerHapticFeedback('light');
                    setSelectedMood(emoji);
                  }}
                  className={`text-xl sm:text-2xl py-2 px-1.5 rounded-2xl transition-all cursor-pointer flex-1 flex items-center justify-center ${
                    isSelected 
                      ? 'bg-white scale-105 border border-[#B76A4B]/40 shadow-xs ring-2 ring-[#B76A4B]/20' 
                      : 'opacity-65 hover:opacity-100'
                  }`}
                >
                  {emoji}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* 3. Amma Says... Card (Dynamically Reacts to Daughter's Mood) */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="md:col-span-2 bg-white rounded-[28px] p-4 sm:p-5 border border-[#EADCD1] shadow-2xs space-y-2.5 cursor-pointer hover:border-[#B76A4B]/40 transition group flex flex-col justify-between"
          onClick={() => onNavigate('virtual_mother')}
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#B76A4B] flex items-center gap-1.5">
              <Heart className="w-4 h-4 fill-[#B76A4B]" />
              <span>Amma says to her daughter...</span>
            </span>
            
            <button
              onClick={handleListenToAmma}
              className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                isPlayingAudio 
                  ? 'bg-[#B76A4B] text-white animate-pulse' 
                  : 'bg-[#FFF8F5] text-[#B76A4B] hover:bg-[#F7EAE2] border border-[#EADCD1]'
              }`}
            >
              <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
              <span>{isPlayingAudio ? 'Speaking...' : 'Listen'}</span>
            </button>
          </div>

          <blockquote className="text-xs sm:text-sm font-serif italic text-[#4D2D22] leading-relaxed">
            "{currentAmmaQuote}"
          </blockquote>
        </motion.div>

      </div>

      {/* 4. MATERNAL LIFESTAGES */}
      <div className="space-y-3 pt-1">
        
        {/* Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B76A4B] animate-ping shrink-0" />
            <h2 className="text-sm sm:text-base font-extrabold text-[#4D2D22] uppercase tracking-wider font-serif">
              Maternal Lifestages
            </h2>
          </div>

          <span className="text-[10px] font-extrabold text-[#B76A4B] bg-[#F7EAE2] px-3 py-0.5 rounded-full border border-[#EADCD1] inline-flex items-center gap-1 shrink-0">
            🪷 Indian Culture
          </span>
        </div>

        {/* Lifestage Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {lifestageCards.map((card, idx) => (
            <motion.div
              key={card.title + idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.04 * idx }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                triggerHapticFeedback('light');
                if (card.isComingSoon) {
                  setShowMenopauseModal(true);
                } else {
                  onNavigate(card.id);
                }
              }}
              className="bg-white rounded-[28px] p-3.5 sm:p-4 border border-[#EADCD1] shadow-2xs hover:shadow-md hover:border-[#B76A4B]/40 transition-all flex items-center gap-3.5 cursor-pointer group relative overflow-hidden"
            >
              {/* Left Image Portrait Container */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#FFF8F5] overflow-hidden shrink-0 border border-[#EADCD1] p-0.5 relative group-hover:scale-105 transition-transform">
                <img 
                  src={card.primaryImage} 
                  alt={card.title} 
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = card.fallbackImage;
                  }}
                  className="w-full h-full object-cover rounded-xl" 
                />
              </div>

              {/* Right Content */}
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="font-serif font-extrabold text-base text-[#4D2D22] group-hover:text-[#B76A4B] transition leading-tight truncate">
                    {card.title}
                  </h3>

                  {card.isComingSoon ? (
                    <span className="text-[9px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full shrink-0">
                      Coming Soon 🪷
                    </span>
                  ) : (
                    <span className="text-[9px] font-extrabold bg-[#F7EAE2] text-[#B76A4B] border border-[#EADCD1] px-2 py-0.5 rounded-full shrink-0">
                      {card.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#8B756A] font-medium leading-snug line-clamp-2">
                  {card.subtitle}
                </p>

                <div className="pt-0.5 flex items-center justify-between">
                  <button className={`px-3 py-1 rounded-full text-white text-[11px] font-extrabold shadow-2xs transition flex items-center gap-1 cursor-pointer ${
                    card.isComingSoon ? 'bg-[#8B756A] hover:bg-[#6E5950]' : 'bg-[#B76A4B] hover:bg-[#A05A3B]'
                  }`}>
                    <span>{card.actionText}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* MENOPAUSE COMING SOON MODAL */}
      <AnimatePresence>
        {showMenopauseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[36px] p-6 sm:p-8 max-w-md w-full border-2 border-[#B76A4B] shadow-2xl text-center space-y-4 relative"
            >
              <button
                onClick={() => setShowMenopauseModal(false)}
                className="absolute top-4 right-4 p-2 text-[#8B756A] hover:text-[#4D2D22] rounded-full hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-full bg-[#FFF8F5] border-2 border-[#B76A4B] text-[#B76A4B] flex items-center justify-center mx-auto shadow-sm">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300">
                  Phase 2 Feature • Coming Soon
                </span>
                <h3 className="font-serif font-extrabold text-2xl text-[#4D2D22] mt-2">
                  Menopause & Hormonal Sanctuary
                </h3>
                <p className="text-xs text-[#8B756A] font-medium leading-relaxed mt-2">
                  We are crafting Ayurvedic herbal care protocols for hot flashes, bone density tracking, Nidra yoga, and traditional estrogen-balancing nutrition for mature women.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF8F5] border border-[#EADCD1] text-xs text-[#4D2D22] font-serif italic">
                "Honoring every stage of womanhood with dignity, grace, and ancient science."
              </div>

              <button
                onClick={() => setShowMenopauseModal(false)}
                className="w-full py-3.5 bg-[#B76A4B] hover:bg-[#A05A3B] text-white font-serif font-extrabold rounded-2xl text-xs shadow-md transition cursor-pointer"
              >
                Got It • Return to Sanctuary
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Silent Emergency SOS & Community Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        <button
          onClick={() => onNavigate('husband_dashboard')}
          className="w-full py-3 px-5 rounded-3xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold transition flex items-center justify-between cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Silent Emergency Help</span>
          </span>
          <ChevronRight className="w-4 h-4 text-rose-600" />
        </button>

        <div className="bg-white rounded-3xl p-3 px-5 border border-[#EADCD1] shadow-2xs flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-2xl bg-[#FFF8F5] text-[#B76A4B] flex items-center justify-center border border-[#EADCD1]">
              <Users className="w-4 h-4 text-[#B76A4B]" />
            </div>
            <div>
              <p className="font-bold text-[#4D2D22]">Maternal Care Sanctuary</p>
              <p className="text-[10px] text-[#8B756A]">Traditional Wisdom & Science</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-[#B76A4B] bg-[#FFF8F5] px-2.5 py-0.5 rounded-full border border-[#EADCD1]">
            v2.4 Active
          </span>
        </div>
      </div>

      {/* 6. BEAUTIFUL TRADITIONAL INDIAN FOOTER BANNER (REMOVES EMPTY BOTTOM GAP) */}
      <div className="bg-[#F7EAE2] rounded-3xl p-4 border border-[#EADCD1] text-center space-y-1 mt-2">
        <p className="text-xs font-serif font-extrabold text-[#4D2D22] flex items-center justify-center gap-1.5">
          <span>🪷</span> Mathreya Maternal Sanctuary <span>🪷</span>
        </p>
        <p className="text-[11px] font-serif italic text-[#B76A4B]">
          "The Care That Feels Like Home • Nurturing Motherhood Across All Generations"
        </p>
      </div>

    </div>
  );
};
