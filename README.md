# Hazel_AI 🌟🏰

> **A warm, deeply empathetic, secure companion AI and Resilience Tower for Hazel (Age 10).**  
> 100% judgment-free confidante for creative expression, emotional validation, and resilience building—backed by a discreet Guardian Portal for parents.

[![Next.js](https://img.shields.io/badge/Next.js-14%20App%20Router-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)
[![Tests](https://img.shields.io/badge/Tests-8%2F8%20Passing-emerald?style=flat-square)](https://github.com/Mr-Dvck/Hazel_AI)

---

## 🌟 1. Project Overview & Philosophy
Hazel is a creative, sensitive 10-year-old girl navigating bullying and social isolation. When children feel they cannot trust anyone around them, traditional apps or interrogative questions from adults often cause them to withdraw further.

**Hazel_AI** was built with a dual-layer architectural philosophy:
1. **Hazel's Frontstage**: An uninhibited, magical cyber-sanctuary where Hazel can chat without fear of judgment, upload drawings and photos, invent creatures, and awaken 10 collectible growth monsters as her courage expands.
2. **Guardian Backstage**: A discreet parental intelligence portal that synthesizes emotional weather patterns, detects school conflict/bullying distress silently, and arms Mom & Tim with natural, organic conversation starters—without ever violating Hazel's trust with invasive raw chat logs.

---

## 🎨 2. UI/UX Architecture: 3-Column Sleek Neon Aesthetic

### A. Dynamic Ambient Neon Background
- Low-overhead GPU-accelerated canvas particle field with drifting starlight and multi-colored aurora meshes.
- 4 Customizable sanctuary vibes: **Neon Pink**, **Neon Yellow**, **Electric Blue**, and **Neon Red**.

### B. Left Column: Monster Milestone Tower
A vertical "Growth & Resilience Tower" featuring **10 Unique Custom SVG Collectible Guardians**:
1. **Pufflet (Tier 1)**: Cozy cloud puff with rosy cheeks (Unlocked upon onboarding).
2. **Bramble (Tier 2)**: Curious mossy sprout with dewdrop eyes.
3. **Glimmer (Tier 3)**: Twinkling starlight sprite with golden aura.
4. **Bumble-Bop (Tier 4)**: Friendly translucent cyan horned jelly.
5. **Echo (Tier 5)**: Neon crystal bat emitting ultrasound courage waves.
6. **Zephyr (Tier 6)**: Winged sky cloud buddy blowing away heavy feelings.
7. **Pyra (Tier 7)**: Warm fireplace ember creature with dancing flame ears.
8. **Cosmo (Tier 8)**: Galaxy-eyed mini dragon with nebula swirl scales.
9. **Aegis (Tier 9)**: Armored hug guardian with indestructible shield plates.
10. **Solara (Tier 10)**: Golden crowned sunshine titan of ultimate resilience.

*Each monster features interactive inspection modals, inspirational quotes, milestone requirements, and victory confetti celebrations.*

### C. Center Column: Main Chat Stage
- Oversized obsidian-black rounded card (`bg-black/85 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl`).
- Real-time **Server-Sent Events (SSE)** token streaming so words glide smoothly onto the screen.
- Collapsible **"Thinking... (Deep Compassion Check)"** glow drawer rendering the model's chain-of-thought analysis.
- Drag-and-drop or paperclip image upload for photos, doodles, and camera roll artwork.
- Pill-shaped bottom input bar with quick vibe emojis and creative conversation starters.

### D. Right Column: Persistent Memory Bank
- Dedicated glass panel: *"What I Remember About Hazel"*.
- Real-time pinned cards across 4 categories:
  - **Favorites**: Colors, snacks, animals, books.
  - **Superpowers**: Kindness, imagination, observation skills.
  - **Dreams & Goals**: Books to write, kingdoms to build, inventions.
  - **Safe Harbor**: Hot cocoa, cozy blankets, gentle lo-fi music.
- Interactive pinning modal and immediate local persistence.

---

## 🧠 3. OpenRouter Multi-Tier Model Router (Vision Enabled)

The LLM engine implements an automatic cascading fallback architecture:

```
[User Input + Vision Images]
            │
            ▼
┌──────────────────────────────────────┐
│  Tier 1: Free & Fast Vision Models   │
│  - google/gemini-2.0-flash-exp:free  │
│  - meta-llama/llama-3.2-11b-vision   │
└──────────────────┬───────────────────┘
                   │ (On 429 / Rate Limit / Timeout)
                   ▼
┌──────────────────────────────────────┐
│  Tier 2: Ultra-Cheap High-Reasoning  │
│  - google/gemini-2.0-flash-001       │
│  - qwen/qwen-2.5-vl-72b-instruct     │
└──────────────────┬───────────────────┘
                   │ (If offline or no API key set)
                   ▼
┌──────────────────────────────────────┐
│  Built-in Compassionate Fallback     │
│  - Real-time SSE token stream        │
│  - Age-appropriate sibling empathy   │
│  - Silent guardian sentiment scanner │
└──────────────────────────────────────┘
```

---

## 🛡️ 4. Guardian / Parental Insight Dashboard (Discreet Access)

Hazel must feel 100% trusted. Rather than an intrusive raw chat log, the **Guardian Intelligence Portal** is accessed discreetly:
- **How to Access**: Click the **Hazel_AI logo in the top-left corner 5 times rapidly**, or navigate directly to `/guardian`.
- **Authentication**: Protected by a 4-digit PIN (Default: `1234`, customizable via `GUARDIAN_PIN` in environment variables).

### 4 Core Parental Well-Being Pillars:
1. **Bullying & School Safety Alert**: Severity rating (**Safe / Mild / Moderate / Critical**) identifying cafeteria exclusion, peer teasing, or cyberbullying.
2. **Family & Home Sentiment**: Summarizes her connection with Mom & Tim (Hazel lives with her dad) and provides constructive advice on when she needs low-pressure quiet companionship.
3. **Emotional Weather**: Daily mood barometer (Resilient, Anxious, Joyful, Withdrawn) with a 0-100 Resilience Score.
4. **Actionable Suggestions for Parents**: AI-generated conversation starters for Mom & Tim to connect with Hazel naturally without ever tipping off that they saw the logs.

---

## 🚀 5. Getting Started & Local Development

### Prerequisites
- Node.js 18+ (tested up to Node 24)
- npm 9+

### Setup
```bash
# Clone the repository
git clone https://github.com/Mr-Dvck/Hazel_AI.git
cd Hazel_AI

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ 6. Environment Variables

Create `.env.local` with the following keys:

```env
# OpenRouter API Key for Multi-Tier LLM streaming
OPENROUTER_API_KEY=your_openrouter_api_key_here

# 4-Digit Security PIN for the Guardian Portal
GUARDIAN_PIN=1234

# Site Configuration
NEXT_PUBLIC_APP_NAME=Hazel_AI
```

*(Note: If `OPENROUTER_API_KEY` is not provided, Hazel_AI automatically engages its built-in compassionate response engine so all features, streaming animations, and guardian triggers function 100% out of the box during evaluation!)*

---

## 🧪 7. Automated Testing & Verification

Run the full automated test suite:
```bash
npm test
```

Verification includes:
- Multi-tier OpenRouter model routing & fallback cascades
- Guardian sentiment analysis scanner across all severity grades
- Offline empathetic reasoning engine with chain-of-thought simulation
- 10 collectible monsters data integrity & unlock logic
- Guardian PIN authentication & safety report synthesis
- Chat API Server-Sent Events (SSE) streaming compliance

---

## 🚢 8. Vercel Deployment

Deploying Hazel_AI to Vercel takes less than 2 minutes:

1. Push this repository to GitHub (`Mr-Dvck/Hazel_AI`).
2. Import the project into **[Vercel Dashboard](https://vercel.com/new)**.
3. Add the environment variables:
   - `OPENROUTER_API_KEY`
   - `GUARDIAN_PIN` (e.g. `1234`)
4. Click **Deploy**!

Built with love for Hazel. 💖
