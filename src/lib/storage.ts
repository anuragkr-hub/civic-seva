import { CivicIncident, IncidentStatus, VerificationOutcome } from '../types';
import { INITIAL_INCIDENTS } from '../data/seedIncidents';

const STORAGE_KEY = 'civic_seva_incidents_v1';

// Server-side fallback memory cache
let memoryCache: CivicIncident[] = [...INITIAL_INCIDENTS];

export function getStoredIncidents(): CivicIncident[] {
  if (typeof window === 'undefined') {
    return memoryCache;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INCIDENTS));
      return INITIAL_INCIDENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_INCIDENTS;
  } catch {
    return INITIAL_INCIDENTS;
  }
}

export function saveStoredIncidents(incidents: CivicIncident[]): void {
  memoryCache = incidents;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
      window.dispatchEvent(new Event('civic_data_updated'));
    } catch (e) {
      console.error('Failed to persist to localStorage', e);
    }
  }
}

export function getIncidentById(id: string): CivicIncident | undefined {
  const all = getStoredIncidents();
  return all.find((inc) => inc.id.toLowerCase() === id.toLowerCase());
}

export function createNewIncident(incident: CivicIncident): CivicIncident {
  const all = getStoredIncidents();
  const updated = [incident, ...all];
  saveStoredIncidents(updated);
  return incident;
}

export function addCommunityConfirmation(incidentId: string, userId: string): CivicIncident | undefined {
  const all = getStoredIncidents();
  const index = all.findIndex((i) => i.id.toLowerCase() === incidentId.toLowerCase());
  if (index === -1) return undefined;

  const inc = all[index];
  const userIds = inc.confirmedByUserIds || [];
  if (userIds.includes(userId)) {
    return inc; // Already confirmed
  }

  const newCount = (inc.confirmationCount || 0) + 1;
  const newAffected = (inc.affectedCitizenCount || 0) + 1;
  
  // Bump priority score slightly with each community confirmation
  const currentTotal = inc.priorityScore || 50;
  const updatedScore = Math.min(99, currentTotal + 2);
  const updatedBreakdown = {
    ...inc.priorityBreakdown,
    citizenImpact: Math.min(30, inc.priorityBreakdown.citizenImpact + 2),
    total: updatedScore,
    factors: [
      ...inc.priorityBreakdown.factors.filter(f => !f.includes('community confirmations')),
      `${newCount} verified community confirmations`
    ]
  };

  const updatedIncident: CivicIncident = {
    ...inc,
    confirmationCount: newCount,
    affectedCitizenCount: newAffected,
    confirmedByUserIds: [...userIds, userId],
    priorityScore: updatedScore,
    priorityBreakdown: updatedBreakdown,
    updatedAt: new Date().toISOString(),
    timeline: [
      ...inc.timeline,
      {
        id: 'evt_' + Date.now(),
        incidentId: inc.id,
        status: inc.status,
        actor: 'Citizen Confirmation (' + userId.substring(0, 8) + ')',
        actorRole: 'citizen',
        timestamp: new Date().toISOString(),
        note: 'Community member confirmed this issue on-site ("I’m facing this too"). Urgency increased.'
      }
    ]
  };

  all[index] = updatedIncident;
  saveStoredIncidents(all);
  return updatedIncident;
}

export function updateIncidentStatus(
  incidentId: string,
  newStatus: IncidentStatus,
  actor: string,
  note: string,
  evidenceUrl?: string
): CivicIncident | undefined {
  const all = getStoredIncidents();
  const index = all.findIndex((i) => i.id.toLowerCase() === incidentId.toLowerCase());
  if (index === -1) return undefined;

  const inc = all[index];
  const updated: CivicIncident = {
    ...inc,
    status: newStatus,
    updatedAt: new Date().toISOString(),
    timeline: [
      ...inc.timeline,
      {
        id: 'evt_' + Date.now(),
        incidentId: inc.id,
        status: newStatus,
        actor,
        actorRole: 'authority',
        timestamp: new Date().toISOString(),
        note,
        evidenceUrl
      }
    ]
  };

  all[index] = updated;
  saveStoredIncidents(all);
  return updated;
}

