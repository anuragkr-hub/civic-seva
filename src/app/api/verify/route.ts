import { NextResponse } from 'next/server';
import { compareBeforeAndAfterAI } from '../../../lib/aiEngine';

export async function POST(request: Request) {
  try {
    const { category, citizenVerdict } = await request.json();

    const comparison = compareBeforeAndAfterAI(category || 'pothole', citizenVerdict);

    return NextResponse.json({
      success: true,
      comparison
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Verification calculation failed' },
      { status: 500 }
    );
  }
}
