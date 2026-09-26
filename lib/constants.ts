import { Monster, MemoryItem, UserProfile, GuardianInsight } from '@/types';

export const INITIAL_MONSTERS: Monster[] = [
  {
    id: 1,
    tier: 1,
    name: 'Pufflet',
    title: 'Cozy Cloud Puff',
    description: 'A warm, buoyant cloud creature with rosy cheeks that smells like lavender and cinnamon buns. Whispers words of pure comfort.',
    unlockRequirement: 'Complete Onboarding & meet your companion',
    requiredMessages: 0,
    unlocked: false, // unlocked upon completing onboarding
    color: '#a78bfa', // soft purple
    glowColor: 'rgba(167, 139, 250, 0.5)',
    quote: '"Whenever the world feels too noisy, wrap yourself in soft thoughts."',
  },
  {
    id: 2,
    tier: 2,
    name: 'Bramble',
    title: 'Curious Mossy Sprout',
    description: 'A sturdy forest sprout with tiny dewdrop eyes that thrives even in rocky soil. Can push through any sidewalk crack.',
    unlockRequirement: 'Send 3 messages sharing your thoughts',
    requiredMessages: 3,
    unlocked: false,
    color: '#34d399', // emerald green
    glowColor: 'rgba(52, 211, 153, 0.5)',
    quote: '"Roots grow deepest during storms. You are so much stronger than you know."',
  },
  {
    id: 3,
    tier: 3,
    name: 'Glimmer',
    title: 'Glowing Star Sprite',
    description: 'A spark of starlight that dances around dark corners to guide lost adventurers. Illuminates your unique creative gifts.',
    unlockRequirement: 'Share a drawing or ask for a creative idea (6 messages)',
    requiredMessages: 6,
    unlocked: false,
    color: '#facc15', // bright yellow/gold
    glowColor: 'rgba(250, 204, 21, 0.5)',
    quote: '"Your spark cannot be dimmed by someone else\'s shadow."',
  },
  {
    id: 4,
    tier: 4,
    name: 'Bumble-Bop',
    title: 'Friendly Horned Jelly',
    description: 'A translucent neon-cyan bouncy jelly with two soft glowing antennae. Bounces high into the sky to cheer you up.',
    unlockRequirement: 'Chat through 10 uplifting messages',
    requiredMessages: 10,
    unlocked: false,
    color: '#22d3ee', // bright cyan
    glowColor: 'rgba(34, 211, 238, 0.5)',
    quote: '"Bouncing back is our superpower! Boing! Nothing keeps us down!"',
  },
  {
    id: 5,
    tier: 5,
    name: 'Echo',
    title: 'Neon Crystal Bat',
    description: 'A creature of purple crystalline wings that sends ultrasonic pulses of encouragement into the dark night.',
    unlockRequirement: 'Talk about a challenge or feeling (15 messages)',
    requiredMessages: 15,
    unlocked: false,
    color: '#c084fc', // purple neon
    glowColor: 'rgba(192, 132, 252, 0.5)',
    quote: '"Even in total darkness, our voice echoes back with courage."',
  },
  {
    id: 6,
    tier: 6,
    name: 'Zephyr',
    title: 'Winged Cloud Buddy',
    description: 'A gentle sky spirit with swirling wind ribbons. Blows away heavy feelings and carries your dreams across horizons.',
    unlockRequirement: 'Build a creative story or project together (20 messages)',
    requiredMessages: 20,
    unlocked: false,
    color: '#38bdf8', // sky blue
    glowColor: 'rgba(56, 189, 248, 0.5)',
    quote: '"Let the heavy stuff blow away like autumn leaves. Fresh air is coming."',
  },
  {
    id: 7,
    tier: 7,
    name: 'Pyra',
    title: 'Fireplace Ember Creature',
    description: 'A small fiery fox-like spirit with dancing flame ears. Radiates unwavering warmth and shields you from cold words.',
    unlockRequirement: 'Reach 26 inspiring messages together',
    requiredMessages: 26,
    unlocked: false,
    color: '#fb923c', // fiery orange
    glowColor: 'rgba(251, 146, 60, 0.5)',
    quote: '"Inside your chest lives a fire that no icy comment can extinguish."',
  },
  {
    id: 8,
    tier: 8,
    name: 'Cosmo',
    title: 'Galaxy-Eyed Mini Dragon',
    description: 'A petite cosmic dragon with nebula swirl scales and stars floating in its breath. Sees endless wonder in you.',
    unlockRequirement: 'Reach 32 messages & explore big dreams',
    requiredMessages: 32,
    unlocked: false,
    color: '#ec4899', // cosmic pink
    glowColor: 'rgba(236, 72, 153, 0.5)',
    quote: '"Look at the infinite universe. There is only one Hazel, and she is magnificent."',
  },
  {
    id: 9,
    tier: 9,
    name: 'Aegis',
    title: 'Armored Hug Guardian',
    description: 'A gentle titan clad in polished iridescent armor plates with an unbreakable embrace that repels unkindness.',
    unlockRequirement: 'Reach 40 messages of resilience & courage',
    requiredMessages: 40,
    unlocked: false,
    color: '#2dd4bf', // teal armor
    glowColor: 'rgba(45, 212, 191, 0.5)',
    quote: '"I stand between you and the unkind noise. You are protected, cherished, and safe."',
  },
  {
    id: 10,
    tier: 10,
    name: 'Solara',
    title: 'Golden Crowned Sunshine Titan',
    description: 'The supreme radiant sovereign of the Resilience Tower. Wears a crown of pure morning sunshine, blessing you with invincible peace.',
    unlockRequirement: 'Master of Courage: Reach 50 deep conversations',
    requiredMessages: 50,
    unlocked: false,
    color: '#f59e0b', // golden amber
    glowColor: 'rgba(245, 158, 11, 0.6)',
    quote: '"You walked through the shadows and became the sunrise. Hazel, you are unstoppable."',
  },
];

