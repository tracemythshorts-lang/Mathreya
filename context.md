# Mathreya — Full Project Context and Implementation Blueprint

> **Purpose of this file**
>
> This is the single source of context for AI coding agents working on the Mathreya codebase. It describes the current codebase extracted from the uploaded project ZIP, the existing product behavior, the data that is currently local/mock, and the target backend architecture to be implemented.
>
> AI agents should read this file before making architectural changes. Do not ask the user to repeatedly provide the project background.
>
> **Current implementation status:** frontend-heavy prototype with a small Express + Gemini API backend. Persistent authentication, Appwrite database integration, file storage, production API architecture, and deployment pipeline are not yet implemented.

---

# 1. Project Identity

## Product

**Name:** Mathreya

**Tagline:** The Care That Feels Like Home

**Type:** Mobile-first women's healthcare and wellness platform.

## Product philosophy

Mathreya should feel:

- warm
- private
- empathetic
- culturally familiar
- medically responsible
- mobile-first
- easy to understand
- maintainable as a real product

The current visual language is strongly influenced by Indian family warmth and maternal care:

- rosewood
- brown
- terracotta
- cream
- warm amber accents
- rounded cards
- soft borders and shadows
- serif headings
- smooth Motion animations
- culturally familiar terms such as Amma, Beti and Kanna

## Main user journeys currently represented

1. Authentication / entry
2. Main dashboard
3. Puberty and menstrual support
4. Pregnancy and postnatal support
5. Virtual Mother / Virtual Amma AI
6. Partner / Husband care dashboard
7. Profile and emergency information
8. Medical vault
9. Community and educational media
10. Baby name exploration
11. AI-assisted conversations

---

# 2. Current Repository Snapshot

The uploaded ZIP contains the root project directory:

```text
mathreya/
```

Important top-level files and folders:

```text
mathreya/
├── .env
├── .env.example
├── .gitignore
├── README.md
├── context.md                     # Existing older project context; replace with this updated version
├── taskinstruction.md             # Existing AI-agent instructions
├── package.json
├── package-lock.json
├── server.ts
├── vite.config.ts
├── tsconfig.json
├── index.html
├── metadata.json
├── public/
│   ├── manifest.json
│   └── assets/
│       ├── amma.png
│       ├── logo.png
│       ├── partner.png
│       ├── pregnancy.png
│       └── puberty.png
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── data.ts
│   ├── types.ts
│   ├── index.css
│   ├── components/
│   │   ├── DailyInspirationalQuote.tsx
│   │   ├── DashboardView.tsx
│   │   ├── FlutterCodeModal.tsx
│   │   ├── HusbandDashboardView.tsx
│   │   ├── LoginView.tsx
│   │   ├── Navbar.tsx
│   │   ├── PregnancyView.tsx
│   │   ├── ProfileView.tsx
│   │   ├── PubertyView.tsx
│   │   └── VirtualMomView.tsx
│   └── utils/
│       ├── flutterCodeGenerator.ts
│       └── haptics.ts
├── flutter_project/
│   ├── pubspec.yaml
│   └── lib/
│       ├── main.dart
│       ├── models/app_models.dart
│       └── screens/
│           ├── dashboard_screen.dart
│           ├── husband_screen.dart
│           ├── login_screen.dart
│           ├── pregnancy_screen.dart
│           ├── profile_screen.dart
│           ├── puberty_screen.dart
│           └── virtual_mother_screen.dart
└── dist/                          # Existing production build output
```

## Important repository fact

The ZIP already contains a `.git` directory and an existing Git remote. Before changing GitHub structure, inspect the existing remote and commit history instead of blindly running `git init`.

The current Git history indicates that an earlier Supabase authentication integration was removed. The project is now intended to start fresh with Appwrite.

---

# 3. Current Technology Stack

## Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Motion (`motion/react`)
- Lucide React

## Backend currently present

- Node.js
- Express
- TypeScript
- one Express server file: `server.ts`

## AI currently present

- `@google/genai`
- Gemini API
- one endpoint:
  - `POST /api/ai/chat`

## Browser APIs currently used

- Web Speech API / `speechSynthesis`
- Vibration API through `src/utils/haptics.ts`

## PWA / application metadata

The project includes:

- `public/manifest.json`
- `metadata.json`

The application requests camera and microphone-related capabilities through project metadata.

## Separate Flutter code

The repository also contains a `flutter_project/`.

This is a separate Flutter representation/reference of Mathreya and is not the active website runtime.

Do not modify Flutter code when implementing React-only backend integration unless the task explicitly asks for Flutter changes.

---

# 4. Current NPM Scripts

The current package configuration contains:

```text
npm run dev
```

which starts:

```text
tsx server.ts
```

The current Express server also runs Vite middleware during development.

Production build currently performs:

```text
vite build
```

and bundles:

```text
server.ts
```

into:

```text
dist/server.cjs
```

The current production start command runs:

```text
node dist/server.cjs
```

Current scripts conceptually are:

```text
dev    → Express server + Vite middleware
build  → Vite frontend build + bundle Express server
start  → run bundled production Express server
lint   → TypeScript type check
clean  → remove build output
```

