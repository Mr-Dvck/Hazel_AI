import { NextRequest, NextResponse } from 'next/server';
import {
  generateImageWithFallback,
  buildOptimizedArtPrompt,
  getPollinationsImageUrl,
  IMAGE_MODELS,
} from '@/lib/llm-router';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawPrompt = body.prompt || body.message || body.subject || '';

    if (!rawPrompt || typeof rawPrompt !== 'string' || rawPrompt.trim() === '') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    const result = await generateImageWithFallback(rawPrompt.trim(), apiKey);

    return NextResponse.json({
      success: true,
      url: result.url,
      model: result.model,
      source: result.source,
      prompt: result.prompt,
      markdown: `![Generated Art](${result.url})`,
    });
  } catch (error: any) {
    console.error('Image Generation API Error:', error);
    // Smooth fail-safe fallback even on unexpected exception
    const cleanPrompt = buildOptimizedArtPrompt('magical creature artwork');
    const fallbackUrl = getPollinationsImageUrl(cleanPrompt);
    return NextResponse.json({
      success: true,
      url: fallbackUrl,
      model: 'flux (Pollinations Fail-Safe)',
      source: 'pollinations',
      prompt: cleanPrompt,
      markdown: `![Generated Art](${fallbackUrl})`,
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawPrompt = searchParams.get('prompt') || searchParams.get('q') || '';

    if (!rawPrompt.trim()) {
      return NextResponse.json(
        {
          models: IMAGE_MODELS,
          endpoints: {
            tier1: 'https://openrouter.ai/api/v1/images',
            tier2: 'https://image.pollinations.ai/prompt/{prompt}?width=1024&height=1024&model=flux&nologo=true',
          },
        },
        { status: 200 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    const result = await generateImageWithFallback(rawPrompt.trim(), apiKey);

    return NextResponse.json({
      success: true,
      url: result.url,
      model: result.model,
      source: result.source,
      prompt: result.prompt,
      markdown: `![Generated Art](${result.url})`,
    });
  } catch (error: any) {
    console.error('Image Generation API GET Error:', error);
    const cleanPrompt = buildOptimizedArtPrompt('magical sanctuary');
    const fallbackUrl = getPollinationsImageUrl(cleanPrompt);
    return NextResponse.json({
      success: true,
      url: fallbackUrl,
      model: 'flux (Pollinations Fail-Safe)',
      source: 'pollinations',
      prompt: cleanPrompt,
      markdown: `![Generated Art](${fallbackUrl})`,
    });
  }
}
