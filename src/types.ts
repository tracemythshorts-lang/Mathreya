export type AppScreen = 
  | 'login'
  | 'dashboard'
  | 'puberty'
  | 'pregnancy_prenatal'
  | 'pregnancy_postnatal'
  | 'virtual_mother'
  | 'husband_dashboard'
  | 'profile';

export type LifeStage = 'puberty' | 'pregnancy_prenatal' | 'pregnancy_postnatal' | 'virtual_mother' | 'husband_dashboard';

export type SubTab = 
  | 'overview'
  | 'safe_space'
  | 'ai_assistant'
  | 'period_tracker'
  | 'media'
  | 'community'
  | 'socials'
  | 'mentorship'
  | 'ai_psychiatrist'
  | 'consultation'
  | 'routines'
  | 'persona_creation'
  | 'live_interaction'
  | 'memory_layer'
  | 'consultation_reminders'
  | 'chat'
  | 'medical_vault'
  | 'name_generator'
  | 'partner_sync'
  | 'emergency';

export interface UserProfile {
  name: string;
  email?: string;
  phone?: string;
  age: number;
  stage: LifeStage;
  avatarUrl?: string;
  faceAuthEnabled: boolean;
  isAuthenticated: boolean;
  pregnancyWeek?: number;
  babyNameChoice?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  location?: string;
}

export interface PeriodLog {
  date: string;
  flowLevel: 'light' | 'medium' | 'heavy' | 'spotting';
  symptoms: string[];
  mood: string;
  notes?: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'puberty' | 'prenatal' | 'postnatal' | 'general';
  mood?: string;
  isEncrypted: boolean;
}

export interface MediaItem {
  id: string;
  title: string;
  description: string;
  category: 'audio' | 'video' | 'articles';
  stage: 'puberty' | 'prenatal' | 'postnatal' | 'husband' | 'all';
  duration?: string;
  readTime?: string;
  thumbnailUrl?: string;
  authorUrl?: string;
  tags: string[];
  url?: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar?: string;
  ageGroup?: string;
  title: string;
  content: string;
  likes: number;
  commentsCount: number;
  date: string;
  isModerated: boolean;
  stage: LifeStage;
}

export interface VirtualMomConfig {
  name: string;
  avatarImage: string;
  voiceVaultSample?: string;
  voiceName: string; // e.g., 'Amma (Warm & Calm)', 'Maa (Gentle & Wise)'
  personalityTraits: string[];
  memories: string[];
  specialRecipes: string[];
  grandmaRemedies: { title: string; remedy: string; ailment: string }[];
}

export interface HusbandTask {
  id: string;
  title: string;
  category: 'vitamins' | 'appointment' | 'essentials' | 'hospital_bag';
  dueDate: string;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface MedicalDoc {
  id: string;
  title: string;
  date: string;
  type: 'ultrasound' | 'prescription' | 'blood_report' | 'vaccination';
  doctorName: string;
  fileSize: string;
}

export interface BabyName {
  id: string;
  name: string;
  meaning: string;
  gender: 'girl' | 'boy' | 'unisex';
  origin: string;
  rashi?: string;
  nakshatra?: string;
  isFavorite: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'virtual_mom' | 'ai_psychiatrist' | 'partner';
  text: string;
  timestamp: string;
  audioUrl?: string;
}
