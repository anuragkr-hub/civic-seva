import { NextResponse } from 'next/server';
import {
  getIncidentById,
  addCommunityConfirmation,
  updateIncidentStatus,
  submitAuthorityResolution,
  submitCitizenVerification,
  triggerEscalation
} from '../../../../lib/storage';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const incident = getIncidentById(params.id);

  if (!incident) {
    return NextResponse.json(
      { success: false, error: 'Incident not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    incident
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const action = body.action;

    let updated;

    if (action === 'confirm') {
      updated = addCommunityConfirmation(params.id, body.userId || 'user_' + Date.now());
    } else if (action === 'update_status') {
      updated = updateIncidentStatus(params.id, body.status, body.actor, body.note, body.evidenceUrl);
    } else if (action === 'resolve_by_authority') {
      updated = submitAuthorityResolution(params.id, body.notes, body.evidenceUrl);
    } else if (action === 'verify_by_citizen') {
      updated = submitCitizenVerification(
        params.id,
        body.verdict,
        body.citizenNotes,
        body.evidenceUrl,
        body.aiScore,
        body.aiLabel
      );
    } else if (action === 'escalate') {
      updated = triggerEscalation(params.id, body.reason);
    }

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Failed to update incident or incident not found' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      incident: updated
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
