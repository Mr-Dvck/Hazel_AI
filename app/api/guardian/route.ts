import { NextRequest, NextResponse } from 'next/server';
import { GuardianInsight, ChatMessage } from '@/types';
import { INITIAL_GUARDIAN_INSIGHT } from '@/lib/constants';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, pin, messages = [] } = body;

    const expectedPin = process.env.GUARDIAN_PIN || '1234';

    if (pin !== expectedPin) {
      return NextResponse.json(
        { success: false, error: 'Incorrect 4-digit security PIN' },
        { status: 401 }
      );
    }

    if (action === 'verify_pin') {
      return NextResponse.json({ success: true, authorized: true });
    }

    if (action === 'analyze') {
      // Analyze recent chat messages to update executive summary
      const userMsgs = (messages as ChatMessage[]).filter((m) => m.role === 'user');

      let detectedSeverity: 'Safe' | 'Mild' | 'Moderate' | 'Critical' = 'Safe';
      let triggers: any[] = [];
      let bullyingFound = false;
      let isolationFound = false;
      let familyMentions: string[] = [];
      let creativeMentions: string[] = [];
      let positiveCount = 0;
      let distressCount = 0;

      for (const msg of userMsgs) {
        const text = msg.content;
        const lower = text.toLowerCase();

        // Check sentiment indicators
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
            snippet: msg.content.slice(0, 100),
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
            snippet: msg.content.slice(0, 100),
            context: 'Direct interpersonal conflict, taunting, or peer aggression reported.',
          });
        } else if (
          lower.includes('alone') ||
          lower.includes('left out') ||
          lower.includes('nobody') ||
          lower.includes('ignored') ||
          lower.includes('invisible') ||
          lower.includes('cried') ||
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
            snippet: msg.content.slice(0, 100),
            context: 'Social exclusion or feeling isolated during school day.',
          });
        } else {
          positiveCount += 1;
        }

        // Check family keywords
        if (
          lower.includes('mom') ||
          lower.includes('dad') ||
          lower.includes('mother') ||
          lower.includes('father') ||
          lower.includes('parents') ||
          lower.includes('home') ||
          lower.includes('bedtime') ||
          lower.includes('dinner')
        ) {
          familyMentions.push(text);
        }

        // Check creative keywords
        if (
          lower.includes('draw') ||
          lower.includes('art') ||
          lower.includes('story') ||
          lower.includes('monster') ||
          lower.includes('create') ||
          lower.includes('sketch') ||
          lower.includes('dragon')
        ) {
          creativeMentions.push(text);
        }
      }

      // Synthesize family sentiment constructively
      let familyStatus: 'Positive' | 'Warm' | 'Needs Attention' =
        detectedSeverity === 'Critical' ? 'Needs Attention' : 'Positive';

      let familySummary =
        'Hazel feels warmth and safety in her home environment. When overwhelmed, she benefits most from quiet companionship alongside parents rather than direct problem-solving interrogations.';

      if (familyMentions.length > 0) {
        familySummary = `Hazel brought up home and family moments in ${familyMentions.length} recent chats. She seeks gentle presence from mom and dad, especially during unwinding routines.`;
      }

      const constructiveInsights = [
        familyMentions.length > 0
          ? 'Hazel values unhurried parent presence during quiet evening routines (reading, drawing, relaxing).'
          : 'Hazel cherishes silent companionable presence where she can just be herself without expectations.',
        creativeMentions.length > 0
          ? 'Art and imaginative world-building serve as Hazel\'s natural emotional decompression chamber.'
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
      const baseScore = totalEvaluated > 0
        ? Math.round(Math.max(35, Math.min(95, 85 - (distressCount * 12) + (positiveCount * 2))))
        : 80;

      const currentMood =
        detectedSeverity === 'Critical'
          ? 'Withdrawn'
          : detectedSeverity === 'Moderate'
          ? 'Anxious'
          : detectedSeverity === 'Mild'
          ? 'Thoughtful'
          : positiveCount > 3
          ? 'Joyful'
          : 'Resilient';

      // Tailored actionable parent conversation starters
      const actionableSuggestions = [
        {
          category: detectedSeverity !== 'Safe' ? 'Decompression & Empathy' : 'Evening Connection',
          conversationStarter:
            detectedSeverity === 'Critical'
              ? '"Hey Hazel, you know I love you more than the whole galaxy, right? I\'m just going to sit right here with you, no questions asked."'
              : detectedSeverity === 'Moderate'
              ? '"School can be super loud and unfair sometimes. Want to make some hot cocoa and just chill together tonight?"'
              : detectedSeverity === 'Mild'
              ? '"If you could invent a secret monster friend to sit at your lunch table, what super trick would it do?"'
              : '"Hey Hazel, I noticed how hard you worked today. Want to just cozy up with some cocoa and draw together tonight?"',
          purpose:
            detectedSeverity !== 'Safe'
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

      let howHazelIsDoing: {
        currentMoodAndEnergy: string;
        whatsWeighingOnHer: string;
        whatsBringingHerJoy: string;
        parentExecutiveSummary: string;
        hasConversations: boolean;
      };

      if (userMsgs.length === 0) {
        howHazelIsDoing = {
          currentMoodAndEnergy: 'Awaiting Conversation',
          whatsWeighingOnHer: 'No school or friend friction reported.',
          whatsBringingHerJoy: 'Sanctuary created; awaiting first creative share.',
          parentExecutiveSummary: "Waiting for Hazel's first conversation to synthesize her well-being assessment.",
          hasConversations: false,
        };
      } else {
        const moodEnergy =
          detectedSeverity === 'Critical'
            ? 'Withdrawn & Overwhelmed (Low Energy)'
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
            : bullyingFound
            ? 'Hazel had a rough encounter at school today. Focus on validating her feelings and reminding her she is brave, creative, and safe at home.'
            : isolationFound
            ? 'Hazel felt slightly lonely or excluded today. Low-pressure shared time (reading, drawing, relaxing) will help refill her emotional cup.'
            : 'Hazel is doing well! She is engaging creatively and feeling safe in her space. Acknowledge her ideas and keep encouraging her imagination.';

        howHazelIsDoing = {
          currentMoodAndEnergy: moodEnergy,
          whatsWeighingOnHer: weighingOnHer,
          whatsBringingHerJoy: bringingJoy,
          parentExecutiveSummary: parentSummary,
          hasConversations: true,
        };
      }

      const updatedInsight: GuardianInsight = {
        lastUpdated: Date.now(),
        howHazelIsDoing,
        bullyingSafetyAlert: {
          severity: detectedSeverity === 'Safe' ? (triggers.length > 0 ? 'Mild' : 'Safe') : detectedSeverity,
          headline:
            detectedSeverity === 'Critical'
              ? 'Urgent Emotional Check-in Recommended'
              : detectedSeverity === 'Moderate'
              ? 'Active Peer Conflict / Bullying Mentioned'
              : isolationFound
              ? 'Mild Social Exclusion / Lunchroom Loneliness'
              : 'No Active Safety Threats Detected',
          summary:
            detectedSeverity === 'Critical'
              ? 'Hazel expressed heavy feelings of self-doubt and emotional overload. We strongly advise gentle, unconditional parental connection and cuddles tonight without pressing for details.'
              : detectedSeverity === 'Moderate'
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
          trend: detectedSeverity === 'Critical' ? 'needs_boost' : 'improving',
          description:
            detectedSeverity === 'Critical'
              ? 'Hazel is carrying an elevated emotional load. Extra tenderness and peaceful evening routines recommended.'
              : detectedSeverity === 'Moderate'
              ? 'Hazel feels challenged by playground peer dynamics, but continues to show strong imaginative resilience.'
              : 'Hazel displays strong innate creativity and bouncing resilience. She bounces back quickly when validated.',
        },
        sessionSummary:
          detectedSeverity === 'Critical'
            ? 'Hazel expressed heavy feelings of self-doubt and emotional overload. We strongly advise gentle, unconditional parental connection and cuddles tonight without pressing for details.'
            : detectedSeverity === 'Moderate'
            ? 'Hazel brought up negative peer interactions and teasing at school. She is actively processing feelings of unfairness and seeking reassurance from her creative space.'
            : isolationFound
            ? 'Hazel mentioned feeling left out during unstructured school activities (recess/lunch). She is using creative drawing and storytelling to soothe her feelings.'
            : 'Hazel is actively engaging in positive creative pursuits, monster milestones, and friendly conversation. Her resilience indicators are healthy.',
        actionableSuggestions,
      };

      return NextResponse.json({ success: true, insight: updatedInsight });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    console.error('Guardian API error:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