This architecture is functional for local development, but the future production architecture should be separated into clear frontend/API responsibilities.

---

# 5. Current Runtime Architecture

## Current architecture

```text
React Components
      |
      | local state / hardcoded data
      v
React UI

Some AI interactions:
React Components
      |
      | POST /api/ai/chat
      v
Express server.ts
      |
      v
Gemini API
```

## Current problems

Most application data is:

- hardcoded
- initialized from `src/data.ts`
- stored only in React `useState`
- lost on refresh
- not linked to authenticated users
- not protected by backend authorization
- not reusable across devices

The project currently has no persistent backend data architecture.

---

# 6. Target Architecture

The target architecture for the professional version should be:

```text
React Frontend
      |
      | HTTP/HTTPS requests
      | /api/v1/...
      v
Backend API Layer
      |
      | authentication
      | authorization
      | validation
      | business logic
      | healthcare/privacy checks
      v
Appwrite Services
      |
      ├── Auth
      ├── Database
      ├── Storage
      └── optional Functions / Messaging later
```

## Core architectural rule

React components should not contain Appwrite Server API keys.

React components should not directly perform privileged database operations.

The preferred application flow is:

```text
Component
    ↓
Frontend API Service
    ↓
Backend Endpoint
    ↓
Middleware
    ↓
Controller
    ↓
Business Service
    ↓
Appwrite
    ↓
Backend Response
    ↓
Frontend State
    ↓
UI
```

## Example

```text
ProfileView
    ↓
userApi.getMe()
    ↓
GET /api/v1/users/me
    ↓
Authentication middleware
    ↓
User controller
    ↓
User service
    ↓
Appwrite Auth + user profile database
    ↓
JSON response
    ↓
React state updates
```

---

# 7. Target Platform Stack

The intended infrastructure stack is:

```text
GitHub
   |
   | source control + CI workflow
   v
Vercel
   |
   ├── React frontend deployment
   └── API/serverless deployment strategy
           |
           v
       Appwrite Cloud
           |
           ├── Authentication
           ├── Database
           └── Storage
```

## Appwrite usage planned

### Use Appwrite Auth for

- account creation
- email/password login
- sessions
- logout
- password recovery
- email verification
- authenticated identity

Do not create a custom database table to store passwords.

### Use Appwrite Database for

- application profile data
- healthcare tracking data
- journals
- community data
- partner tasks
- conversations
- document metadata
- content metadata
- preferences
- reminders

### Use Appwrite Storage for

- profile images
- medical documents
- audio files
- voice samples
- future uploaded media

### Use Appwrite Functions only when genuinely needed

Potential future uses:

- scheduled reminders
- event-driven workflows
- background processing
- asynchronous cleanup
- notification workflows

Do not create Functions merely to duplicate ordinary CRUD endpoints.

### Use Appwrite Messaging later if needed

Potential future uses:

- email reminders
- SMS
- push notifications

It is not required for the first backend integration phase.

---

# 8. Security Rule: API Keys

Appwrite API keys are server-side secrets.

They must:

- stay in backend/server environment variables
- never be committed to GitHub
- never be included in Vite client bundles
- never be exposed through React code
- use the minimum scopes required

The frontend may know public configuration such as an Appwrite endpoint/project identifier only when the architecture explicitly requires it. Server secrets must remain server-only.

---

# 9. Existing Main Application State

`src/App.tsx` currently owns:

```text
currentScreen
isFlutterModalOpen
user
```

The user is currently a hardcoded demo profile:

```text
Ananya Sharma
ananya.sharma@example.com
+91 98765 43210
age 26
pregnancy prenatal stage
pregnancy week 24
face authentication enabled
emergency contact
Bengaluru location
```

This is demo data and must eventually be replaced by real authenticated user data.

## Current login state is fake

The app currently sets:

```text
isAuthenticated: true
```

inside frontend state.

There is no persistent login/session verification.

The future architecture must load authenticated identity on application startup.

---

# 10. Existing Screen Routing Model

Current `AppScreen` values are:

```text
login
dashboard
puberty
pregnancy_prenatal
pregnancy_postnatal
virtual_mother
husband_dashboard
profile
```

Routing is currently implemented manually through React state, not React Router.

`App.tsx` switches components based on `currentScreen`.

The primary swipe navigation currently includes:

```text
dashboard
puberty
pregnancy_prenatal
virtual_mother
husband_dashboard
```

## Important migration rule

Do not unnecessarily rewrite routing while implementing backend integration.

Backend integration should first preserve the current screen behavior.

A future router migration can be handled separately if needed.

---

# 11. Existing Data Models

`src/types.ts` defines the main frontend domain models.

## UserProfile

Currently includes:

```text
name
email
phone
age
stage
avatarUrl
faceAuthEnabled
isAuthenticated
pregnancyWeek
babyNameChoice
emergencyContactName
emergencyContactPhone
location
```

### Target backend treatment

Split into:

