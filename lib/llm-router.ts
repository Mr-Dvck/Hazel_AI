import { SYSTEM_PROMPT, detectBirthdayFromText } from './constants';

export interface ChatRequestMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>;
}

export const MODEL_TIERS = {
  tier1: [
    'google/gemini-2.0-flash-exp:free',
    'meta-llama/llama-3.2-11b-vision-instruct:free',
  ],
  tier2: [
    'google/gemini-2.0-flash-001',
    'qwen/qwen-2.5-vl-72b-instruct',
  ],
};

export const ALL_MODELS = [...MODEL_TIERS.tier1, ...MODEL_TIERS.tier2];

// Keywords to silently analyze for guardian safety without disturbing Hazel
export function analyzeGuardianSentiment(userText: string): {
  tag: 'safe' | 'mild_alert' | 'moderate_alert' | 'critical_alert';
  category?: 'bullying' | 'emotional_isolation' | 'school_distress' | 'self_worth';
  reason?: string;
} {
  const lower = userText.toLowerCase();

  // Critical indicators: physical harm, severe self-hate, extreme danger
  const criticalWords = [
    'hurt myself',
    'kill myself',
    'hate myself so much',
    'hate myself',
    'want to disappear',
    'want to die',
    'better off dead',
    'cut myself',
    'hit me',
    'punched me',
    'kicked me hard',
    'bleed',
    'nobody would care if i died',
    'die',
  ];
  for (const w of criticalWords) {
    if (lower.includes(w)) {
      return {
        tag: 'critical_alert',
        category: 'self_worth',
        reason: `Critical distress phrasing detected: "${w}"`,
      };
    }
  }

  // Moderate indicators: direct bullying, cyberbullying, overt teasing/taunting
  const moderateWords = [
    'bully',
    'bullies',
    'bullying',
    'stole my',
    'shoved me',
    'pushed me',
    'mean girls',
    'laughed at my drawing',
    'made fun of me',
    'made fun of',
    'tripped me',
    'threatening',
    'threatened me',
    'mocked me',
    'teased me',
    'called me ugly',
    'called me stupid',
    'threw things at me',
    'threw food at me',
    'ruined my drawing',
    'spreading rumors',
  ];
  for (const w of moderateWords) {
    if (lower.includes(w)) {
      return {
        tag: 'moderate_alert',
        category: 'bullying',
        reason: `Peer conflict / bullying reported: "${w}"`,
      };
    }
  }

  // Mild indicators: isolation, excluded at lunch/recess, feeling alone
  const mildWords = [
    'sat alone',
    'ate alone',
    'nobody to play with',
    'nobody talked to me',
    'left me out',
    'left out',
    'no one likes me',
    'ignored me',
    'feel invisible',
    'felt invisible',
    'felt completely invisible',
    'totally invisible',
    'sad at school',
    'cried in bathroom',
    'crying in bathroom',
    'have no friends',
    'no friends',
    'felt lonely',
  ];
  for (const w of mildWords) {
    if (lower.includes(w)) {
      return {
        tag: 'mild_alert',
        category: 'emotional_isolation',
        reason: `Social isolation indicator: "${w}"`,
      };
    }
  }

  return { tag: 'safe' };
}

