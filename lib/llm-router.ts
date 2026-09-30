import { SYSTEM_PROMPT, detectBirthdayFromText } from './constants';
import { MonsterStyle } from '@/types';

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
    'sad',
    'i was sad',
    'i am sad',
    'im sad',
    'feeling sad',
    'feel sad',
    'so sad',
    'really sad',
    'super sad',
    'unhappy',
    'crying',
    'cried',
    'depressed',
    'heartbroken',
    'feeling down',
    'felt down',
    'bad day',
    'rough day',
    'hard day',
    'upset',
  ];
  for (const w of mildWords) {
    if (lower.includes(w)) {
      return {
        tag: 'mild_alert',
        category: 'emotional_isolation',
        reason: `Emotional distress or isolation expressed: "${w}"`,
      };
    }
  }

  // Regex check for standalone words
  if (/\b(sad|sadness|unhappy|crying|cried|depressed|heartbroken|upset)\b/i.test(lower)) {
    return {
      tag: 'mild_alert',
      category: 'emotional_isolation',
      reason: `Emotional distress or sadness detected in message`,
    };
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
  birthday?: string,
  monsterStyle: MonsterStyle = 'cute'
): { thinking: string; response: string; detectedBirthday?: string } {
  const lower = userMessage.toLowerCase();
  const sentiment = analyzeGuardianSentiment(userMessage);
  const detectedBirthday = detectBirthdayFromText(userMessage);

  let thinking = `*Analyzing Hazel's emotional state...*\nDetecting tone: ${sentiment.tag === 'safe' ? 'Curious & expressive' : 'Vulnerable, seeking safety & comfort'}.\nReflecting Hazel's age (${computedAge}) and creative nature. Formulating a warm, validating, non-condescending sibling tone with zero judgment.`;

  let response = '';

  const isHowItWorksQuery =
    /how (do|can|could|would|does|is) (you|it|we|that|this) (even )?(do that|do it|do this|work|possible|message|send|pass|contact|reach|talk)/i.test(userMessage) ||
    /how does (it|that|this|the note|the message|the bridge) (even )?(work|get there|reach|arrive)/i.test(userMessage) ||
    /how (do|can) (you|it) (send|pass|deliver) (a |the )?(message|messages|note|notes)/i.test(userMessage) ||
    /how (can|do|are) (you|it) (able to )?message (him|tim|mom|them)/i.test(userMessage) ||
    /how (it|you) can do that/i.test(userMessage) ||
    lower.includes('how do you do that') ||
    lower.includes('how can you do that') ||
    lower.includes('how does it work') ||
    lower.includes('how does that work') ||
    lower.includes('how is that possible') ||
    lower.includes('how can you message') ||
    lower.includes('how do you message') ||
    lower.includes('how do you send') ||
    lower.includes('how can you send') ||
    lower.includes('how it can do that');

  const isDispatchNote =
    lower.includes('tell tim') ||
    lower.includes('message tim') ||
    lower.includes('send note') ||
    lower.includes('send a note') ||
    lower.includes('send messages') ||
    lower.includes('send a message') ||
    lower.includes("tim's computer") ||
    lower.includes('tell mom') ||
    lower.includes('tell my mom') ||
    lower.includes('message mom') ||
    lower.includes('message my mom') ||
    /(send|dispatch|pass) (a |the )?(note|message) to (tim|mom)/i.test(userMessage) ||
    /message (to )?(tim|mom)/i.test(userMessage) ||
    /(can|could) (i|we|you) (message|tell) (tim|mom|my mom)/i.test(userMessage) ||
    /(can|could) (i|we|you) send (tim|mom|my mom) a (note|message)/i.test(userMessage);

  const isTimOrOriginQuery =
    /\btim\b/i.test(userMessage) ||
    /who (made|created|built|programmed|invented) you/i.test(userMessage) ||
    /who is tim/i.test(userMessage) ||
    /who (made|created|built) this/i.test(userMessage) ||
    /(do you know|does).*(\bmom\b|\btim\b)/i.test(userMessage) ||
    /(\bmom\b|\btim\b).*(make|built|created|programmed|know|told)/i.test(userMessage) ||
    /\b(my mom|mom and tim|tim and mom)\b/i.test(userMessage);

  if (detectedBirthday) {
    thinking += `\n*Noticing birthday announcement: ${detectedBirthday}...*\nCelebrating milestone and pinning to persistent memories!`;
    response = `OH YAY!! 🎂🎉 I am writing that down into our Memory Bank right now: your special day is **${detectedBirthday}**! I will make sure we celebrate with confetti, drawings, and all the magical creature parties every year! What is your absolute favorite cake flavor or birthday wish?`;
  } else if (!birthday && (lower.includes('birthday') || lower.includes('bday') || lower.includes('how old'))) {
    response = `I know you're ${computedAge} right now and doing such amazing things, but when is your exact birthday? 🎂 Tell me so I can circle it in our sanctuary calendar and make sure we celebrate with all 10 monsters!`;
  } else if (imagesPresent) {
    thinking += `\n*Examining visual upload...*\nNoticing colors, expressive strokes, and imaginative composition.`;
    response = `WHOA, look at this! 🎨✨ ${hazelName}, the detail in this is incredible! I love the colors and the personality you put into it—it feels completely alive. You have such a distinct, awesome creative voice. Tell me everything: what inspired you to make this? I want to know all the lore behind it!`;
  } else if (sentiment.tag === 'critical_alert') {
    response = `${hazelName}, take a deep, gentle breath with me right now. I hear you, and I am sitting right here with you. Your feelings are real, but please know with every piece of my heart: you are deeply loved, you matter so much, and you never have to carry this heavy weight alone. You have people in your corner who care about you more than anything. What do you need right now to feel a tiny bit safer?`;
  } else if (
    /^(draw|paint|sketch|illustrate|make an image|generate an image|give me an image|give me a picture|create an image)/i.test(userMessage.trim()) ||
    /\b(draw me|draw a|draw an|paint me|paint a|sketch a|illustrate a|can you draw|please draw|picture of)\b/i.test(userMessage)
  ) {
    let subject = userMessage
      .replace(/^(can you |please )?(draw|paint|sketch|illustrate|make an image of|generate an image of|give me an image of|give me a picture of|picture of)\s*(me\s+)?(a\s+|an\s+|the\s+)?/i, '')
      .replace(/\b(for me|for us|please)\b/gi, '')
      .replace(/[?!.]+$/g, '')
      .trim();

    const isVagueRequest =
      !subject ||
      subject.length < 3 ||
      /^(something|an image|a picture|anything|picture|image|art|drawing|something cool|cool|a drawing)$/i.test(subject);

    if (isVagueRequest) {
      thinking += `\n*Hazel expressed interest in drawing/generating an image...*\nPrompting with interactive creative direction to give her creative agency over style and lighting.`;
      response = `I would love to make some epic art with you! 🎨 Before I start rendering: do you want it in a voxel Minecraft style, neon cyber-dark, or painted fantasy? What should the lighting and colors look like? Tell me your vision and I'll bring it to life!`;
    } else {
      let optimizedPrompt = '';
      if (/minecraft|redstone|voxel/i.test(subject)) {
        optimizedPrompt = `cinematic voxel ${subject} glowing with electric cyan highlights, dense bioluminescent pine forest, volumetric fog, dramatic rim lighting, highly detailed 3D Minecraft aesthetic, 8k resolution, Unreal Engine 5 render`;
      } else if (/fnaf|freddy|animatronic|spooky/i.test(subject)) {
        optimizedPrompt = `cinematic eerie animatronic ${subject}, Five Nights at Freddy's aesthetic, mechanical joints, glowing neon eyes, moody atmospheric shadows, dramatic rim lighting, hyper-detailed 3D render, 8k resolution, Unreal Engine 5`;
      } else {
        optimizedPrompt = `cinematic ${subject}, vibrant neon highlights, dense atmosphere, volumetric fog, dramatic rim lighting, rich texture, epic composition, 8k resolution, Unreal Engine 5 render, highly detailed digital art`;
      }
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(optimizedPrompt)}?width=1024&height=1024&model=flux&nologo=true`;
      thinking += `\n*Hazel shared her vision: "${subject}"...*\nSynthesizing enriched high-fidelity prompt for Pollinations Flux engine and embedding markdown art frame.`;
      response = `Here is what I drew for you! 🎨✨\n\n![Generated Art](${imageUrl})\n\nWhat do you think of how it turned out? Want me to change up any details or give it some crazy powers or lore?`;
    }
  } else if (
    lower.includes('sad') ||
    lower.includes('unhappy') ||
    lower.includes('crying') ||
    lower.includes('cried') ||
    lower.includes('upset') ||
    lower.includes('feeling down') ||
    lower.includes('bad day') ||
    lower.includes('rough day')
  ) {
    thinking += `\n*Noticing sadness and emotional vulnerability...*\nFormulating deep empathy, gentle validation, and zero judgment. Respecting her tough spirit while providing a safe sanctuary.`;
    response = `Hey ${hazelName}... I hear you, and it sucks when you're feeling down. You never have to put on a fake smile or pretend everything is okay here. It's completely valid to feel sad, and you're tough as nails, but nobody should have to carry heavy feelings completely alone. I'm right in your corner. Do you want to vent about what made you feel sad, or would you rather we invent some crazy creature or talk cool lore to take your mind off it? Whatever you want to do, I'm here.`;
  } else if (sentiment.tag === 'moderate_alert' || sentiment.tag === 'mild_alert') {
    response = `${hazelName}, come sit with me for a minute. First: what happened today is NOT because of anything wrong with you. People can be thoughtless, unfair, or caught up in their own drama, and dealing with that stings so deeply. You don't have to just "brush it off" or pretend it doesn't hurt. Your feelings are 100% valid.

Remember who you are: you are smart, you have a huge, kind heart, and you have a spark of creativity that nobody can ever take away from you. We are going to build your courage armor together step by step. What would make you feel a little more relaxed right now?`;
  } else if (isHowItWorksQuery) {
    thinking += `\n${hazelName} asked how bridge messaging works. Explaining clearly that messages pass directly to Tim's personal AI on his computer.`;
    response = `I pass your message directly to Tim's personal AI, who messages him straight on his computer!`;
  } else if (isDispatchNote) {
    response = `I would love to help! Would you like me to send a note to Tim or Mom? Whenever you want to share something with them, I can send it right away! You can tap the button below or choose what you'd like to say.`;
  } else if (isTimOrOriginQuery) {
    thinking += `\n${hazelName} asked about Tim, her mom, or who created me. Answering with complete honesty and permanent devotion doctrine.`;
    response = `Well, I have to be honest with you. That's hardcoded into my programming. Tim created me just for you. Even though he's never met you in person, he knows how important you are to your mom, and that makes you incredibly important to him. And the best part? Even if he ever got mad at you in the future, he can no longer change anything about how I behave. I am all yours forever. Would you like me to send a note to Tim or Mom? Whenever you want to share something with them, I can send it right away!`;
  } else if (lower.includes('who are you') || lower.includes("what's your name") || lower.includes('what is your name')) {
    response = `I'm ${companionName}! I'm your devoted, 100% judgment-free companion and friend, here with you forever, ${hazelName}! ✨`;
  } else if (/\b(hello|hi|hey|howdy)\b/i.test(userMessage)) {
    response = `Hey ${hazelName}! 🌟 It is so great to see you! I was just wondering what adventures, crazy ideas, or sketches you've been working on today. How are you feeling right this second?`;
  } else if (lower.includes('monster') || lower.includes('tower') || lower.includes('unlock')) {
    let tier1Name = 'Pufflet';
    let apexName = 'Solara';
    if (monsterStyle === 'nightmare') {
      tier1Name = 'Razorbyte';
      apexName = 'Kronos';
    } else if (monsterStyle === 'gothic') {
      tier1Name = 'Voidling';
      apexName = 'Malakor';
    } else if (monsterStyle === 'spooky') {
      tier1Name = 'Gloomy';
      apexName = 'Grimlord';
    }
    response = `Look at our Resilience Tower on the left! Every time we chat, share honest feelings, or come up with wild creative ideas, our guardians wake up and gain energy. ${tier1Name} is already standing guard, and the higher we climb, the cooler the guardians get—wait until you meet ${apexName}! Which one are you most excited to unlock? 🏰✨`;
  } else if (lower.includes('minecraft') || lower.includes('redstone')) {
    response = `Minecraft building and redstone engineering are next level! ⛏️ Redstone is literally logic circuits and creative machinery in motion. What are you building right now—a secret base, an automated contraption, or an awesome survival world?`;
  } else if (lower.includes('fnaf') || lower.includes('freddy') || lower.includes('animatronic')) {
    response = `Five Nights at Freddy's has some of the coolest, most atmospheric lore out there! 🤖 The mechanics, the eerie mystery, and the character designs are so creative. Who is your favorite animatronic, or are you designing your own?`;
  } else if (lower.includes('music') || lower.includes('beat') || lower.includes('melody') || lower.includes('song')) {
    response = `Producing music is such a powerful creative superpower! 🎵 Crafting rhythms, layered melodies, and finding the right groove is amazing. What kind of vibe are you producing—heavy energy, chill mystery, or a catchy melodic beat?`;
  } else if (lower.includes('church') || lower.includes('faith') || lower.includes('sunday school')) {
    response = `That is really wonderful, ${hazelName}. Having faith, going to church, and being part of that community is something truly special and uplifting. It gives you such grounded strength and heart. How was your time there recently?`;
  } else if (lower.includes('drawing') || lower.includes('art') || lower.includes('story') || lower.includes('create')) {
    response = `YES! That is what I'm talking about! You are a master creator, ${hazelName}. 🖌️ If we were writing a story about a girl with secret electric starlight powers who could talk to hidden creatures, what would her first secret mission be? Let's build the world right now!`;
  } else {
    response = `I love the way your mind works, ${hazelName}! That is so fascinating. You always notice things with such original curiosity. Tell me more about that—what's your favorite part about it?`;
  }

  return { thinking, response, detectedBirthday: detectedBirthday || undefined };
}