- Appwrite Auth identity
- `user_profiles`
- `user_settings`
- `emergency_contacts`
- life-stage-specific records

Do not keep all long-term application data in one giant profile object.

---

## PeriodLog

Current fields:

```text
date
flowLevel
symptoms
mood
notes
```

### Target storage

```text
period_logs
```

---

## JournalEntry

Current fields:

```text
id
title
content
date
category
mood
isEncrypted
```

Categories:

```text
puberty
prenatal
postnatal
general
```

### Target storage

```text
journal_entries
```

Journal entries are sensitive and should be user-scoped.

---

## MediaItem

Current fields:

```text
id
title
description
category
stage
duration
readTime
thumbnailUrl
authorUrl
tags
url
```

### Target storage

```text
media_content
```

Actual media files may later live in Appwrite Storage while metadata lives in the database.

---

## CommunityPost

Current fields:

```text
id
authorName
authorAvatar
ageGroup
title
content
likes
commentsCount
date
isModerated
stage
```

### Target storage

Split conceptually into:

```text
community_posts
community_comments
community_reactions
```

The backend should derive author identity from authentication instead of trusting arbitrary frontend identity fields.

---

## VirtualMomConfig

Current fields:

```text
name
avatarImage
voiceVaultSample
voiceName
personalityTraits
memories
specialRecipes
grandmaRemedies
```

### Target storage

Potential separation:

```text
virtual_mother_profiles
virtual_mother_memories
virtual_mother_recipes
virtual_mother_remedies
```

Voice samples and custom images belong in Storage.

Metadata belongs in the Database.

---

## HusbandTask

Current fields:

```text
id
title
category
dueDate
isCompleted
priority
```

### Target storage

```text
partner_tasks
```

---

## MedicalDoc

Current fields:

```text
id
title
date
type
doctorName
fileSize
```

### Target storage model

Actual file:

```text
Appwrite Storage
```

Metadata:

```text
medical_documents
```

The database record should reference the storage file ID.

---

## BabyName

Current fields:

```text
id
name
meaning
gender
origin
rashi
nakshatra
isFavorite
```

### Target storage

Global catalog:

```text
baby_names
```

User-specific favorites:

```text
user_baby_name_favorites
```

Do not store `isFavorite` globally because the favorite state is user-specific.

---

## ChatMessage

Current fields:

```text
id
sender
text
timestamp
audioUrl
```

### Target storage

```text
conversations
chat_messages
```

Audio files, if persisted, belong in Storage.

---

# 12. Existing Mock Data File

`src/data.ts` currently contains hardcoded initial/demo data.

Exported constants include:

```text
INITIAL_JOURNALS
INITIAL_MEDIA
INITIAL_COMMUNITY_POSTS
DEFAULT_VIRTUAL_MOM
INITIAL_HUSBAND_TASKS
INITIAL_MEDICAL_DOCS
INITIAL_BABY_NAMES
```

## Migration rule

Do not delete all mock data immediately.

Use mock data as temporary UI fallback during migration only when explicitly required.

The final professional application should fetch persistent or managed data through APIs.

---

# 13. Component-by-Component Current Behavior

## 13.1 LoginView.tsx

Current functionality:

- login tab
- register tab
- name input
- email/mobile input
- password input
- life-stage selection
- guest exploration mode
- fake frontend success flow

Current issue:

The component does not perform real authentication.

### Target

Replace fake submission with:

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

Potential future endpoints:

```text
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
POST /api/v1/auth/verify-email
```

The exact session strategy must be implemented consistently across local and Vercel deployment.

---

## 13.2 App.tsx

Current responsibilities:

- manual screen routing
- fake user state
- login success handling
- logout handling
- swipe navigation
- global Virtual Amma floating action button
- Flutter code modal state

### Target

App startup should:

1. check authenticated session
2. fetch current user/profile
3. show loading state while checking
4. route unauthenticated users to login
5. load authenticated user into global application state

The current hardcoded demo user must be removed after real APIs exist.

---

## 13.3 DashboardView.tsx

Current functionality:

- greeting/dashboard
- mood selection
- inspirational interaction
- speech synthesis
- life-stage cards
- navigation to modules

Current cards include:

```text
Puberty
Pregnancy
Menopause
Partner Care
Virtual Mom
```

## Important existing Menopause state

The menopause card currently exists as a placeholder:

```text
Coming Soon
```

It currently reuses puberty artwork.

Menopause is not yet represented in the current `AppScreen` or `LifeStage` union.

Do not silently treat the existing menopause card as a complete module.

A future menopause implementation should add:

- a real route/screen
- proper type definitions
- dedicated component
- database/API design if persistence is needed
- removal of the Coming Soon behavior

---

## 13.4 PubertyView.tsx

Current local state includes:

- active subtab
- cycle day
- flow
- symptoms
- water glasses
- journals
- journal form
- AI chat input/messages/loading
- mentorship role
- mentor match state
- media filter

Main module concepts include:

```text
overview
period_tracker
safe_space
ai_assistant
media
community
socials
mentorship
```

Current AI requests use:

```text
POST /api/ai/chat
persona: puberty_assistant
```

