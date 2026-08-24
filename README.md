# Mathreya - Maternal & Women's Healthcare Sanctuary

Mathreya is a mobile-first healthcare platform designed for women across all key life stages. It combines modern UI practices with traditional Indian wellness concepts to provide private, empathetic, and accessible healthcare guidance.

---

## Technologies Used

### Frontend Architecture
- **React 18 & TypeScript**: Core component logic, type safety, and reactive state management.
- **Vite**: Next-generation frontend build tooling and local development server.
- **Tailwind CSS**: Custom styling tokens for layout, responsive typography, and theme palettes (Rosewood, Honey Amber, Chanderi Cream).
- **Motion (framer-motion)**: Smooth screen transitions, pill tab animations, and drawer interactions.
- **Lucide React**: Vector icons for touch controls, health metrics, and navigation.

### Web APIs & Audio Synthesis
- **Web Speech API (`SpeechSynthesis`)**: Real-time voice playback for Virtual Mother AI and interactive audio guidance.
- **Web Audio API & Vibration API**: Haptic feedback triggers (`triggerHapticFeedback`) for interactive touch elements.

### Backend & API Layer
- **Node.js & Express (`server.ts`)**: Server wrapper handling backend AI requests.
- **Google Gemini API**: AI-assisted response generation for healthcare chatbots and advice engines.

---

## Core System Modules

### 1. Authentication Engine
- Full-bleed edge-to-edge layout inspired by modern financial and healthcare applications.
- Supports Password authentication and Mobile OTP verification.
- Integrated guest exploration mode.

### 2. Home Dashboard & Mood Engine
- Dynamic mood tracker that adjusts maternal guidance based on user input.
- Real-time text-to-speech engine for comforting voice prompts.
- Grid navigation for all major healthcare life stages.

### 3. Puberty & Adolescent Care
- Interactive 28-day cycle log and symptom tracker.
- AES-256 encrypted confidential journal (Safe Space).
- Curated audio, video, and article media library.
- Monitored community forum and 1-on-1 sister mentorship matching.

### 4. Pregnancy Care Hub (Prenatal & Postnatal)
- Weekly fetal development tracking and health checklists.
- Postnatal recovery guidelines and infant care protocols.

### 5. Virtual Mother AI (Amma)
- Simulated video and audio interaction shell.
- Built-in traditional avatar gallery for users without uploaded media.
- Touch-reactive maternal interaction gestures.

### 6. Partner (Husband) Care Hub
- Hospital bag checklist with traditional Ayurvedic care items.
- Paternal mental health guidance and doctor consultation sync.
- Sanskrit baby name generator.

### 7. Menopause & Hormonal Sanctuary
- Phase 2 preview system outlining upcoming Ayurvedic wellness protocols.

---

## Local Development & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation Steps

1. Clone or navigate to the project directory:
   ```bash
   cd e:/mathreya
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your web browser.

5. Build for production:
   ```bash
   npm run build
   ```

---

## Project Status

The platform interface is fully responsive across mobile devices (iOS, Android), tablets, and desktop displays. All layout components follow a structured, non-congested design system.