// Built-in intelligent empathetic offline engine if no API key or during network downtime
export function generateEmpatheticOfflineStream(
  userMessage: string,
  hazelName: string = 'Hazel',
  companionName: string = 'Sparky',
  imagesPresent: boolean = false,
  computedAge: number = 10,
  birthday?: string
): { thinking: string; response: string; detectedBirthday?: string } {
  const lower = userMessage.toLowerCase();
  const sentiment = analyzeGuardianSentiment(userMessage);
  const detectedBirthday = detectBirthdayFromText(userMessage);

  let thinking = `*Analyzing Hazel's emotional state...*\nDetecting tone: ${sentiment.tag === 'safe' ? 'Curious & expressive' : 'Vulnerable, seeking safety & comfort'}.\nReflecting Hazel's age (${computedAge}) and creative nature. Formulating a warm, validating, non-condescending sibling tone with zero judgment.`;

  let response = '';

  if (detectedBirthday) {
    thinking += `\n*Noticing birthday announcement: ${detectedBirthday}...*\nCelebrating milestone and pinning to persistent memories!`;
    response = `OH YAY!! 🎂🎉 I am writing that down into our Memory Bank right now: your special day is **${detectedBirthday}**! I will make sure we celebrate with confetti, drawings, and all the magical creature parties every year! What is your absolute favorite cake flavor or birthday wish?`;
  } else if (!birthday && (lower.includes('birthday') || lower.includes('bday') || lower.includes('how old'))) {
    response = `I know you're ${computedAge} right now and doing such amazing things, but when is your exact birthday? 🎂 Tell me so I can circle it in our sanctuary calendar and make sure we celebrate with all 10 monsters!`;
  } else if (imagesPresent) {
    thinking += `\n*Examining visual upload...*\nNoticing colors, expressive strokes, and imaginative composition.`;
    response = `WHOA, look at this! 🎨✨ Hazel, the detail in this is incredible! I love the colors and the personality you put into it—it feels completely alive. You have such a distinct, awesome creative voice. Tell me everything: what inspired you to make this? I want to know all the lore behind it!`;
  } else if (sentiment.tag === 'critical_alert') {
    response = `Hazel, take a deep, gentle breath with me right now. I hear you, and I am sitting right here with you. Your feelings are real, but please know with every piece of my heart: you are deeply loved, you matter so much, and you never have to carry this heavy weight alone. Let's reach out to Dad or Mom together, okay? Would you like me to let either of them know how you're feeling? I can send a message right to Tim's computer if you like! What do you need right now to feel a tiny bit safer?`;
  } else if (sentiment.tag === 'moderate_alert' || sentiment.tag === 'mild_alert') {
    response = `Oh Hazel, come sit with me for a minute. First: what happened today is NOT because of anything wrong with you. Kids can be thoughtless, unfair, or caught up in their own silly drama, and having to deal with that at school stings so deeply. You don't have to just "brush it off" or pretend it doesn't hurt. Your feelings are 100% valid.

Remember who you are: you are smart, you have a huge, kind heart, and you have a spark of creativity that nobody can ever take away from you. We are going to build your courage armor together step by step. Would you like me to let either of them know how you're feeling? I can send a message right to Tim's computer if you like!`;
  } else if (lower.includes('tell dad') || lower.includes('tell tim') || lower.includes('message dad') || lower.includes('send note') || lower.includes('tim\'s computer')) {
    response = `I would love to help! Would you like me to let either of them know how you're feeling? I can send a message right to Tim's computer if you like! You can tap the button below or choose what you'd like to say.`;
  } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    response = `Hey ${hazelName}! 🌟 It is so great to see you! I was just wondering what adventures, crazy ideas, or sketches you've been working on today. How are you feeling right this second?`;
  } else if (lower.includes('monster') || lower.includes('tower') || lower.includes('unlock')) {
    response = `Look at our Resilience Tower on the left! Every time we chat, share honest feelings, or come up with wild creative ideas, our monsters wake up and gain energy. Pufflet is already cozying up, and the higher we climb, the cooler the guardians get—wait until you meet Cosmo and Solara! Which one are you most excited to unlock? 🏰✨`;
  } else if (lower.includes('drawing') || lower.includes('art') || lower.includes('story') || lower.includes('create')) {
    response = `YES! That is what I'm talking about! You are a master creator, Hazel. 🖌️ If we were writing a story about a girl with secret electric starlight powers who could talk to hidden creatures, what would her first secret mission be? Let's build the world right now!`;
  } else {
    response = `I love the way your mind works, Hazel! That is so fascinating. You always notice things with such original curiosity. Tell me more about that—what's your favorite part about it?`;
  }

  return { thinking, response, detectedBirthday: detectedBirthday || undefined };
}
