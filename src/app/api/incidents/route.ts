import { NextResponse } from 'next/server';
import { getStoredIncidents, createNewIncident } from '../../../lib/storage';
import { CivicIncident } from '../../../types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ward = searchParams.get('ward');
  const category = searchParams.get('category');
  const severity = searchParams.get('severity');

  let incidents = getStoredIncidents();

  if (ward && ward !== 'all') {
    incidents = incidents.filter((i) => i.ward === Number(ward));
  }
  if (category && category !== 'all') {
    incidents = incidents.filter((i) => i.category === category);
  }
  if (severity && severity !== 'all') {
    incidents = incidents.filter((i) => i.severity === severity);
  }

  return NextResponse.json({
    success: true,
    count: incidents.length,
    incidents
  });
}

export async function POST(request: Request) {
  try {
    const body: CivicIncident = await request.json();

    if (!body.title || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Title and category are required' },
        { status: 400 }
      );
    }

    const created = createNewIncident(body);

    return NextResponse.json(
      {
        success: true,
        incident: created
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
