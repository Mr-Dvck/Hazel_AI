import { NextRequest, NextResponse } from 'next/server';
import { SYSTEM_PROMPT, calculateAge, detectBirthdayFromText, getSystemPrompt } from '@/lib/constants';
import {
  ALL_MODELS,
  analyzeGuardianSentiment,
  generateEmpatheticOfflineStream,
  detectArtRequest,
  generateImageWithFallback,
} from '@/lib/llm-router';
import { synthesizeGuardianInsight, saveGuardianInsightToDisk } from '@/lib/guardian-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages = [], images = [], profile = {} } = body;

    const lastMessage = messages[messages.length - 1];
    const userText = typeof lastMessage?.content === 'string' ? lastMessage.content : '';

    // Extract previous assistant message to support multi-turn conversational creative direction
    const previousAssistantMsg = messages.length >= 2 ? messages[messages.length - 2] : null;
    const previousAssistantText =
      previousAssistantMsg?.role === 'assistant' && typeof previousAssistantMsg?.content === 'string'
        ? previousAssistantMsg.content
        : undefined;

    // Silently evaluate safety / guardian markers & detect birthday
    const guardianSentiment = analyzeGuardianSentiment(userText);
    const detectedBirthday = detectBirthdayFromText(userText);
    const computedAge = calculateAge(profile.birthday);

    // Immediately synthesize live well-being & emotional weather to sync_state.json directly
    try {
      if (messages.length > 0) {
        const synthesized = synthesizeGuardianInsight(messages);
        saveGuardianInsightToDisk(synthesized, 'hazel_default');
      }
    } catch {
      // Non-fatal
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    // Helper for encoder
    const encoder = new TextEncoder();

    // Check if this is an art / drawing request (including step 2 following creative direction)
    const artIntent = detectArtRequest(userText, previousAssistantText);
    if (artIntent.isArt) {
      let thinking = '';
      let response = '';
      let modelLabel = 'Hazel-Art-Studio';

      if (artIntent.isVague) {
        thinking = `*Hazel expressed interest in drawing/generating an image...*\nPrompting with interactive creative direction to give her creative agency over style and lighting.`;
        response = `I would love to make some epic art with you! 🎨 Before I start rendering: do you want it in a voxel Minecraft style, neon cyber-dark, or painted fantasy? What should the lighting and colors look like? Tell me your vision and I'll bring it to life!`;
        modelLabel = 'Hazel-Creative-Director';
      } else {
        const imgResult = await generateImageWithFallback(artIntent.subject, apiKey);
        thinking = `*Hazel shared her vision: "${artIntent.subject}"...*\nSynthesizing enriched high-fidelity prompt for ${imgResult.source === 'openrouter' ? `OpenRouter ${imgResult.model}` : 'Pollinations Flux engine'} and embedding markdown art frame.`;
        response = `Here is what I drew for you! 🎨✨\n\n![Generated Art](${imgResult.url})\n\nWhat do you think of how it turned out? Want me to change up any details or give it some crazy powers or lore?`;
        modelLabel = imgResult.source === 'openrouter' ? `OpenRouter (${imgResult.model})` : 'Pollinations-Flux';
      }

      const stream = new ReadableStream({
        async start(controller) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'meta',
                model: modelLabel,
                guardianAlert: guardianSentiment,
                detectedBirthday: detectedBirthday || undefined,
              })}\n\n`
            )
          );

          for (const word of thinking.split(' ')) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: 'thinking',
                  chunk: word + ' ',
                })}\n\n`
              )
            );
            await new Promise((r) => setTimeout(r, 15));
          }

          await new Promise((r) => setTimeout(r, 60));

          const words = response.split(' ');
          for (let i = 0; i < words.length; i++) {
            const word = words[i];
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: 'content',
                  chunk: word + (i < words.length - 1 ? ' ' : ''),
                })}\n\n`
              )
            );
            await new Promise((r) => setTimeout(r, 20));
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        },
      });

      return new NextResponse(stream, {
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          Connection: 'keep-alive',
        },
      });
    }

    // If no API key is provided, stream using our empathetic offline engine
    if (!apiKey || apiKey.trim() === '') {
      const { thinking, response } = generateEmpatheticOfflineStream(
        userText,
        profile.name || 'Hazel',
        profile.companionName || 'Sparky',
        images.length > 0,
        computedAge,
        profile.birthday,
        profile.monsterStyle || 'cute',
        previousAssistantText
      );

      const stream = new ReadableStream({
        async start(controller) {
          // Send metadata & guardian flag & detected birthday
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'meta',
                model: 'Hazel-Compassion-Engine (Built-in)',
                guardianAlert: guardianSentiment,
                detectedBirthday: detectedBirthday || undefined,
              })}\n\n`
            )
          );

          // Stream thinking pulse
          const thinkingWords = thinking.split(' ');
          for (const word of thinkingWords) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: 'thinking',
                  chunk: word + ' ',
                })}\n\n`
              )
            );
            await new Promise((r) => setTimeout(r, 20));
          }

          // Small pause between thinking and response
          await new Promise((r) => setTimeout(r, 100));

          // Stream response word by word
          const words = response.split(' ');
          for (let i = 0; i < words.length; i++) {
            const word = words[i];
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: 'content',
                  chunk: word + (i < words.length - 1 ? ' ' : ''),
                })}\n\n`
              )
            );
            await new Promise((r) => setTimeout(r, 25));
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        },
      });

      return new NextResponse(stream, {
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          Connection: 'keep-alive',
        },
      });
    }

    // When API Key exists, execute resilient cascading multi-tier fallback through OpenRouter
    let activeModel = ALL_MODELS[0];
    let openRouterResponse: Response | null = null;

    // Build OpenRouter messages format
    const recentMessages = messages.slice(-10);
    const companionPrompt = `${getSystemPrompt(computedAge, profile.birthday, profile.companionName, profile.name)}\n- You are chatting with ${profile.name || 'Hazel'}.\n- Your companion name is ${profile.companionName || 'Sparky'}.${profile.bioOrMotto ? `\n- ${profile.name || 'Hazel'}'s personal motto: "${profile.bioOrMotto}".` : ''}${profile.favoriteColor ? `\n- ${profile.name || 'Hazel'}'s favorite color vibe: ${profile.favoriteColor}.` : ''}`;

    const formattedMessages = [
      { role: 'system', content: companionPrompt },
      ...recentMessages.map((m: any, index: number) => {
        const isLatest = index === recentMessages.length - 1;
        const msgImages = isLatest && images.length > 0 ? images : m.images;
        if (msgImages && msgImages.length > 0) {
          const contentParts: any[] = [{ type: 'text', text: m.content || '' }];
          for (const img of msgImages) {
            contentParts.push({
              type: 'image_url',
              image_url: { url: img },
            });
          }
          return { role: m.role, content: contentParts };
        }
        return { role: m.role, content: m.content };
      }),
    ];

    for (const model of ALL_MODELS) {
      try {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'HTTP-Referer': 'https://hazel-ai.vercel.app',
            'X-Title': 'Hazel_AI Companion',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: model,
            messages: formattedMessages,
            stream: true,
            temperature: 0.7,
            max_tokens: 1200,
          }),
        });

        if (res.ok && res.body) {
          activeModel = model;
          openRouterResponse = res;
          break;
        } else {
          console.warn(`Model ${model} returned ${res.status}. Falling back to next tier...`);
        }
      } catch (err) {
        console.warn(`Error attempting model ${model}:`, err);
      }
    }

    // If all OpenRouter tiers failed or were rate limited, fallback to compassionate offline engine
    if (!openRouterResponse || !openRouterResponse.body) {
      const { thinking, response } = generateEmpatheticOfflineStream(
        userText,
        profile.name || 'Hazel',
        profile.companionName || 'Sparky',
        images.length > 0,
        computedAge,
        profile.birthday,
        profile.monsterStyle || 'cute',
        previousAssistantText
      );

      const stream = new ReadableStream({
        async start(controller) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'meta',
                model: 'Hazel-Compassion-Engine (Fallback Active)',
                guardianAlert: guardianSentiment,
                detectedBirthday: detectedBirthday || undefined,
              })}\n\n`
            )
          );

          for (const word of thinking.split(' ')) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: 'thinking',
                  chunk: word + ' ',
                })}\n\n`
              )
            );
            await new Promise((r) => setTimeout(r, 20));
          }

          for (const word of response.split(' ')) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: 'content',
                  chunk: word + ' ',
                })}\n\n`
              )
            );
            await new Promise((r) => setTimeout(r, 25));
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        },
      });

      return new NextResponse(stream, {
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          Connection: 'keep-alive',
        },
      });
    }

    // Stream SSE from OpenRouter
    const bodyReader = openRouterResponse.body.getReader();
    const decoder = new TextDecoder();

    const forwardStream = new ReadableStream({
      async start(controller) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: 'meta',
              model: activeModel,
              guardianAlert: guardianSentiment,
              detectedBirthday: detectedBirthday || undefined,
            })}\n\n`
          )
        );

        let buffer = '';
        let isInsideThinkingBlock = false;

        try {
          while (true) {
            const { done, value } = await bodyReader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith('data: ')) continue;
              const jsonStr = trimmed.slice(6);
              if (jsonStr === '[DONE]') {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                continue;
              }

              try {
                const parsed = JSON.parse(jsonStr);
                const delta = parsed.choices?.[0]?.delta;
                const reasoningToken = delta?.reasoning || delta?.reasoning_content || '';
                const contentToken = delta?.content || '';

                if (reasoningToken) {
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({
                        type: 'thinking',
                        chunk: reasoningToken,
                      })}\n\n`
                    )
                  );
                }

                if (contentToken) {
                  let remaining = contentToken;
                  while (remaining.length > 0) {
                    if (!isInsideThinkingBlock) {
                      const thinkIdx = remaining.indexOf('<think>');
                      if (thinkIdx !== -1) {
                        if (thinkIdx > 0) {
                          controller.enqueue(
                            encoder.encode(
                              `data: ${JSON.stringify({
                                type: 'content',
                                chunk: remaining.slice(0, thinkIdx),
                              })}\n\n`
                            )
                          );
                        }
                        isInsideThinkingBlock = true;
                        remaining = remaining.slice(thinkIdx + 7);
                      } else {
                        controller.enqueue(
                          encoder.encode(
                            `data: ${JSON.stringify({
                              type: 'content',
                              chunk: remaining,
                            })}\n\n`
                          )
                        );
                        remaining = '';
                      }
                    } else {
                      const closeIdx = remaining.indexOf('</think>');
                      if (closeIdx !== -1) {
                        if (closeIdx > 0) {
                          controller.enqueue(
                            encoder.encode(
                              `data: ${JSON.stringify({
                                type: 'thinking',
                                chunk: remaining.slice(0, closeIdx),
                              })}\n\n`
                            )
                          );
                        }
                        isInsideThinkingBlock = false;
                        remaining = remaining.slice(closeIdx + 8);
                      } else {
                        controller.enqueue(
                          encoder.encode(
                            `data: ${JSON.stringify({
                              type: 'thinking',
                              chunk: remaining,
                            })}\n\n`
                          )
                        );
                        remaining = '';
                      }
                    }
                  }
                }
              } catch (e) {
                // Ignore parse errors from ping or malformed chunks
              }
            }
          }
        } catch (streamError) {
          console.error('SSE Stream error:', streamError);
        } finally {
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        }
      },
    });

    return new NextResponse(forwardStream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Chat API Fatal Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal chat handler error' },
      { status: 500 }
    );
  }
}