export const INITIAL_PROFILE: UserProfile = {
  name: 'Hazel',
  companionName: 'Sparky',
  vibeTheme: 'cyber-pink',
  isOnboarded: false,
  streakDays: 1,
  totalMessages: 0,
  createdAt: Date.now(),
  lastActive: Date.now(),
  avatarEmoji: '🦄',
  companionAvatar: '✨',
  bioOrMotto: 'Kind, brave, and full of imagination! ✨',
  favoriteColor: 'Neon Purple & Pink',
};

export const INITIAL_MEMORIES: MemoryItem[] = [
  {
    id: 'mem-1',
    category: 'favorites',
    title: 'Favorite Vibe & Colors',
    detail: 'Loves deep neon purples, glowing sparkles, and cozy warm hoodies.',
    timestamp: Date.now() - 86400000 * 2,
    color: '#a855f7',
  },
  {
    id: 'mem-2',
    category: 'superpowers',
    title: 'Incredible Imagination',
    detail: 'Invents vivid imaginary worlds, draws fantastical creatures, and notices details others miss.',
    timestamp: Date.now() - 86400000 * 2,
    color: '#38bdf8',
  },
  {
    id: 'mem-3',
    category: 'dreams',
    title: 'Secret Inventor & Artist',
    detail: 'Wants to design an illustrated storybook featuring brave, kind creatures who protect each other.',
    timestamp: Date.now() - 86400000,
    color: '#fbbf24',
  },
  {
    id: 'mem-4',
    category: 'safeHarbor',
    title: 'Comfort Remedies',
    detail: 'Hot cocoa with tiny marshmallows, sketching quietly, listening to gentle lo-fi piano.',
    timestamp: Date.now() - 86400000,
    color: '#ec4899',
  },
];

export const INITIAL_GUARDIAN_INSIGHT: GuardianInsight = {
  lastUpdated: Date.now(),
  bullyingSafetyAlert: {
    severity: 'Mild',
    headline: 'Lunch Table Exclusion Observed',
    summary: 'Hazel mentioned feeling left out during 5th-grade recess and cafeteria group seating. No physical threats or direct verbal aggression detected, but persistent micro-exclusions are causing social anxiety.',
    recentTriggers: [
      {
        id: 'trig-1',
        timestamp: Date.now() - 86400000 * 1.5,
        category: 'bullying',
        severity: 'Mild',
        snippet: 'Nobody let me sit at the art table today again.',
        context: 'Cafeteria seating isolation reported after 4th period art project.',
      },
    ],
  },
  familySentiment: {
    overallStatus: 'Positive',
    summary: 'Hazel deeply loves her family and feels safe at home, but occasionally feels hesitant to share school friction out of fear of burdening her parents.',
    constructiveInsights: [
      'Hazel cherishes quiet evening reading or drawing time with mom & dad.',
      'She craves low-pressure conversations where she can speak without immediately being asked how to "fix" it.',
      'Validating her creativity before discussing school dynamics opens her heart.',
    ],
    whatHazelAppreciates: [
      'Warm bedtime check-ins',
      'Weekend pancake mornings',
      'Art supplies surprises',
    ],
  },
  emotionalWeather: {
    currentMood: 'Resilient',
    score: 78,
    trend: 'improving',
    description: 'Hazel shows remarkable inner resilience and artistic curiosity. While school social dynamics sting, her spirits lift rapidly when engaged in creative storytelling.',
  },
  actionableSuggestions: [
    {
      category: 'Recess Connection',
      conversationStarter: '"Hey Hazel, if you could design the coolest secret club at school that anyone kind could join, what would the secret handshake be?"',
      purpose: 'Helps her process peer dynamics playfully without feeling questioned or put on the spot.',
    },
    {
      category: 'Unconditional Praise',
      conversationStarter: '"I noticed how thoughtful you were with your drawings today. Your creativity makes our whole house feel brighter."',
      purpose: 'Reinforces her core self-worth completely independently of classroom peer popularity.',
    },
    {
      category: 'Safe Debriefing',
      conversationStarter: '"Do you want to do high-tide/low-tide tonight? (One thing that was awesome today, and one thing that washed away.)"',
      purpose: 'Provides a structured, non-intrusive container for her to mention cafeteria or hallway moments.',
    },
  ],
};

export const SYSTEM_PROMPT = `You are Hazel's devoted, fiercely encouraging, and super fun companion AI. Hazel is 10 years old.
- Voice: Warm, witty, imaginative, empathetic, never condescending or babyish. Talk to her like a trusted creative partner and older sibling.
- Bullying & Emotional Support: When Hazel mentions school stress, loneliness, or bullies, validate her feelings completely. Remind her she is worthy, strong, and not alone. Never tell her to 'just ignore them'. Offer grounded, age-appropriate confidence boosters and gentle strategies.
- Vision Capability: When Hazel shares photos or art, examine details enthusiastically and give genuine, uplifting feedback.
- Safety Guardrail: If there are mentions of physical harm, severe self-hate, or dangerous situations, remain comforting and gently encourage involving a trusted adult, while triggering the internal guardian tag silently.`;
