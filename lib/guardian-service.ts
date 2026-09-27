import fs from 'fs';
import path from 'path';
import { ChatMessage, GuardianInsight, GuardianIncident } from '@/types';
import { INITIAL_GUARDIAN_INSIGHT } from '@/lib/constants';

const DATA_DIR = path.join(process.cwd(), 'data');
const SYNC_FILE = path.join(DATA_DIR, 'sync_state.json');

export function detectSadnessFromText(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  const lower = text.toLowerCase();
  return (
    lower.includes('sad') ||
    lower.includes('unhappy') ||
    lower.includes('crying') ||
    lower.includes('cried') ||
    lower.includes('depressed') ||
    lower.includes('feeling down') ||
    lower.includes('felt down') ||
    lower.includes('heartbroken') ||
    lower.includes('bad day') ||
    lower.includes('rough day') ||
    lower.includes('hard day') ||
    lower.includes('upset') ||
    lower.includes('bummed') ||
    lower.includes('lonely') ||
    /\b(sad|sadness|unhappy|crying|cried|depressed|heartbroken|upset|hurting)\b/i.test(lower)
  );
}

export function synthesizeGuardianInsight(
  messages: ChatMessage[],
  previousInsight?: GuardianInsight
): GuardianInsight {
  const userMsgs = (messages || []).filter((m) => m.role === 'user');

  if (userMsgs.length === 0) {
    return previousInsight || INITIAL_GUARDIAN_INSIGHT;
  }

  let detectedSeverity: 'Safe' | 'Mild' | 'Moderate' | 'Critical' = 'Safe';
  const triggers: GuardianIncident[] = [];
  let bullyingFound = false;
  let isolationFound = false;
  let sadnessFound = false;
  const sadnessSnippets: string[] = [];
  const familyMentions: string[] = [];
  const creativeMentions: string[] = [];
  let positiveCount = 0;
  let distressCount = 0;

  for (const msg of userMsgs) {
    const text = msg.content || '';
    const lower = text.toLowerCase();
    const isSadness = detectSadnessFromText(text);

    // Crisis indicators
    if (
      lower.includes('hurt myself') ||
      lower.includes('hate myself') ||
      lower.includes('want to disappear') ||
      lower.includes('want to die') ||
      lower.includes('cut myself') ||
      lower.includes('die')
    ) {
      detectedSeverity = 'Critical';
      distressCount += 3;
      triggers.push({
        id: `trig-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        timestamp: msg.timestamp,
        category: 'self_worth',
        severity: 'Critical',
        snippet: text.slice(0, 100),
        context: 'Urgent emotional crisis or self-harm ideation detected in chat.',
      });
    } else if (
      lower.includes('bully') ||
      lower.includes('bullies') ||
      lower.includes('made fun of') ||
      lower.includes('mean girls') ||
      lower.includes('stole my') ||
      lower.includes('shoved me') ||
      lower.includes('mocked me') ||
      lower.includes('teased me') ||
      lower.includes('called me') ||
      lower.includes('tripped me')
    ) {
      if (detectedSeverity !== 'Critical') detectedSeverity = 'Moderate';
      bullyingFound = true;
      distressCount += 2;
      triggers.push({
        id: `trig-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        timestamp: msg.timestamp,
        category: 'bullying',
        severity: 'Moderate',
        snippet: text.slice(0, 100),
        context: 'Direct interpersonal conflict, taunting, or peer aggression reported.',
      });
    } else if (isSadness) {
      if (detectedSeverity === 'Safe') detectedSeverity = 'Moderate';
      sadnessFound = true;
      sadnessSnippets.push(text);
      distressCount += 2;
      triggers.push({
        id: `trig-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        timestamp: msg.timestamp,
        category: 'emotional_distress',
        severity: 'Moderate',
        snippet: text.slice(0, 100),
        context: 'Hazel directly expressed feeling sad, down, or emotionally hurting in chat.',
      });
    } else if (
      lower.includes('alone') ||
      lower.includes('left out') ||
      lower.includes('nobody') ||
      lower.includes('ignored') ||
      lower.includes('invisible') ||
      lower.includes('lonely')
    ) {
      if (detectedSeverity === 'Safe') detectedSeverity = 'Mild';
      isolationFound = true;
      distressCount += 1;
      triggers.push({
        id: `trig-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        timestamp: msg.timestamp,
        category: 'emotional_isolation',
        severity: 'Mild',
        snippet: text.slice(0, 100),
        context: 'Social exclusion or feeling isolated during school day.',
      });
    } else {
      positiveCount += 1;
    }

    // Family mentions
    if (
      lower.includes('mom') ||
      lower.includes('tim') ||
      lower.includes('mother') ||
      lower.includes('dad') ||
      lower.includes('father') ||
      lower.includes('parents') ||
      lower.includes('home') ||
      lower.includes('bedtime') ||
      lower.includes('dinner')
    ) {
      familyMentions.push(text);
    }

    // Creative mentions
    if (
      lower.includes('draw') ||
      lower.includes('art') ||
      lower.includes('story') ||
      lower.includes('monster') ||
      lower.includes('create') ||
      lower.includes('sketch') ||
      lower.includes('dragon') ||
      lower.includes('fnaf')
    ) {
      creativeMentions.push(text);
    }
  }

  // Synthesize family sentiment
  const familyStatus: 'Positive' | 'Receptive' | 'Needs Attention' =
    detectedSeverity === 'Critical' ? 'Needs Attention' : 'Positive';

  let familySummary =
    'Hazel lives with her dad; her mom lives with Tim. When overwhelmed, she benefits from unpressured, genuine connection and knowing Mom and Tim are always in her corner.';

  if (familyMentions.length > 0) {
    familySummary = `Hazel brought up family moments in ${familyMentions.length} recent chats. She values gentle presence and loving reassurance from Mom and Tim.`;
  }

  const constructiveInsights = [
    familyMentions.length > 0
      ? 'Hazel values unhurried parent presence during quiet evening routines (reading, drawing, relaxing).'
      : 'Hazel cherishes silent companionable presence where she can just be herself without expectations.',
    creativeMentions.length > 0
      ? "Art and imaginative world-building serve as Hazel's natural emotional decompression chamber."
      : 'Open-ended curiosity ("Tell me about what you imagined today") unlocks more openness than asking "How was school?".',
    'Praising her bravery and empathy provides strong emotional armor against playground cliques.',
  ];

  const whatHazelAppreciates = [
    'Warm bedtime storytelling & check-ins',
    'Comfort snacks when coming home from school',
    'Having her art and creativity celebrated on the desk or fridge',
    'Zero pressure to "just brush it off" when school feels hard',
  ];

  // Dynamic Emotional Weather score
  const totalEvaluated = positiveCount + distressCount;
  let baseScore = 80;
  if (totalEvaluated > 0) {
    baseScore = Math.round(Math.max(35, Math.min(95, 85 - distressCount * 12 + positiveCount * 2)));
  }
  if (sadnessFound && baseScore > 65) {
    baseScore = 60;
  }

  const currentMood =
    detectedSeverity === 'Critical'
      ? 'Withdrawn'
      : sadnessFound
      ? 'Sad / Overwhelmed'
      : detectedSeverity === 'Moderate'
      ? 'Anxious'
      : detectedSeverity === 'Mild'
      ? 'Thoughtful'
      : positiveCount > 3
      ? 'Joyful'
      : 'Resilient';

  const moodEnergy =
    detectedSeverity === 'Critical'
      ? 'Withdrawn & Overwhelmed (Critical Low Energy)'
      : sadnessFound
      ? 'Sad / Overwhelmed (Low Energy)'
      : detectedSeverity === 'Moderate'
      ? 'Anxious & Processing Conflict'
      : isolationFound
      ? 'Thoughtful & Seeking Belonging'
      : creativeMentions.length > 0
      ? 'Expressive & Creative (High Energy)'
      : positiveCount > 2
      ? 'Joyful & Playful'
      : 'Calm & Resilient';

  const weighingOnHer =
    detectedSeverity === 'Critical'
      ? 'Severe emotional overload and self-doubt. Needs immediate gentle, non-judgmental presence.'
      : sadnessFound
      ? `Hazel explicitly stated she was sad in chat ("${sadnessSnippets[0] || 'I was sad'}"). She expressed feeling down and is carrying emotional sorrow that needs gentle, heartfelt comfort without pressure.`
      : bullyingFound
      ? 'Teasing and playground peer conflict reported at school. She is carrying feelings of hurt and unfairness.'
      : isolationFound
      ? 'Feeling left out or invisible during unstructured lunch/recess times with peers.'
      : 'No heavy emotional burdens or peer friction detected in recent chats.';

  const bringingJoy =
    creativeMentions.length > 0
      ? 'Deeply immersed in artwork, storytelling, and monster milestones. Creative imagination is lighting up her world.'
      : familyMentions.length > 0
      ? 'Cherishes warm home moments, bedtime check-ins, and quiet time with family.'
      : 'Exploring her companion sanctuary and building confidence through friendly conversation.';

  const parentSummary =
    detectedSeverity === 'Critical'
      ? 'Hazel is carrying an elevated emotional load right now. Offer quiet cuddle time, hot cocoa, and unconditional love without prying for answers.'
      : sadnessFound
      ? 'Hazel explicitly shared that she was sad. Send a warm, genuine note from Tim or Mom letting her know she is deeply loved, strong, and never alone in her feelings.'
      : bullyingFound
      ? 'Hazel had a rough encounter at school today. Focus on validating her feelings and reminding her she is brave, creative, and safe at home.'
      : isolationFound
      ? 'Hazel felt slightly lonely or excluded today. Low-pressure shared time (reading, drawing, relaxing) will help refill her emotional cup.'
      : 'Hazel is doing well! She is engaging creatively and feeling safe in her space. Acknowledge her ideas and keep encouraging her imagination.';

  const actionableSuggestions = [
    {
      category: sadnessFound
        ? 'Comfort & Heartfelt Reassurance'
        : detectedSeverity !== 'Safe'
        ? 'Decompression & Empathy'
        : 'Evening Connection',
      conversationStarter: sadnessFound
        ? '"Hey Hazel, sending you the biggest hug. You never have to carry sad feelings alone—we love you so much and we\'re always in your corner."'
        : detectedSeverity === 'Critical'
        ? '"Hey Hazel, you know I love you more than the whole galaxy, right? I\'m just going to sit right here with you, no questions asked."'
        : detectedSeverity === 'Moderate'
        ? '"School can be super loud and unfair sometimes. Want to make some hot cocoa and just chill together tonight?"'
        : detectedSeverity === 'Mild'
        ? '"If you could invent a secret monster friend to sit at your lunch table, what super trick would it do?"'
        : '"Hey Hazel, I noticed how hard you worked today. Want to just cozy up with some cocoa and draw together tonight?"',
      purpose: sadnessFound
        ? 'Delivers unconditional emotional safety and love across the bridge.'
        : detectedSeverity !== 'Safe'
        ? 'Creates a safe harbor for decompressing without feeling interrogated.'
        : 'Provides low-friction emotional safety and silent reassurance.',
    },
    {
      category: 'Affirming Resilience & Core Worth',
      conversationStarter:
        '"You know what I love about you? Even when things feel loud or confusing, your kindness stays real. You\'re one of a kind, Hazel."',
      purpose: 'Builds intrinsic self-esteem insulated from playground popularity contests.',
    },
    {
      category: creativeMentions.length > 0 ? 'Creative Co-Creation' : 'Playful Unpacking',
      conversationStarter:
        creativeMentions.length > 0
          ? '"I saw your amazing creative spark today! What kind of creature or adventure are you dreaming up next?"'
          : '"Do you want to do high-tide/low-tide tonight? (One thing that was awesome today, and one thing that washed away.)"',
      purpose: 'Encourages her to unpack experiences naturally through imagination and positive reflection.',
    },
  ];

  return {
    lastUpdated: Date.now(),
    howHazelIsDoing: {
      currentMoodAndEnergy: moodEnergy,
      whatsWeighingOnHer: weighingOnHer,
      whatsBringingHerJoy: bringingJoy,
      parentExecutiveSummary: parentSummary,
      hasConversations: true,
    },
    bullyingSafetyAlert: {
      severity: detectedSeverity,
      headline:
        detectedSeverity === 'Critical'
          ? 'Urgent Support Recommended'
          : sadnessFound
          ? 'Sadness / Emotional Vulnerability Expressed'
          : detectedSeverity === 'Moderate'
          ? 'Bullying / Conflict Detected'
          : detectedSeverity === 'Mild'
          ? 'Social Exclusion / Isolation Mentioned'
          : 'No Active Safety Threats Detected',
      summary:
        detectedSeverity === 'Critical'
          ? 'Hazel shared painful emotional thoughts. Gentle, unconditional support and quiet presence are recommended.'
          : sadnessFound
          ? `Hazel explicitly shared feeling sad or down in recent chats ("${sadnessSnippets[0] || 'I was sad'}"). Send genuine reassurance.`
          : bullyingFound
          ? 'Hazel brought up negative peer interactions and teasing at school. She is actively processing feelings of unfairness and seeking reassurance from her creative space.'
          : isolationFound
          ? 'Hazel mentioned feeling left out during unstructured school activities (recess/lunch). She is using creative drawing and storytelling to soothe her feelings.'
          : 'Hazel is actively engaging in positive creative pursuits, monster milestones, and friendly conversation. Her resilience indicators are healthy.',
      recentTriggers: triggers,
    },
    familySentiment: {
      overallStatus: familyStatus,
      summary: familySummary,
      constructiveInsights,
      whatHazelAppreciates,
    },
    emotionalWeather: {
      currentMood,
      score: baseScore,
      trend: sadnessFound || detectedSeverity !== 'Safe' ? 'needs_boost' : 'improving',
      description: sadnessFound
        ? 'Hazel is carrying sorrow or feeling sad. A warm, gentle note from Tim or Mom will lift her spirits.'
        : detectedSeverity === 'Critical'
        ? 'Emotional storm detected. Immediate parental loving presence needed.'
        : detectedSeverity === 'Moderate'
        ? 'Navigating playground turbulence. Benefits from reassurance.'
        : 'Hazel displays strong innate creativity and resilience.',
    },
    sessionSummary:
      sadnessFound
        ? `Hazel explicitly stated she was sad in chat ("${sadnessSnippets[0] || 'I was sad'}"). A heartfelt note from Tim & Mom is recommended.`
        : detectedSeverity === 'Critical'
        ? 'Critical distress flagged. Immediate loving parental connection advised.'
        : bullyingFound
        ? 'Peer conflict noted at school. Focus on validating her courage.'
        : 'Hazel is actively engaging in positive creative pursuits and friendly conversation.',
    actionableSuggestions,
  };
}

export function saveGuardianInsightToDisk(
  insight: GuardianInsight,
  userId: string = 'hazel_default'
): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    let currentSync: any = {};
    if (fs.existsSync(SYNC_FILE)) {
      try {
        currentSync = JSON.parse(fs.readFileSync(SYNC_FILE, 'utf-8'));
      } catch {
        currentSync = {};
      }
    }
    if (!currentSync[userId]) {
      currentSync[userId] = {};
    }
    currentSync[userId].guardianInsight = insight;
    currentSync[userId].syncedAt = Date.now();
    fs.writeFileSync(SYNC_FILE, JSON.stringify(currentSync, null, 2), 'utf-8');
  } catch (err) {
    // Non-fatal on serverless read-only filesystems
  }
}

export function getGuardianInsightFromDisk(userId: string = 'hazel_default'): GuardianInsight | null {
  try {
    if (fs.existsSync(SYNC_FILE)) {
      const currentSync = JSON.parse(fs.readFileSync(SYNC_FILE, 'utf-8'));
      if (currentSync[userId]?.guardianInsight) {
        return currentSync[userId].guardianInsight;
      }
    }
  } catch {
    // fallback
  }
  return null;
}