### Backend migration targets

Persistent user data:

```text
period_logs
journal_entries
```

Potential managed/shared data:

```text
media_content
community_posts
community_comments
community_reactions
mentorship_profiles
mentorship_matches
```

Temporary UI state such as active tab and filter should remain frontend state.

---

## 13.5 PregnancyView.tsx

Current local state includes:

- prenatal/postnatal mode
- active subtab
- water tracking
- routine/checklist items
- journals
- consultation selection
- booking success state
- AI psychiatrist messages
- AI loading state
- media filter

Current module concepts include:

```text
overview
routines
safe_space
ai_psychiatrist
media
consultation
socials
community
```

Current doctor/consultation cards are demo UI.

Current AI requests use:

```text
POST /api/ai/chat
persona: ai_psychiatrist
```

### Backend migration targets

```text
pregnancy_profiles
pregnancy_logs
health_routines
routine_completions
journal_entries
consultations
media_content
community_posts
conversations
chat_messages
```

Do not claim that a real appointment is booked unless a real provider/booking integration exists.

---

## 13.6 VirtualMomView.tsx

Current functionality includes:

- live interaction UI
- video/audio call shell
- mute state
- call duration
- AI chat
- captions
- touch feedback
- custom mother name
- nickname
- avatar selection
- voice sample upload UI state
- dialect selection
- user memories
- memory input
- Web Speech synthesis

Current tabs:

```text
live_interaction
persona_creation
memory_layer
```

Current AI requests use:

```text
POST /api/ai/chat
persona: virtual_mom
```

### Backend migration targets

```text
virtual_mother_profiles
virtual_mother_memories
conversations
chat_messages
```

Storage:

```text
virtual mother avatar uploads
voice samples
future recorded interactions if implemented
```

Do not persist files merely because a frontend checkbox or local upload state exists. Real upload endpoints must be implemented.

---

## 13.7 HusbandDashboardView.tsx

Current tabs include:

```text
consultation
chat
media
medical_vault
name_generator
sim
emergency
```

Current local state includes:

- partner tasks
- new task text
- partner chat messages
- media filter
- baby names
- search/filter
- SOS UI state

### Backend migration targets

```text
partner_relationships
partner_tasks
consultations
medical_documents
baby_names
user_baby_name_favorites
conversations
chat_messages
emergency_contacts
```

The Medical Vault must use:

```text
Storage for files
Database for file metadata
```

---

## 13.8 ProfileView.tsx

Current local/editable fields include:

```text
name
email
phone
location
face authentication preference
emergency contact name
emergency contact phone
```

Current save behavior only updates React state.

### Target endpoints

```text
GET   /api/v1/users/me
PATCH /api/v1/users/me

GET   /api/v1/users/me/settings
PATCH /api/v1/users/me/settings

GET   /api/v1/emergency/contacts
POST  /api/v1/emergency/contacts
PATCH /api/v1/emergency/contacts/:id
DELETE /api/v1/emergency/contacts/:id
```

---

## 13.9 Navbar.tsx

Current functionality includes:

- navigation drawer
- current user display
- navigation
- silent emergency UI state

The Navbar currently receives:

```text
currentScreen
onNavigate
user
onLogout
```

Future authentication state should continue to supply user information through a consistent frontend state layer.

---

## 13.10 DailyInspirationalQuote.tsx

Current behavior:

- stage-based inspirational quotes
- local quote rotation
- stage-specific themes

This can remain frontend/static initially.

A database is not required unless administrators must manage quotes dynamically.

---

## 13.11 FlutterCodeModal.tsx

Current behavior:

- displays generated Flutter source code
- copy-to-clipboard state

Related utility:

```text
src/utils/flutterCodeGenerator.ts
```

This is a development/reference feature and is not core healthcare data.

Do not move this to the database unless there is a future product requirement to persist generated artifacts.

---

# 14. Existing Backend

`server.ts` currently:

1. loads environment variables
2. creates Express application
3. parses JSON
4. lazily initializes Gemini client
5. exposes:
   - `GET /api/health`
   - `POST /api/ai/chat`
6. serves Vite middleware in development
7. serves `dist/` in production

## Existing AI personas

```text
virtual_mom
ai_psychiatrist
puberty_assistant
```

## Current AI limitations

The endpoint currently trusts the frontend-provided persona and prompt.

Future production backend should add:

- authentication where appropriate
- input validation
- allowed persona validation
- rate limiting
- consistent error response shape
- healthcare safety boundaries
- conversation persistence only when explicitly enabled

---

# 15. Current Data/API Reality

At the time this context was generated, the current frontend contains only three actual API interactions.

All three call:

```text
POST /api/ai/chat
```

They are used by:

```text
PubertyView.tsx
PregnancyView.tsx
VirtualMomView.tsx
```

There are no current real CRUD APIs for:

- authentication
- user profiles
- period logs
- pregnancy profiles
- journals
- media
- community
- medical documents
- partner tasks
- baby name favorites
- emergency contacts

These must be implemented.

---

# 16. Target API Naming Convention

