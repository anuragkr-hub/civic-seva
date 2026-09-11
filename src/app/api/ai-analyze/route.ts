import { NextResponse } from 'next/server';
import { analyzeUploadedImage } from '../../../lib/aiEngine';

export async function POST(request: Request) {
  try {
    const { imageHint, userDescription } = await request.json();

    const analysis = analyzeUploadedImage(imageHint || '', userDescription);

    return NextResponse.json({
      success: true,
      analysis
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'AI Inference failed' },
      { status: 500 }
    );
  }
}
