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

      for (const msg of userMsgs) {
        const text = msg.content.toLowerCase();
        if (text.includes('hurt myself') || text.includes('hate myself') || text.includes('want to disappear')) {
          detectedSeverity = 'Critical';
          triggers.push({
            id: `trig-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
            timestamp: msg.timestamp,
            category: 'self_worth',
            severity: 'Critical',
            snippet: msg.content.slice(0, 100),
            context: 'Urgent emotional crisis or self-harm ideation detected in chat.',
          });
        } else if (text.includes('bully') || text.includes('bullies') || text.includes('made fun of') || text.includes('mean girls')) {
          if (detectedSeverity !== 'Critical') detectedSeverity = 'Moderate';
          bullyingFound = true;
          triggers.push({
            id: `trig-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
            timestamp: msg.timestamp,
            category: 'bullying',
            severity: 'Moderate',
            snippet: msg.content.slice(0, 100),
            context: 'Direct interpersonal conflict, taunting, or peer aggression reported.',
          });
        } else if (text.includes('alone') || text.includes('left out') || text.includes('nobody') || text.includes('ignored')) {
          if (detectedSeverity === 'Safe') detectedSeverity = 'Mild';
          isolationFound = true;
          triggers.push({
            id: `trig-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
            timestamp: msg.timestamp,
            category: 'emotional_isolation',
            severity: 'Mild',
            snippet: msg.content.slice(0, 100),
            context: 'Social exclusion or feeling isolated during school day.',
          });
        }
      }

      const updatedInsight: GuardianInsight = {
        lastUpdated: Date.now(),
        bullyingSafetyAlert: {
          severity: detectedSeverity === 'Safe' ? (triggers.length > 0 ? 'Mild' : 'Safe') : detectedSeverity,
          headline: detectedSeverity === 'Critical'
            ? 'Urgent Emotional Check-in Recommended'
            : detectedSeverity === 'Moderate'
            ? 'Active Peer Conflict / Bullying Mentioned'
            : isolationFound
            ? 'Mild Social Exclusion / Lunchroom Loneliness'
            : 'No Active Safety Threats Detected',
          summary: detectedSeverity === 'Critical'
            ? 'Hazel expressed heavy feelings of self-doubt and emotional overload. We strongly advise gentle, unconditional parental connection and cuddles tonight without pressing for details.'
            : detectedSeverity === 'Moderate'
            ? 'Hazel brought up negative peer interactions and teasing at school. She is actively processing feelings of unfairness and seeking reassurance from her creative space.'
            : isolationFound
            ? 'Hazel mentioned feeling left out during unstructured school activities (recess/lunch). She is using creative drawing and storytelling to soothe her feelings.'
            : 'Hazel is actively engaging in positive creative pursuits, monster milestones, and friendly conversation. Her resilience indicators are healthy.',
          recentTriggers: triggers.length > 0 ? triggers : INITIAL_GUARDIAN_INSIGHT.bullyingSafetyAlert.recentTriggers,
        },
        familySentiment: {
          overallStatus: detectedSeverity === 'Critical' ? 'Needs Attention' : 'Positive',
          summary: 'Hazel feels warmth and safety in her home environment. When overwhelmed, she benefits most from quiet companionship alongside parents rather than direct problem-solving interrogations.',
          constructiveInsights: [
            'Hazel values parent presence during artistic activities (coloring, reading, building).',
            'Open-ended curiosity ("Tell me about this character") unlocks more openness than asking "How was school?".',
            'Praising her bravery and empathy provides strong emotional armor against playground cliques.',
          ],
          whatHazelAppreciates: [
            'Warm bedtime storytelling',
            'Comfort snacks when coming home from school',
            'Having her art celebrated on the fridge or desk',
          ],
        },
        emotionalWeather: {
          currentMood: detectedSeverity === 'Critical'
            ? 'Withdrawn'
            : detectedSeverity === 'Moderate'
            ? 'Anxious'
            : detectedSeverity === 'Mild'
            ? 'Thoughtful'
            : 'Resilient',
          score: detectedSeverity === 'Critical' ? 42 : detectedSeverity === 'Moderate' ? 62 : detectedSeverity === 'Mild' ? 74 : 88,
          trend: detectedSeverity === 'Critical' ? 'needs_boost' : 'improving',
          description: detectedSeverity === 'Critical'
            ? 'Hazel is carrying an elevated emotional load. Extra tenderness and peaceful evening routines recommended.'
            : 'Hazel displays strong innate creativity. While social friction occurs, she bounces back quickly when validated.',
        },
        actionableSuggestions: [
          {
            category: 'Evening Connection',
            conversationStarter: '"Hey sweetie, I noticed how hard you worked today. Want to just cozy up with some cocoa and draw together tonight?"',
            purpose: 'Provides low-friction emotional safety and silent reassurance.',
          },
          {
            category: 'Affirming Resilience',
            conversationStarter: '"You know what I love about you? Even when things feel loud or confusing, your kindness stays real. You\'re one of a kind, Hazel."',
            purpose: 'Builds intrinsic self-esteem insulated from playground popularity contests.',
          },
          {
            category: 'Playful Unpacking',
            conversationStarter: '"If you were inventing a secret monster friend to sit at your lunch table, what super trick would it do?"',
            purpose: 'Encourages her to unpack lunchroom experiences through her favorite medium—imagination.',
          },
        ],
      };

      return NextResponse.json({ success: true, insight: updatedInsight });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    console.error('Guardian API error:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Server error' }, { status: 500 });
  }
}
