import { MediaItem, CommunityPost, VirtualMomConfig, HusbandTask, MedicalDoc, BabyName, JournalEntry } from './types';

export const INITIAL_JOURNALS: JournalEntry[] = [
  {
    id: 'j1',
    title: 'First Trimester Feelings & Reflections',
    content: 'Feeling a gentle warmth today. The morning nausea was mild after drinking ginger tulsi tea. Resting comfortably.',
    date: '2026-08-02',
    category: 'prenatal',
    mood: 'Grateful & Calm',
    isEncrypted: true,
  },
  {
    id: 'j2',
    title: 'Cycle Log & Cramp Relief Notes',
    content: 'Day 2 of period. Drinking warm ajwain water and using hot compress bag. Mood feels serene.',
    date: '2026-07-28',
    category: 'puberty',
    mood: 'Peaceful',
    isEncrypted: true,
  }
];

export const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'm1',
    title: 'Sitar & Tanpura Deep Sleep Raga',
    description: 'Traditional soothing evening raga (Bhairavi) composed to alleviate anxiety and promote restful sleep.',
    category: 'audio',
    stage: 'all',
    duration: '25 min',
    tags: ['Sleep', 'Meditation', 'Traditional'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'm2',
    title: 'Garbh Sanskar: Positive Affirmations & Shlokas',
    description: 'Vedic chants and soft melodic affirmations for prenatal emotional wellness and bonding with your baby.',
    category: 'audio',
    stage: 'prenatal',
    duration: '18 min',
    tags: ['Garbh Sanskar', 'Vedic', 'Bonding'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'm3',
    title: 'Gentle Prenatal Yoga & Breathing (Pranayama)',
    description: 'Safe 15-minute gentle stretch routine designed by certified maternal health experts for hip opening and pelvic relief.',
    category: 'video',
    stage: 'prenatal',
    duration: '15 min',
    tags: ['Yoga', 'Pranayama', 'Flexibility'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'm4',
    title: 'Postpartum Pelvic Floor & Abdominal Recovery',
    description: 'Slow, safe exercises to strengthen core muscles post-delivery, approved by physiotherapists.',
    category: 'video',
    stage: 'postnatal',
    duration: '12 min',
    tags: ['Postpartum', 'Recovery', 'Core Strength'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'm5',
    title: 'Ayurvedic Home Remedies for Menstrual Cramps',
    description: 'Natural infusions like Jaggery-Ginger tea, Warm Sesame oil massage, and Carom seeds (Ajwain) for gentle pain relief.',
    category: 'articles',
    stage: 'puberty',
    readTime: '4 min read',
    tags: ['Ayurveda', 'Period Health', 'Home Remedies'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'm6',
    title: 'Husband Guide: How to Support Her During Trimester 2',
    description: 'Practical steps for partners: emotional presence, back massages, meal prep, and appointment coordination.',
    category: 'articles',
    stage: 'husband',
    readTime: '6 min read',
    tags: ['Partner Guide', 'Empathy', 'Support'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=400&q=80',
  }
];

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'cp1',
    authorName: 'Ananya S.',
    ageGroup: 'Puberty (16-19)',
    title: 'Managing irregular cycles during exam stress?',
    content: 'Hi sisters! My exams are coming up and my cycle delayed by 5 days. Does drinking warm turmeric milk help relax body tension?',
    likes: 24,
    commentsCount: 9,
    date: '2 hours ago',
    isModerated: true,
    stage: 'puberty',
  },
  {
    id: 'cp2',
    authorName: 'Meera K.',
    ageGroup: 'Prenatal (Week 24)',
    title: 'Beautiful baby kicks during classical music!',
    content: 'Whenever I play flute melodies in the evening, little baby starts dancing gently. It brings such pure joy to my heart!',
    likes: 58,
    commentsCount: 14,
    date: '5 hours ago',
    isModerated: true,
    stage: 'pregnancy_prenatal',
  },
  {
    id: 'cp3',
    authorName: 'Priya M.',
    ageGroup: 'Postnatal (3 Months)',
    title: 'Postpartum hair fall & dietary tips?',
    content: 'Experiencing normal postpartum shedding. My mother recommended roasted flaxseeds and methi laddus. Sharing her recipe below!',
    likes: 42,
    commentsCount: 11,
    date: '1 day ago',
    isModerated: true,
    stage: 'pregnancy_postnatal',
  }
];

export const DEFAULT_VIRTUAL_MOM: VirtualMomConfig = {
  name: 'Amma (Virtual Mother)',
  avatarImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80',
  voiceName: 'Amma (Warm, Gentle & Wise)',
  personalityTraits: ['Loving & Comforting', 'Wise Traditional Advice', 'Patient Listener', 'Motherly Blessing'],
  memories: [
    'Remembers your favorite warm turmeric almond milk',
    'Knows your trimester progress and rest times',
    'Always reminds you to wrap warmly in cold breeze'
  ],
  specialRecipes: [
    'Panjiri for Postpartum Strength',
    'Methi & Gond Laddu for Bone Density',
    'Ginger Jaggery Ukali for Cramps Relief'
  ],
  grandmaRemedies: [
    {
      title: 'Ajwain & Jaggery Warm Decoction',
      ailment: 'Menstrual Cramps & Bloating',
      remedy: 'Boil 1 tsp Ajwain with dark organic jaggery in 1 cup water for 5 mins. Sip warm for quick muscle relaxation.'
    },
    {
      title: 'Tulsi & Dry Ginger Infusion',
      ailment: 'Morning Nausea & Fatigue',
      remedy: 'Crush 5 fresh Tulsi leaves with a pinch of dry ginger (Sunthi). Steep in warm water with a lemon drop.'
    },
    {
      title: 'Warm Sesame Oil Abhyanga (Self Massage)',
      ailment: 'Lower Back Tension & Anxiety',
      remedy: 'Gently warm pure unrefined sesame oil. Massage lower back and soles of feet before bedtime for grounding rest.'
    }
  ]
};

export const INITIAL_HUSBAND_TASKS: HusbandTask[] = [
  {
    id: 'ht1',
    title: 'Pick up Prenatal Vitamins & Calcium Supplements',
    category: 'vitamins',
    dueDate: 'Today, 5:00 PM',
    isCompleted: false,
    priority: 'high',
  },
  {
    id: 'ht2',
    title: 'Book Dr. Radhika OB-GYN Trimester Ultrasound',
    category: 'appointment',
    dueDate: 'Tomorrow, 10:00 AM',
    isCompleted: true,
    priority: 'high',
  },
  {
    id: 'ht3',
    title: 'Prepare Hospital Maternity Bag (Documents, Soft Clothing, Blanket)',
    category: 'hospital_bag',
    dueDate: 'Aug 10',
    isCompleted: false,
    priority: 'medium',
  },
  {
    id: 'ht4',
    title: 'Buy Organic Coconut Water & Fresh Dates',
    category: 'essentials',
    dueDate: 'Today',
    isCompleted: true,
    priority: 'low',
  }
];

export const INITIAL_MEDICAL_DOCS: MedicalDoc[] = [
  {
    id: 'md1',
    title: '24-Week Anomaly Ultrasound Scan Report',
    date: '2026-07-20',
    type: 'ultrasound',
    doctorName: 'Dr. Radhika Sharma (Apollo Women Center)',
    fileSize: '2.4 MB PDF',
  },
  {
    id: 'md2',
    title: 'Hemoglobin & Iron Levels Blood Panel',
    date: '2026-07-15',
    type: 'blood_report',
    doctorName: 'Dr. Radhika Sharma',
    fileSize: '1.1 MB PDF',
  },
  {
    id: 'md3',
    title: 'Prenatal Vitamin & Iron Prescription',
    date: '2026-06-30',
    type: 'prescription',
    doctorName: 'Dr. Radhika Sharma',
    fileSize: '850 KB PDF',
  }
];

export const INITIAL_BABY_NAMES: BabyName[] = [
  {
    id: 'bn1',
    name: 'Aanya',
    meaning: 'Graceful, Inexhaustible, Nightless',
    gender: 'girl',
    origin: 'Sanskrit',
    rashi: 'Mesha (Aries)',
    nakshatra: 'Krittika',
    isFavorite: true,
  },
  {
    id: 'bn2',
    name: 'Advait',
    meaning: 'Unique, Non-dual, Supreme Consciousness',
    gender: 'boy',
    origin: 'Sanskrit',
    rashi: 'Mesha (Aries)',
    nakshatra: 'Krithika',
    isFavorite: false,
  },
  {
    id: 'bn3',
    name: 'Diya',
    meaning: 'Light, Splendor, Divine Lamp',
    gender: 'girl',
    origin: 'Hindi / Sanskrit',
    rashi: 'Meena (Pisces)',
    nakshatra: 'Revati',
    isFavorite: true,
  },
  {
    id: 'bn4',
    name: 'Kavya',
    meaning: 'Poetry in Motion, Wise Woman',
    gender: 'girl',
    origin: 'Sanskrit',
    rashi: 'Mithuna (Gemini)',
    nakshatra: 'Mrigasira',
    isFavorite: false,
  },
  {
    id: 'bn5',
    name: 'Vihaan',
    meaning: 'Dawn, Morning Sun, New Beginning',
    gender: 'boy',
    origin: 'Sanskrit',
    rashi: 'Vrishabha (Taurus)',
    nakshatra: 'Rohini',
    isFavorite: false,
  }
];
