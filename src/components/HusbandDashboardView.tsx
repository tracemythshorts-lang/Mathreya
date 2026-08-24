import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HusbandTask, MedicalDoc, BabyName } from '../types';
import { INITIAL_HUSBAND_TASKS, INITIAL_MEDICAL_DOCS, INITIAL_BABY_NAMES } from '../data';
import { 
  Users, 
  CheckSquare, 
  FileText, 
  Heart, 
  PhoneCall, 
  AlertTriangle, 
  Plus, 
  Search, 
  Star, 
  ShieldAlert, 
  Download, 
  MessageCircle, 
  Sparkles,
  BookOpen,
  Film,
  Music,
  UserCheck,
  Calendar,
  Send,
  MapPin,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { triggerHapticFeedback } from '../utils/haptics';

interface HusbandDashboardViewProps {
  fontSizeClass: string;
  highContrast: boolean;
}

export const HusbandDashboardView: React.FC<HusbandDashboardViewProps> = ({ fontSizeClass, highContrast }) => {
  // 7 Pillar Architecture Nodes from Diagram:
  // 1. consultation (To-do list & Essentials)
  // 2. chat (Partner Sync Chat)
  // 3. media (Audio, Video, Articles)
  // 4. medical_vault (Encrypted Reports)
  // 5. name_generator (Indian Baby Names)
  // 6. sim (Strimata Identity / Sync)
  // 7. emergency (1-Tap SOS)
  const [activeTab, setActiveTab] = useState<'consultation' | 'chat' | 'media' | 'medical_vault' | 'name_generator' | 'sim' | 'emergency'>('consultation');

  // Tasks & Essentials State
  const [tasks, setTasks] = useState<HusbandTask[]>(INITIAL_HUSBAND_TASKS);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Partner Chat State
  const [partnerChatInput, setPartnerChatInput] = useState('');
  const [partnerChatMessages, setPartnerChatMessages] = useState<{ sender: 'husband' | 'bot'; text: string }[]>([
    { sender: 'bot', text: 'Namaste! I am your Birthing Partner AI Guide. How can I help you support Ananya today?' }
  ]);

  // Media Tab Sub-Filter
  const [mediaFilter, setMediaFilter] = useState<'audio' | 'video' | 'articles'>('audio');

  // Baby Names State
  const [babyNames, setBabyNames] = useState<BabyName[]>(INITIAL_BABY_NAMES);
  const [nameSearch, setNameSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'girl' | 'boy'>('all');

  // Emergency SOS State
  const [sosTriggered, setSosTriggered] = useState(false);

  const toggleTask = (id: string) => {
    triggerHapticFeedback('light');
    setTasks(tasks.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    triggerHapticFeedback('medium');
    const task: HusbandTask = {
      id: 'ht_' + Date.now(),
      title: newTaskTitle,
      category: 'essentials',
      dueDate: 'Today',
      isCompleted: false,
      priority: 'medium',
    };
    setTasks([task, ...tasks]);
    setNewTaskTitle('');
  };

  const toggleFavoriteName = (id: string) => {
    triggerHapticFeedback('light');
    setBabyNames(babyNames.map(b => b.id === id ? { ...b, isFavorite: !b.isFavorite } : b));
  };

  const handleSendPartnerChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerChatInput.trim()) return;
    triggerHapticFeedback('light');
    const userMsg = partnerChatInput;
    setPartnerChatMessages(prev => [...prev, { sender: 'husband', text: userMsg }]);
    setPartnerChatInput('');

    setTimeout(() => {
      setPartnerChatMessages(prev => [
        ...prev,
        { sender: 'bot', text: 'Remember to offer her warm ajwain water and encourage a 15-minute gentle evening walk together.' }
      ]);
    }, 1000);
  };

  const filteredNames = babyNames.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(nameSearch.toLowerCase()) || b.meaning.toLowerCase().includes(nameSearch.toLowerCase());
    const matchesGender = genderFilter === 'all' || b.gender === genderFilter;
    return matchesSearch && matchesGender;
  });

  return (
    <div className={`space-y-6 ${fontSizeClass} max-w-full sm:max-w-2xl md:max-w-4xl xl:max-w-6xl mx-auto text-[#4D2D22] select-none pb-8`}>
      
      {/* 1. HERO BANNER */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 sm:p-7 rounded-[32px] bg-gradient-to-br from-[#B76A4B] via-[#C57655] to-[#D48D68] text-white shadow-md space-y-2 relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold bg-white/20 text-amber-100 border border-white/30 backdrop-blur-xs uppercase tracking-wider">
                PARTNER MODULE • HUSBAND DASHBOARD
              </span>
              <span className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-white bg-black/20 px-3 py-0.5 rounded-full border border-white/20 backdrop-blur-xs">
                <Heart className="w-3.5 h-3.5 fill-rose-300 text-rose-300" /> Live Partner Sync
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-white tracking-tight">
              Husband Care & Assistance Center
            </h2>
            <p className="text-xs sm:text-sm text-white/90 font-medium max-w-2xl mt-1">
              Empowering husbands with consultation reminders, medical document vault, Sanskrit baby names, and instant emergency SOS.
            </p>
          </div>

          <div className="bg-black/20 p-3 rounded-2xl border border-white/30 text-center shrink-0">
            <p className="text-[10px] text-amber-100 font-bold uppercase tracking-wider">Partner Status</p>
            <p className="text-sm font-extrabold text-white font-serif">Ananya • Week 24 Care</p>
          </div>
        </div>
      </motion.div>

      {/* 2. 7-NODE HIGH-IMPACT GRID ARCHITECTURE (FROM DIAGRAM) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider font-serif text-[#4D2D22]">
            Husband Dashboard Modules
          </h3>
          <span className="text-[10px] font-bold text-[#8B756A]">
            7 Interactive Pillars
          </span>
        </div>

        {/* 7 Interactive Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          
          {/* Node 1: Consultation Reminder */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              triggerHapticFeedback('light');
              setActiveTab('consultation');
            }}
            className={`p-3.5 rounded-2xl text-left border transition cursor-pointer flex flex-col justify-between space-y-2 ${
              activeTab === 'consultation'
                ? 'bg-[#F7EAE2] border-2 border-[#B76A4B] text-[#B76A4B] shadow-2xs font-bold'
                : 'bg-white border-[#EADCD1] text-[#4D2D22] hover:border-[#B76A4B]/40 shadow-2xs'
            }`}
          >
            <div className={`p-2 rounded-xl w-fit ${activeTab === 'consultation' ? 'bg-[#B76A4B] text-white' : 'bg-[#FFF8F5] text-[#B76A4B]'}`}>
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-serif font-extrabold leading-tight">Reminders</p>
              <span className="text-[9px] text-[#8B756A] font-medium block">To-do & Bag</span>
            </div>
          </motion.button>

          {/* Node 2: Chat */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              triggerHapticFeedback('light');
              setActiveTab('chat');
            }}
            className={`p-3.5 rounded-2xl text-left border transition cursor-pointer flex flex-col justify-between space-y-2 ${
              activeTab === 'chat'
                ? 'bg-[#F7EAE2] border-2 border-[#B76A4B] text-[#B76A4B] shadow-2xs font-bold'
                : 'bg-white border-[#EADCD1] text-[#4D2D22] hover:border-[#B76A4B]/40 shadow-2xs'
            }`}
          >
            <div className={`p-2 rounded-xl w-fit ${activeTab === 'chat' ? 'bg-[#B76A4B] text-white' : 'bg-[#FFF8F5] text-[#B76A4B]'}`}>
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-serif font-extrabold leading-tight">Partner Chat</p>
              <span className="text-[9px] text-[#8B756A] font-medium block">AI Support</span>
            </div>
          </motion.button>

          {/* Node 3: Media */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              triggerHapticFeedback('light');
              setActiveTab('media');
            }}
            className={`p-3.5 rounded-2xl text-left border transition cursor-pointer flex flex-col justify-between space-y-2 ${
              activeTab === 'media'
                ? 'bg-[#F7EAE2] border-2 border-[#B76A4B] text-[#B76A4B] shadow-2xs font-bold'
                : 'bg-white border-[#EADCD1] text-[#4D2D22] hover:border-[#B76A4B]/40 shadow-2xs'
            }`}
          >
            <div className={`p-2 rounded-xl w-fit ${activeTab === 'media' ? 'bg-[#B76A4B] text-white' : 'bg-[#FFF8F5] text-[#B76A4B]'}`}>
              <Film className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-serif font-extrabold leading-tight">Media Hub</p>
              <span className="text-[9px] text-[#8B756A] font-medium block">Audio, Video, Reads</span>
            </div>
          </motion.button>

          {/* Node 4: Medical Vault */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              triggerHapticFeedback('light');
              setActiveTab('medical_vault');
            }}
            className={`p-3.5 rounded-2xl text-left border transition cursor-pointer flex flex-col justify-between space-y-2 ${
              activeTab === 'medical_vault'
                ? 'bg-[#F7EAE2] border-2 border-[#B76A4B] text-[#B76A4B] shadow-2xs font-bold'
                : 'bg-white border-[#EADCD1] text-[#4D2D22] hover:border-[#B76A4B]/40 shadow-2xs'
            }`}
          >
            <div className={`p-2 rounded-xl w-fit ${activeTab === 'medical_vault' ? 'bg-[#B76A4B] text-white' : 'bg-[#FFF8F5] text-[#B76A4B]'}`}>
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-serif font-extrabold leading-tight">Medical Vault</p>
              <span className="text-[9px] text-[#8B756A] font-medium block">Scans & Reports</span>
            </div>
          </motion.button>

          {/* Node 5: Name Generator */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              triggerHapticFeedback('light');
              setActiveTab('name_generator');
            }}
            className={`p-3.5 rounded-2xl text-left border transition cursor-pointer flex flex-col justify-between space-y-2 ${
              activeTab === 'name_generator'
                ? 'bg-[#F7EAE2] border-2 border-[#B76A4B] text-[#B76A4B] shadow-2xs font-bold'
                : 'bg-white border-[#EADCD1] text-[#4D2D22] hover:border-[#B76A4B]/40 shadow-2xs'
            }`}
          >
            <div className={`p-2 rounded-xl w-fit ${activeTab === 'name_generator' ? 'bg-[#B76A4B] text-white' : 'bg-[#FFF8F5] text-[#B76A4B]'}`}>
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-serif font-extrabold leading-tight">Baby Names</p>
              <span className="text-[9px] text-[#8B756A] font-medium block">Sanskrit & Nakshatra</span>
            </div>
          </motion.button>

          {/* Node 6: SIM (Strimata Identity Module) */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              triggerHapticFeedback('light');
              setActiveTab('sim');
            }}
            className={`p-3.5 rounded-2xl text-left border transition cursor-pointer flex flex-col justify-between space-y-2 ${
              activeTab === 'sim'
                ? 'bg-[#F7EAE2] border-2 border-[#B76A4B] text-[#B76A4B] shadow-2xs font-bold'
                : 'bg-white border-[#EADCD1] text-[#4D2D22] hover:border-[#B76A4B]/40 shadow-2xs'
            }`}
          >
            <div className={`p-2 rounded-xl w-fit ${activeTab === 'sim' ? 'bg-[#B76A4B] text-white' : 'bg-[#FFF8F5] text-[#B76A4B]'}`}>
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-serif font-extrabold leading-tight">Partner SIM</p>
              <span className="text-[9px] text-[#8B756A] font-medium block">Sync & Milestones</span>
            </div>
          </motion.button>

          {/* Node 7: Emergency */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              triggerHapticFeedback('light');
              setActiveTab('emergency');
            }}
            className={`p-3.5 rounded-2xl text-left border transition cursor-pointer flex flex-col justify-between space-y-2 col-span-2 sm:col-span-1 ${
              activeTab === 'emergency'
                ? 'bg-rose-600 border-2 border-rose-700 text-white shadow-2xs font-bold'
                : 'bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100 shadow-2xs'
            }`}
          >
            <div className={`p-2 rounded-xl w-fit ${activeTab === 'emergency' ? 'bg-white text-rose-600' : 'bg-rose-200 text-rose-800'}`}>
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-serif font-extrabold leading-tight">Emergency</p>
              <span className={`text-[9px] font-medium block ${activeTab === 'emergency' ? 'text-rose-100' : 'text-rose-600'}`}>1-Tap SOS</span>
            </div>
          </motion.button>

        </div>
      </div>

      {/* 3. ACTIVE PILLAR CONTENT VIEW */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.22 }}
        >
          {/* PILLAR 1: CONSULTATION REMINDERS & ESSENTIALS */}
          {activeTab === 'consultation' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-[32px] border border-[#EADCD1] shadow-2xs space-y-4">
                <h3 className="font-serif font-extrabold text-lg text-[#4D2D22]">Partner Daily To-Do Checklist</h3>
                
                <form onSubmit={addTask} className="flex gap-2">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Add task (e.g. Purchase Folic Acid, book 3D Scan, prepare bag)..."
                    className="flex-1 px-4 py-3 rounded-2xl border border-[#EADCD1] text-xs focus:ring-2 focus:ring-[#B76A4B] focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 bg-[#B76A4B] hover:bg-[#A05A3B] text-white font-extrabold text-xs rounded-2xl transition flex items-center gap-1 shadow-2xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Task
                  </button>
                </form>

                <div className="space-y-2.5 pt-2">
                  {tasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => toggleTask(t.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                        t.isCompleted
                          ? 'bg-[#FFF8F5] border-[#EADCD1] text-[#8B756A] line-through'
                          : 'bg-white border-[#EADCD1] text-[#4D2D22] hover:bg-[#FFF8F5]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={t.isCompleted}
                          onChange={() => {}}
                          className="w-4 h-4 text-[#B76A4B] rounded-md"
                        />
                        <div>
                          <p className="font-extrabold text-xs">{t.title}</p>
                          <span className="text-[10px] text-[#8B756A]">Due: {t.dueDate}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        t.priority === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-stone-100 text-stone-600'
                      }`}>
                        {t.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Essentials Hospital Bag Guide */}
              <div className="bg-white p-6 rounded-[32px] border border-[#EADCD1] shadow-2xs space-y-4">
                <h4 className="font-serif font-extrabold text-base text-[#4D2D22]">Hospital Bag Essentials Guide</h4>
                <ul className="text-xs text-[#8B756A] space-y-3 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="text-[#B76A4B]">✓</span> Doctor Prescriptions & Medical File Folder
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B76A4B]">✓</span> Government ID Cards & Health Insurance Copy
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B76A4B]">✓</span> 2 Pairs Loose Cotton Clothes for Mother
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B76A4B]">✓</span> Soft Baby Blankets, Caps & Mittens
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#B76A4B]">✓</span> Warm Thermos with Ajwain Herbal Tea
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* PILLAR 2: PARTNER CHAT */}
          {activeTab === 'chat' && (
            <div className="bg-white p-6 rounded-[32px] border border-[#EADCD1] shadow-2xs space-y-4 max-w-3xl mx-auto">
              <div className="flex justify-between items-center border-b border-[#EADCD1] pb-3">
                <h3 className="font-serif font-extrabold text-base text-[#4D2D22] flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-[#B76A4B]" /> Birthing Partner AI Guide
                </h3>
                <span className="text-[10px] text-[#8B756A]">Empathic Couple Support</span>
              </div>

              <div className="h-64 overflow-y-auto space-y-3 p-3 bg-[#FFF8F5] rounded-2xl border border-[#EADCD1]">
                {partnerChatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'husband' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'husband' 
                        ? 'bg-[#B76A4B] text-white rounded-tr-none font-medium' 
                        : 'bg-white text-[#4D2D22] rounded-tl-none border border-[#EADCD1] shadow-2xs font-serif'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendPartnerChat} className="flex gap-2">
                <input
                  type="text"
                  value={partnerChatInput}
                  onChange={(e) => setPartnerChatInput(e.target.value)}
                  placeholder="Ask how to support your partner today..."
                  className="flex-1 px-4 py-3 rounded-2xl border border-[#EADCD1] text-xs focus:ring-2 focus:ring-[#B76A4B] focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-[#B76A4B] hover:bg-[#A05A3B] text-white font-extrabold text-xs rounded-2xl transition flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <Send className="w-4 h-4" /> Send
                </button>
              </form>
            </div>
          )}

          {/* PILLAR 3: MEDIA HUB (Audio, Video, Articles) */}
          {activeTab === 'media' && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 border-b border-[#EADCD1] pb-3">
                {[
                  { id: 'audio', label: 'Couple Audio Ragas', icon: Music },
                  { id: 'video', label: 'Birthing Partner Videos', icon: Film },
                  { id: 'articles', label: 'Paternal Care Guides', icon: BookOpen },
                ].map((m) => {
                  const Icon = m.icon;
                  const isActive = mediaFilter === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMediaFilter(m.id as any)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-extrabold transition cursor-pointer ${
                        isActive ? 'bg-[#B76A4B] text-white shadow-2xs' : 'bg-white text-[#4D2D22] hover:bg-[#FFF8F5] border border-[#EADCD1]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Media Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {mediaFilter === 'audio' && (
                  <>
                    <div className="bg-white p-5 rounded-[32px] border border-[#EADCD1] shadow-2xs space-y-3">
                      <div className="p-3 bg-amber-50 text-amber-800 rounded-2xl w-fit">
                        <Music className="w-5 h-5" />
                      </div>
                      <h4 className="font-serif font-bold text-base text-[#4D2D22]">Garbh Sanskar Evening Raga</h4>
                      <p className="text-xs text-[#8B756A]">Traditional Sitar & Flute composition for couples relaxation.</p>
                      <button className="px-4 py-2 bg-[#B76A4B] text-white rounded-xl text-xs font-extrabold">Play Audio (12m)</button>
                    </div>

                    <div className="bg-white p-5 rounded-[32px] border border-[#EADCD1] shadow-2xs space-y-3">
                      <div className="p-3 bg-rose-50 text-rose-800 rounded-2xl w-fit">
                        <Music className="w-5 h-5" />
                      </div>
                      <h4 className="font-serif font-bold text-base text-[#4D2D22]">Vedic Chants for Baby Growth</h4>
                      <p className="text-xs text-[#8B756A]">Peaceful chants for father to recite aloud near bump.</p>
                      <button className="px-4 py-2 bg-[#B76A4B] text-white rounded-xl text-xs font-extrabold">Play Audio (15m)</button>
                    </div>
                  </>
                )}

                {mediaFilter === 'video' && (
                  <div className="bg-white p-5 rounded-[32px] border border-[#EADCD1] shadow-2xs space-y-3">
                    <div className="p-3 bg-sky-50 text-sky-800 rounded-2xl w-fit">
                      <Film className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif font-bold text-base text-[#4D2D22]">Lower Back Massage Technique</h4>
                    <p className="text-xs text-[#8B756A]">Step-by-step video guide for husband to relieve wife's back tension.</p>
                    <button className="px-4 py-2 bg-sky-700 text-white rounded-xl text-xs font-extrabold">Watch Video (8m)</button>
                  </div>
                )}

                {mediaFilter === 'articles' && (
                  <div className="bg-white p-5 rounded-[32px] border border-[#EADCD1] shadow-2xs space-y-3">
                    <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl w-fit">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif font-bold text-base text-[#4D2D22]">Understanding Trimester Mood Swings</h4>
                    <p className="text-xs text-[#8B756A]">Essential guide for husbands on emotional reassurance & hormones.</p>
                    <button className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-extrabold">Read Article (4m)</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PILLAR 4: MEDICAL VAULT */}
          {activeTab === 'medical_vault' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-serif font-extrabold text-lg text-[#4D2D22]">Encrypted Medical Document Vault</h3>
                <button className="px-4 py-2 bg-[#B76A4B] text-white rounded-2xl text-xs font-extrabold shadow-2xs hover:bg-[#A05A3B] transition flex items-center gap-1.5 cursor-pointer">
                  <Plus className="w-4 h-4" /> Upload New Report
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {INITIAL_MEDICAL_DOCS.map((doc) => (
                  <div key={doc.id} className="bg-white p-5 rounded-[32px] border border-[#EADCD1] shadow-2xs space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider bg-teal-100 text-teal-900 px-3 py-1 rounded-full border border-teal-200">
                        {doc.type}
                      </span>
                      <span className="text-xs text-[#8B756A] font-medium">{doc.date}</span>
                    </div>
                    <h4 className="font-serif font-bold text-base text-[#4D2D22]">{doc.title}</h4>
                    <p className="text-xs text-[#8B756A] font-medium">{doc.doctorName}</p>
                    <div className="flex justify-between items-center border-t border-[#EADCD1] pt-3 text-xs text-[#8B756A]">
                      <span>{doc.fileSize}</span>
                      <button className="flex items-center gap-1 font-extrabold text-[#B76A4B] hover:underline cursor-pointer">
                        <Download className="w-3.5 h-3.5" /> Download PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PILLAR 5: INDIAN BABY NAME GENERATOR */}
          {activeTab === 'name_generator' && (
            <div className="bg-white p-6 rounded-[32px] border border-[#EADCD1] shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-serif font-extrabold text-xl text-[#4D2D22]">Indian Traditional Baby Name Finder</h3>
                  <p className="text-xs text-[#8B756A] font-medium">Discover Sanskrit origins, Nakshatra, Rashi, and meaningful names</p>
                </div>

                <div className="flex items-center gap-2">
                  {(['all', 'girl', 'boy'] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => setGenderFilter(g)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold capitalize transition cursor-pointer ${
                        genderFilter === g
                          ? 'bg-[#B76A4B] text-white shadow-2xs'
                          : 'bg-[#FFF8F5] text-[#4D2D22] border border-[#EADCD1]'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-[#8B756A] absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={nameSearch}
                  onChange={(e) => setNameSearch(e.target.value)}
                  placeholder="Search by name, Sanskrit meaning, or Nakshatra..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#EADCD1] text-xs focus:ring-2 focus:ring-[#B76A4B] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNames.map((name) => (
                  <div key={name.id} className="p-4 rounded-2xl bg-[#FFF8F5] border border-[#EADCD1] space-y-2 relative">
                    <button
                      onClick={() => toggleFavoriteName(name.id)}
                      className="absolute top-3 right-3 text-amber-500 cursor-pointer"
                    >
                      <Star className={`w-4 h-4 ${name.isFavorite ? 'fill-amber-400' : ''}`} />
                    </button>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-extrabold text-lg text-[#4D2D22]">{name.name}</h4>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full capitalize ${
                        name.gender === 'girl' ? 'bg-rose-100 text-rose-800' : 'bg-sky-100 text-sky-800'
                      }`}>
                        {name.gender}
                      </span>
                    </div>
                    <p className="text-xs text-[#8B756A] font-serif italic">"{name.meaning}"</p>
                    <div className="text-[11px] text-[#8B756A] space-y-0.5 border-t border-[#EADCD1] pt-2 font-medium">
                      <p><strong>Origin:</strong> {name.origin}</p>
                      <p><strong>Rashi / Nakshatra:</strong> {name.rashi} • {name.nakshatra}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PILLAR 6: SIM (STRIMATA IDENTITY MODULE & PARTNER SYNC) */}
          {activeTab === 'sim' && (
            <div className="bg-white p-6 rounded-[32px] border border-[#EADCD1] shadow-2xs space-y-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-between border-b border-[#EADCD1] pb-4">
                <div>
                  <h3 className="font-serif font-extrabold text-xl text-[#4D2D22]">Strimata Identity Module (SIM)</h3>
                  <p className="text-xs text-[#8B756A] font-medium">Synchronized partner health telemetry & doctor routing</p>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-extrabold border border-emerald-200">
                  ✓ Live Synced
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#FFF8F5] border border-[#EADCD1] space-y-1">
                  <p className="text-[10px] text-[#8B756A] font-bold uppercase">Pregnancy Status</p>
                  <p className="font-serif font-extrabold text-base text-[#4D2D22]">Trimester 2 • Week 24</p>
                  <p className="text-xs text-[#8B756A]">Due Date: Nov 18, 2026</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFF8F5] border border-[#EADCD1] space-y-1">
                  <p className="text-[10px] text-[#8B756A] font-bold uppercase">Primary OB-GYN</p>
                  <p className="font-serif font-extrabold text-base text-[#4D2D22]">Dr. Radhika Sharma</p>
                  <p className="text-xs text-[#8B756A]">Cloudnine Hospital, Bengaluru</p>
                </div>
              </div>
            </div>
          )}

          {/* PILLAR 7: EMERGENCY SOS */}
          {activeTab === 'emergency' && (
            <div className="bg-white p-8 rounded-[32px] border-2 border-rose-300 shadow-md text-center space-y-6 max-w-xl mx-auto">
              <AlertTriangle className="w-14 h-14 text-rose-600 mx-auto animate-bounce" />
              <div>
                <h3 className="font-serif font-extrabold text-2xl text-rose-900">1-Tap Emergency SOS Trigger</h3>
                <p className="text-xs text-[#8B756A] font-medium mt-1 leading-relaxed">
                  Instantly dispatches ambulance, calls primary OB-GYN hotline, and broadcasts live GPS location to emergency contacts.
                </p>
              </div>

              {sosTriggered && (
                <div className="p-4 rounded-2xl bg-rose-600 text-white font-extrabold text-xs space-y-1 shadow-lg">
                  <p>🚨 EMERGENCY BROADCAST ACTIVATED!</p>
                  <p className="font-mono text-[11px]">Contacting Hospital Ambulance & Dr. Radhika...</p>
                </div>
              )}

              <button
                onClick={() => {
                  triggerHapticFeedback('heavy');
                  setSosTriggered(true);
                }}
                className="w-full py-5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl transition transform active:scale-95 cursor-pointer"
              >
                {sosTriggered ? 'ALERT BROADCASTING NOW' : 'TAP HERE FOR IMMEDIATE EMERGENCY HELP'}
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

    </div>
  );
};