Use versioned REST endpoints:

```text
/api/v1/...
```

Suggested domain structure:

```text
/api/v1/auth
/api/v1/users
/api/v1/puberty
/api/v1/periods
/api/v1/pregnancy
/api/v1/journals
/api/v1/community
/api/v1/media
/api/v1/medical-documents
/api/v1/partner
/api/v1/baby-names
/api/v1/virtual-mother
/api/v1/conversations
/api/v1/consultations
/api/v1/emergency
/api/v1/notifications
/api/v1/ai
```

Keep the existing `/api/ai/chat` working during migration if needed, then migrate deliberately rather than breaking all AI features at once.

---

# 17. Target Appwrite Data Model

This is the planned architecture, not yet implemented.

## Identity

### Appwrite Auth

Use for:

```text
account identity
email/password
sessions
authentication
```

### `user_profiles`

Suggested fields:

```text
userId
fullName
phone
dateOfBirth
avatarFileId
primaryLifeStage
profileCompleted
createdAt
updatedAt
```

### `user_settings`

Suggested fields:

```text
userId
faceAuthEnabled
notificationsEnabled
language
accessibilitySettings
privacySettings
```

---

## Puberty and menstrual health

### `period_logs`

Suggested fields:

```text
userId
logDate
flowLevel
symptoms
mood
notes
cycleDay
createdAt
updatedAt
```

---

## Pregnancy

### `pregnancy_profiles`

Suggested fields:

```text
userId
pregnancyStartDate
estimatedDueDate
currentWeek
trimester
pregnancyStatus
createdAt
updatedAt
```

### `pregnancy_logs`

Suggested fields:

```text
userId
logDate
pregnancyWeek
symptoms
mood
weight
bloodPressure
notes
createdAt
updatedAt
```

Only collect health fields that the actual product needs.

---

## Postnatal

### `postnatal_profiles`

Suggested fields:

```text
userId
deliveryDate
deliveryType
recoveryStage
babyAgeInDays
notes
```

---

## Journals

### `journal_entries`

Suggested fields:

```text
userId
title
content
entryDate
category
mood
isEncrypted
createdAt
updatedAt
```

---

## Community

### `community_posts`

Suggested fields:

```text
authorUserId
title
content
stage
moderationStatus
visibility
createdAt
updatedAt
```

### `community_comments`

Suggested fields:

```text
postId
authorUserId
content
moderationStatus
createdAt
updatedAt
```

### `community_reactions`

Suggested fields:

```text
postId
userId
reactionType
createdAt
```

---

## Media

### `media_content`

Suggested fields:

```text
title
description
contentType
stage
duration
readTime
thumbnailFileId
mediaFileId
externalUrl
authorName
status
publishedAt
tags
```

This is primarily managed/admin content rather than user-owned data.

---

## Medical vault

### Storage bucket

Store actual:

```text
PDF files
images
reports
prescriptions
ultrasounds
vaccination documents
```

### `medical_documents`

Store metadata:

```text
userId
storageFileId
title
documentType
doctorName
documentDate
fileName
mimeType
fileSize
uploadedAt
```

---

## Partner

### `partner_relationships`

Suggested fields:

```text
primaryUserId
partnerUserId
relationshipStatus
invitationToken
createdAt
```

### `partner_tasks`

Suggested fields:

```text
ownerUserId
assignedToUserId
title
category
dueDate
isCompleted
priority
createdAt
updatedAt
```

---

## Baby names

### `baby_names`

Global catalog:

```text
name
meaning
gender
origin
rashi
nakshatra
status
```

### `user_baby_name_favorites`

User-specific state:

```text
userId
babyNameId
createdAt
```

---

## Virtual Mother

### `virtual_mother_profiles`

```text
userId
displayName
avatarFileId
voicePreference
personalityTraits
createdAt
updatedAt
```

### `virtual_mother_memories`

```text
userId
virtualMotherId
memoryText
category
importance
createdAt
```

### `virtual_mother_recipes`

```text
virtualMotherId
title
description
ingredients
instructions
safetyNotes
```

### `virtual_mother_remedies`

```text
virtualMotherId
title
ailment
remedy
safetyStatus
medicalDisclaimer
reviewStatus
```

Healthcare advice and traditional remedies require explicit safety framing.

---

## Conversations

### `conversations`

```text
userId
conversationType
title
lastMessageAt
createdAt
updatedAt
```

### `chat_messages`

```text
conversationId
sender
content
audioFileId
createdAt
```

---

## Consultations

### `consultations`

```text
userId
providerId
consultationType
scheduledAt
status
notes
meetingReference
createdAt
updatedAt
```

### `consultation_reminders`

```text
userId
consultationId
reminderTime
status
isSent
```

Do not implement these as real appointments unless a real provider integration exists.

---

## Emergency

### `emergency_contacts`

```text
userId
name
relationship
phone
isPrimary
createdAt
updatedAt
```

---

## Notifications

### `notifications`

```text
userId
type
title
message
data
isRead
createdAt
```

---

# 18. Data Ownership Rules

## Store in the database when data is