export function submitAuthorityResolution(
  incidentId: string,
  authorityNotes: string,
  evidenceUrl?: string
): CivicIncident | undefined {
  const all = getStoredIncidents();
  const index = all.findIndex((i) => i.id.toLowerCase() === incidentId.toLowerCase());
  if (index === -1) return undefined;

  const inc = all[index];
  const updated: CivicIncident = {
    ...inc,
    status: 'marked_resolved',
    updatedAt: new Date().toISOString(),
    resolution: {
      ...inc.resolution,
      markedResolvedAt: new Date().toISOString(),
      authorityEvidenceUrl: evidenceUrl || 'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80',
      authorityNotes,
      citizenVerdict: 'pending'
    },
    timeline: [
      ...inc.timeline,
      {
        id: 'evt_' + Date.now(),
        incidentId: inc.id,
        status: 'marked_resolved',
        actor: inc.responsibleAuthorityName,
        actorRole: 'authority',
        timestamp: new Date().toISOString(),
        note: 'Authority marked work as completed: ' + authorityNotes + '. Awaiting citizen on-ground verification.',
        evidenceUrl
      }
    ]
  };

  all[index] = updated;
  saveStoredIncidents(all);
  return updated;
}

export function submitCitizenVerification(
  incidentId: string,
  verdict: VerificationOutcome,
  citizenNotes: string,
  citizenEvidenceUrl?: string,
  aiScore: number = 92,
  aiLabel: 'appears_resolved' | 'partially_resolved' | 'unresolved' = 'appears_resolved'
): CivicIncident | undefined {
  const all = getStoredIncidents();
  const index = all.findIndex((i) => i.id.toLowerCase() === incidentId.toLowerCase());
  if (index === -1) return undefined;

  const inc = all[index];
  const isFinalResolved = verdict === 'completely_fixed';

  const updated: CivicIncident = {
    ...inc,
    status: isFinalResolved ? 'verified_resolved' : 'escalated',
    updatedAt: new Date().toISOString(),
    resolution: {
      ...inc.resolution,
      citizenVerdict: verdict,
      citizenNotes,
      citizenEvidenceUrl: citizenEvidenceUrl || inc.images[0],
      aiVerificationScore: aiScore,
      aiVerificationLabel: aiLabel,
      aiVerificationConfidence: aiScore,
      verifiedAt: new Date().toISOString()
    },
    timeline: [
      ...inc.timeline,
      {
        id: 'evt_' + Date.now(),
        incidentId: inc.id,
        status: isFinalResolved ? 'verified_resolved' : 'escalated',
        actor: 'Citizen Ground Inspection',
        actorRole: 'citizen',
        timestamp: new Date().toISOString(),
        note: `Citizen Verification verdict: ${verdict.toUpperCase().replace('_', ' ')}. AI Visual Verification Score: ${aiScore}%. Citizen Feedback: "${citizenNotes}".`
      }
    ]
  };

  all[index] = updated;
  saveStoredIncidents(all);
  return updated;
}

export function triggerEscalation(incidentId: string, citizenReason: string): CivicIncident | undefined {
  const all = getStoredIncidents();
  const index = all.findIndex((i) => i.id.toLowerCase() === incidentId.toLowerCase());
  if (index === -1) return undefined;

  const inc = all[index];
  const newCount = (inc.escalationCount || 0) + 1;

  const updated: CivicIncident = {
    ...inc,
    status: 'escalated',
    escalationCount: newCount,
    lastEscalatedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    timeline: [
      ...inc.timeline,
      {
        id: 'evt_' + Date.now(),
        incidentId: inc.id,
        status: 'escalated',
        actor: 'Citizen Grievance Escalation Officer',
        actorRole: 'citizen',
        timestamp: new Date().toISOString(),
        note: `Tier-${newCount} Escalation triggered: ${citizenReason}. Formal notice dispatched to Municipal Commissioner.`
      }
    ]
  };

  all[index] = updated;
  saveStoredIncidents(all);
  return updated;
}

export function resetDemoIncidents(): void {
  saveStoredIncidents(INITIAL_INCIDENTS);
}
