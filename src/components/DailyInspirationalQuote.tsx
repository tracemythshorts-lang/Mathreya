import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { triggerHapticFeedback } from "../utils/haptics";
import { Quote, RefreshCw, Sparkles } from "lucide-react";

interface DailyInspirationalQuoteProps {
  currentStage: string;
  onStageSelect?: (stage: string) => void;
}

interface QuoteItem {
  quote: string;
  author: string;
  theme: string;
}

const STAGE_QUOTES: Record<string, QuoteItem[]> = {
  pregnancy: [
    {
      quote: "Your body is performing the greatest sacred miracle of nature. Rest, breathe, and honor every heartbeat inside you.",
      author: "Maternal Wisdom",
      theme: "Sacred Nurturing",
    },
    {
      quote: "In growing a new life, you discover an extraordinary reservoir of strength and unconditional love within your heart.",
      author: "Mathreya Sanctuary",
      theme: "Inner Strength",
    },
    {
      quote: "Every gentle kick and subtle movement is a silent reminder of the beautiful bond you are creating every single day.",
      author: "Maternal Guidance",
      theme: "Motherly Connection",
    },
  ],
  puberty: [
    {
      quote: "Your body's wisdom is awakening. Embrace your growth, physical changes, and emotions with gentle self-love and curiosity.",
      author: "Adolescent Care",
      theme: "Self-Acceptance",
    },
    {
      quote: "Honor your unique physical rhythm. Blooming takes time, and every phase of your growth is natural, strong, and sacred.",
      author: "Traditional Wisdom",
      theme: "Natural Rhythm",
    },
  ],
  menopause: [
    {
      quote: "This chapter is a golden celebration of your wisdom, resilience, and complete ownership of your wellbeing and peace.",
      author: "Hormonal Sanctuary",
      theme: "Golden Maturity",
    },
  ],
  husband: [
    {
      quote: "Your steady presence, empathetic listening, and active care create a sanctuary of safety and joy for your partner.",
      author: "Partner Network",
      theme: "Empathetic Presence",
    },
  ],
  virtual_mother: [
    {
      quote: "Whenever you need gentle guidance or a reassuring voice, remember that you are wrapped in infinite warmth and understanding.",
      author: "Amma Companion",
      theme: "Unconditional Support",
    },
  ],
  general: [
    {
      quote: "Nurture your body and mind with mindfulness, rest, and targeted care today. Every phase of womanhood is a superpower.",
      author: "Mathreya Sanctuary",
      theme: "Holistic Vitality",
    },
  ],
};

export const DailyInspirationalQuote: React.FC<DailyInspirationalQuoteProps> = ({
  currentStage,
}) => {
  const getStageKey = (s: string) => {
    if (s.includes("puberty")) return "puberty";
    if (s.includes("pregnancy")) return "pregnancy";
    if (s.includes("menopause")) return "menopause";
    if (s.includes("husband")) return "husband";
    if (s.includes("virtual")) return "virtual_mother";
    return "general";
  };

  const [selectedStageKey, setSelectedStageKey] = useState<string>(getStageKey(currentStage));
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    setSelectedStageKey(getStageKey(currentStage));
    setQuoteIndex(0);
  }, [currentStage]);

  // Auto-rotate quote every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => prev + 1);
    }, 8000);
    return () => clearInterval(timer);
  }, [selectedStageKey]);

  const quotesList = STAGE_QUOTES[selectedStageKey] || STAGE_QUOTES["general"];
  const currentQuote = quotesList[quoteIndex % quotesList.length];

  const handleNextQuote = (e: React.MouseEvent<HTMLButtonElement>) => {
    triggerHapticFeedback("light", e.currentTarget);
    setQuoteIndex((prev) => prev + 1);
  };

  return (
    <div className="rounded-3xl p-4 sm:p-5 border border-[#F0E8DD] bg-white shadow-2xs relative overflow-hidden select-none">
      <div className="flex items-center justify-between gap-2 border-b border-[#FAF6F0] pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-[#FFF5ED] text-[#C85A32] border border-[#F4D9CC] flex items-center justify-center">
            <Quote className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-[#5E2211] font-serif flex items-center gap-1">
            <span>Daily Reflection</span>
            <span className="text-[10px] text-stone-400 font-normal">• {currentQuote.theme}</span>
          </span>
        </div>

        <button
          onClick={handleNextQuote}
          className="p-1 rounded-xl bg-[#FCFAF7] hover:bg-[#FAF6F0] text-stone-500 hover:text-[#8B3012] transition cursor-pointer border border-[#EAE0D2]"
          title="Next Reflection"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={quoteIndex}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3 }}
          className="space-y-1.5"
        >
          <p className="text-xs sm:text-sm font-serif italic text-[#3D251E] leading-relaxed">
            "{currentQuote.quote}"
          </p>
          <p className="text-[11px] font-bold text-[#8B3012] text-right">
            — {currentQuote.author}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