- user-specific
- persistent
- needed across devices
- created by users
- shared with another authorized user
- required for history
- needed for reporting or analytics
- managed by administrators
- required after refresh

## Keep in frontend state when data is

- modal open/close state
- active tab
- hover state
- animation state
- temporary form typing before submit
- temporary loading state
- temporary filters/search terms

Examples that should normally remain local:

```text
isFlutterModalOpen
isDrawerOpen
isAiLoading
activeTab
mediaFilter
showSuccessMessage
```

---

# 19. Target Backend Folder Architecture

The existing one-file backend should eventually evolve toward a maintainable structure.

Recommended target:

```text
mathreya/
├── src/                           # React frontend
│   ├── api/
│   │   ├── client.ts
│   │   ├── authApi.ts
│   │   ├── userApi.ts
│   │   ├── periodApi.ts
│   │   ├── pregnancyApi.ts
│   │   ├── journalApi.ts
│   │   ├── communityApi.ts
│   │   ├── medicalApi.ts
│   │   └── ...
│   ├── components/
│   ├── hooks/
│   ├── types/
│   └── ...
│
├── server/ OR api/                # Exact deployment layout decided during Vercel setup
│   ├── config/
│   │   └── appwrite.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── error.middleware.ts
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── validators/
│   └── utils/
│
├── shared/
│   └── types/                     # Optional shared contracts later
│
├── public/
├── flutter_project/
├── context.md
└── taskinstruction.md
```

Do not create this entire structure in one unnecessary refactor. Introduce it in phases.

---

# 20. Recommended Frontend API Layer

Components should not scatter raw `fetch()` calls everywhere.

Create a central API client and domain services.

Example concept:

```text
src/api/client.ts
src/api/authApi.ts
src/api/userApi.ts
src/api/pregnancyApi.ts
src/api/journalApi.ts
```

Components should use:

```text
userApi.getMe()
journalApi.list()
pregnancyApi.getProfile()
```

instead of directly constructing URLs repeatedly.

Benefits:

- consistent error handling
- consistent headers
- easier maintenance
- easier testing
- easier endpoint migration
- centralized auth/session behavior

---

# 21. Standard API Response Shape

Prefer a consistent response structure.

Successful example:

```json
{
  "success": true,
  "data": {},
  "message": "Optional human-readable message"
}
```

Failure example:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Readable error message"
  }
}
```

Avoid returning unrelated response formats from every endpoint.

---

# 22. Backend Request Flow

Every protected request should conceptually follow:

```text
HTTP Request
    ↓
Route
    ↓
Authentication Middleware
    ↓
Validation Middleware
    ↓
Controller
    ↓
Service / Business Logic
    ↓
Appwrite
    ↓
Normalized Response
```

Example:

```text
PATCH /api/v1/users/me
    ↓
verify authenticated user
    ↓
validate body
    ↓
load current profile
    ↓
update allowed fields
    ↓
write to Appwrite
    ↓
return updated profile
```

---

# 23. Authentication Workflow Target

## Registration

```text
Frontend Register Form
    ↓
POST /api/v1/auth/register
    ↓
validate input
    ↓
create Appwrite Auth account
    ↓
create user_profiles record
    ↓
create user_settings record
    ↓
create session / return auth result
    ↓
Frontend loads current user
```

## Login

```text
Frontend Login Form
    ↓
POST /api/v1/auth/login
    ↓
Appwrite session/authentication
    ↓
return authenticated result
    ↓
GET /api/v1/users/me
    ↓
load profile
```

## Logout

```text
Frontend
    ↓
POST /api/v1/auth/logout
    ↓
destroy/invalidate session
    ↓
clear frontend user state
    ↓
show login screen
```

The exact session transport must be implemented consistently for local development and Vercel.

---

# 24. Medical Document Workflow

```text
Medical Vault UI
    ↓
Select file
    ↓
POST /api/v1/medical-documents
    ↓
validate authenticated user
    ↓
validate file type/size
    ↓
upload file to Appwrite Storage
    ↓
receive storageFileId
    ↓
create metadata record in medical_documents
    ↓
return document metadata
    ↓
refresh UI
```

Deletion should conceptually:

```text
request document deletion
    ↓
verify ownership
    ↓
delete database metadata
    ↓
delete or safely manage storage object
    ↓
return success
```

Ownership and permissions must be checked server-side.

---

# 25. AI Workflow Target

Current AI flow is:

```text
Component
    ↓
POST /api/ai/chat
    ↓
Gemini
```

Target flow should become:

```text
Component
    ↓
AI API service
    ↓
POST /api/v1/ai/chat
    ↓
authenticate if required
    ↓
validate allowed persona
    ↓
apply system instruction
    ↓
optional authorized user context
    ↓
Gemini
    ↓
optional conversation persistence
    ↓
