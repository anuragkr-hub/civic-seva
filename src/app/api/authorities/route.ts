import { NextResponse } from 'next/server';
import { KOLKATA_AUTHORITIES } from '../../../data/authorities';

export async function GET() {
  return NextResponse.json({
    success: true,
    count: KOLKATA_AUTHORITIES.length,
    authorities: KOLKATA_AUTHORITIES
  });
}