safe response
```

AI personas currently represented:

```text
virtual_mom
ai_psychiatrist
puberty_assistant
```

Future personas may be added only through explicit backend validation.

For healthcare content:

- do not diagnose
- do not prescribe
- do not claim emergency capability
- do not present traditional remedies as replacements for professional medical care
- direct concerning symptoms to qualified care

---

# 26. Storage Bucket Planning

Do not create a bucket for every tiny category.

Initial recommended bucket strategy:

## `user-assets`

For:

```text
profile avatars
non-medical personal images
Virtual Mother avatar customization
```

## `medical-documents`

For:

```text
reports
prescriptions
ultrasounds
vaccination documents
```

This bucket requires stricter ownership/security.

## `voice-assets`

For:

```text
voice samples
future custom Virtual Mother audio assets
```

Do not make sensitive buckets public.

---

# 27. Current Environment Variables

Current project uses:

```text
GEMINI_API_KEY
APP_URL
```

The existing `.env.example` is based on the earlier AI Studio environment.

Future Appwrite/server configuration will require additional environment variables.

Expected server-side concepts:

```text
APPWRITE_ENDPOINT
APPWRITE_PROJECT_ID
APPWRITE_API_KEY
APPWRITE_DATABASE_ID
APPWRITE_USER_ASSETS_BUCKET_ID
APPWRITE_MEDICAL_DOCUMENTS_BUCKET_ID
APPWRITE_VOICE_ASSETS_BUCKET_ID
GEMINI_API_KEY
```

Do not hardcode IDs or secrets inside React components.

Do not commit real `.env` files.

Keep `.env.example` safe and placeholder-only.

---

# 28. Current Styling Rules

The existing design system should be preserved during backend work.

Characteristics:

- warm cream page background
- terracotta / rosewood primary actions
- rounded 2xl/3xl cards
- thin warm borders
- compact mobile-first spacing
- serif branding/headings
- Lucide icons
- Motion transitions
- responsive Tailwind classes

Backend integration should not trigger a visual redesign.

---

# 29. Accessibility and Responsiveness

All backend-connected UI must preserve:

- mobile usability
- desktop responsiveness
- loading states
- disabled submit states
- readable errors
- accessible form labels
- safe empty states

Do not replace working UI with raw debug output.

---

# 30. Existing Assets

Current public assets include:

```text
public/assets/amma.png
public/assets/logo.png
public/assets/partner.png
public/assets/pregnancy.png
public/assets/puberty.png
```

The menopause dashboard currently does not have a dedicated asset.

Do not accidentally remove these assets during refactoring.

---

# 31. Flutter Project Rule

The repository contains a Flutter project, but the requested backend integration work is for the website unless explicitly stated otherwise.

Rules:

- do not break the Flutter folder
- do not refactor Flutter while implementing React APIs
- do not assume React backend work automatically updates Flutter
- keep Flutter integration as a separate future task

---

# 32. Existing Task Instructions

The project already contains `taskinstruction.md`.

This updated context should take precedence for the new Appwrite/backend architecture where the older context says:

```text
No need to introduce a new backend/database architecture unless a task explicitly requires it
```

That older statement is now obsolete because backend/database integration is the explicit project goal.

---

# 33. Implementation Phases

Do not connect everything at once.

## Phase 0 — Safety and repository baseline

Before backend coding:

1. verify local project runs
2. run type checking
3. inspect current Git status
4. ensure `.env` is ignored
5. preserve a clean backup/commit point
6. remove obsolete integration remnants only after verification

---

## Phase 1 — Appwrite foundation

Set up:

1. Appwrite project cleanup/recreation
2. Appwrite Web platform
3. Appwrite Auth
4. Appwrite API key for server-side use
5. first Database
6. initial Storage buckets
7. environment variables

Do not create every database collection yet.

---

## Phase 2 — Backend foundation

Implement:

```text
/api/v1/health
/api/v1/auth/*
/api/v1/users/me
```

Add:

- Appwrite server configuration
- auth middleware
- validation
- centralized errors
- consistent response format

---

## Phase 3 — Authentication and profile

Convert:

```text
LoginView
App.tsx
Navbar
ProfileView
```

from mock state to real API-backed state.

This is the first major milestone.

---

## Phase 4 — Core user healthcare data

Implement:

```text
period_logs
pregnancy_profiles
pregnancy_logs
journal_entries
emergency_contacts
user_settings
```

Connect:

```text
PubertyView
PregnancyView
ProfileView
```

---

## Phase 5 — Medical Vault and Storage

Create:

- medical document bucket
- upload endpoint
- metadata collection
- list endpoint
- secure delete flow

Connect:

```text
HusbandDashboardView → Medical Vault
```

---

## Phase 6 — Partner data

Implement:

```text
partner_relationships
partner_tasks
```

Then connect partner dashboard functionality.

---

## Phase 7 — Managed content and community

Implement:

```text
media_content
community_posts
community_comments
community_reactions
```

Do not expose private health logs as public community content.

---

## Phase 8 — AI persistence and Virtual Mother

First preserve the existing AI endpoint.

Then, if required:

```text
virtual_mother_profiles
virtual_mother_memories
conversations
chat_messages
voice asset storage
```

---

## Phase 9 — Deployment

Deploy only after:

- environment variables are correct
- API endpoints work locally
- frontend production build passes
- authentication flow is tested
- secrets are not exposed

Target sequence:

```text
Local Development
      ↓
Git commit
      ↓
GitHub push
      ↓
Vercel deployment
      ↓
Production environment variables
      ↓
Appwrite production platform configuration
      ↓
Production smoke tests
```

---

# 34. Local-to-Production Workflow

The full intended development workflow is:

```text
Developer Local Machine
      |
      | edit code
      v
Run local application
      |
      | test frontend + API
      v
Git status
      |
      | commit clean changes
      v
GitHub
      |
      | CI checks / deployment trigger
      v
Vercel
      |
      | production frontend/API
      v
Appwrite Cloud
```

## Important sequence

Do not:

1. create every Appwrite resource
2. create every API endpoint
3. connect every UI component

in one large untested step.

Instead:

```text
one domain
    ↓
database/storage design
    ↓
backend endpoint
    ↓
frontend API service
    ↓
component integration
    ↓
local test
    ↓
commit
```

Repeat domain by domain.

---

# 35. GitHub Workflow

The repository already contains Git history.

Before starting:

```text
git status
git remote -v
git branch
```

Recommended branch strategy initially:

```text
main
```

for stable production-ready code, with feature branches when changes become substantial:

```text
feature/appwrite-foundation
feature/auth-integration
feature/user-profile-api
feature/medical-vault
```

Avoid committing:

```text
.env
.env.local
API keys
service secrets
real medical documents
node_modules
dist
```

The existing `.gitignore` already ignores `.env*` while allowing `.env.example`.

---

# 36. Testing Expectations

At minimum after meaningful backend changes:

```text
npm run lint
npm run build
```

Also manually test:

- application startup
- register
- login
- refresh while authenticated
- logout
- profile fetch/update
- unauthorized request handling
- invalid request validation
- storage upload where implemented

Add automated tests later when the backend structure is stable.

---

# 37. Migration Rules for AI Coding Agents

When working on this project:

1. Read this file first.
2. Identify the exact feature/domain being changed.
3. Inspect the relevant existing component and type definitions.
4. Reuse the existing UI.
5. Add backend/API code without rewriting unrelated modules.
6. Keep TypeScript type-safe.
7. Avoid `any` as a permanent workaround.
8. Keep API contracts explicit.
9. Keep secrets server-side.
10. Preserve working features.
11. Add loading/error/empty states when replacing local data with remote data.
12. Run checks when practical.

Do not:

- rewrite the entire project for one feature
- remove existing UI unnecessarily
- expose API keys
- trust user ownership from a frontend field
- use mock success messages for real operations
- claim a medical action or appointment happened when it did not
- store passwords in a custom database table
- store binary medical files directly inside normal database records

---

# 38. Current Known Gaps

The following are not yet real backend features:

- persistent authentication
- session restoration
- Appwrite integration
- persistent user profiles
- period data persistence
- pregnancy data persistence
- journal persistence
- community CRUD
- media management
- medical file upload
- partner relationship management
- partner task persistence
- baby name favorites persistence
- conversation persistence
- Virtual Mother memory persistence
- production deployment pipeline

The current UI should be treated as a rich frontend prototype awaiting backend integration.

---

# 39. Immediate Next Task

The next implementation sequence should be:

## Step 1

Create a clean Appwrite foundation from scratch.

Use only the resources needed for the first milestone.

Initial goal:

```text
Auth
+
user_profiles
+
user_settings
+
emergency_contacts
+
backend API foundation
```

## Step 2

Connect real:

```text
Register
Login
Get current user
Logout
Profile update
```

## Step 3

Only after authentication/profile works:

connect healthcare modules one domain at a time.

---

# 40. Definition of the First Real Milestone

The first professional backend milestone is complete when:

```text
A new user can register
        ↓
An Appwrite Auth account is created
        ↓
A user profile is created
        ↓
The user logs in
        ↓
The application loads the authenticated user
        ↓
The dashboard uses real profile data
        ↓
The profile can be updated
        ↓
Refresh preserves authenticated state according to the chosen session design
        ↓
Logout works
```

No other large module should block this milestone.

---

# 41. Final Architecture Summary

```text
                         GITHUB
                            |
                     source control
                            |
                            v
                         VERCEL
                -----------------------
                |                     |
                v                     v
        React Frontend         Backend API Layer
                |                     |
                |        /api/v1/...  |
                +----------+----------+
                           |
                           v
                        APPWRITE
          -----------------------------------
          |                |                |
          v                v                v
         AUTH           DATABASE          STORAGE
          |                |                |
     identity/session   application      files/documents
                        user data

                           |
                           v
                       GEMINI AI
                   server-side only
```

---

# 42. Golden Rule

The frontend is responsible for:

```text
display
interaction
temporary UI state
calling APIs
```

The backend is responsible for:

```text
authentication
authorization
validation
business logic
AI safety handling
database access
storage access
secret handling
```

Appwrite is responsible for the backend platform services:

```text
Auth
Database
Storage
optional Functions
optional Messaging
```

This separation should guide every new implementation decision.
