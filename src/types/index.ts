export type UserRole = 'citizen' | 'authority' | 'admin';
export type SupportedLanguage = 'en' | 'bn' | 'hi';

export type IncidentCategory =
  | 'pothole'
  | 'road_damage'
  | 'garbage_dump'
  | 'drainage_blockage'
  | 'waterlogging'
  | 'broken_streetlight'
  | 'damaged_footpath'
  | 'open_manhole'
  | 'overflowing_waste'
  | 'illegal_dumping'
  | 'other';

export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low';

export type IncidentStatus =
  | 'reported'
  | 'ai_verified'
  | 'authority_assigned'
  | 'acknowledged'
  | 'in_progress'
  | 'work_started'
  | 'marked_resolved'
  | 'citizen_verification'
  | 'verified_resolved'
  | 'escalated';

export type VerificationOutcome = 'completely_fixed' | 'partially_fixed' | 'not_fixed' | 'pending';

export interface PriorityBreakdown {
  safetyRisk: number; // out of 30
  citizenImpact: number; // out of 30
  locationSensitivity: number; // out of 20
  issueSeverity: number; // out of 20
  total: number; // out of 100
  factors: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  language: SupportedLanguage;
  ward?: number;
  department?: string;
  password?: string;
  avatar?: string;
}

export interface StatusEvent {
  id: string;
  incidentId: string;
  status: IncidentStatus;
  actor: string;
  actorRole: UserRole | 'system';
  timestamp: string;
  note: string;
  evidenceUrl?: string;
}

export interface OfficialEmail {
  subject: string;
  recipientEmail: string;
  recipientTitle: string;
  department: string;
  body: string;
  generatedAt: string;
  approvedByCitizen: boolean;
  sentAt?: string;
}

export interface ResolutionData {
  markedResolvedAt?: string;
  authorityEvidenceUrl?: string;
  authorityNotes?: string;
  citizenEvidenceUrl?: string;
  citizenNotes?: string;
  aiVerificationScore?: number; // 0-100%
  aiVerificationLabel?: 'appears_resolved' | 'partially_resolved' | 'unresolved';
  aiVerificationConfidence?: number;
  citizenVerdict?: VerificationOutcome;
  verifiedAt?: string;
}

export interface CivicIncident {
  id: string; // e.g. CS-1042
  category: IncidentCategory;
  categoryDisplay: string;
  title: string;
  description: string;
  aiSuggestedDescription?: string;
  images: string[];
  latitude: number;
  longitude: number;
  address: string;
  ward: number;
  borough: string;
  nearestLandmark: string;
  severity: IncidentSeverity;
  priorityScore: number; // 0-100
  priorityBreakdown: PriorityBreakdown;
  status: IncidentStatus;
  createdAt: string;
  updatedAt: string;
  reportedBy: {
    userId: string;
    userName: string;
    isAnonymous: boolean;
  };
  responsibleAuthorityId: string;
  responsibleAuthorityName: string;
  department: string;
  affectedCitizenCount: number;
  confirmationCount: number;
  confirmedByUserIds: string[];
  officialEmail?: OfficialEmail;
  timeline: StatusEvent[];
  resolution?: ResolutionData;
  escalationCount: number;
  lastEscalatedAt?: string;
  isDuplicateOf?: string;
}

export interface Authority {
  id: string;
  name: string;
  department: string;
  officialTitle: string;
  wardCoverage: number[]; // Ward numbers, e.g. [1, 2, ..., 144]
  boroughCoverage?: string[];
  email: string;
  phone: string;
  verified: boolean;
  officeAddress: string;
  resolvedCount: number;
  avgResolutionDays: number;
}

export interface KolkataWardInfo {
  ward: number;
  borough: string;
  boroughRoman: string;
  locality: string;
  majorLandmarks: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  councilorName: string;
  healthUnit: string;
}

export interface DuplicateMatch {
  incident: CivicIncident;
  distanceMeters: number;
  similarityScore: number; // 0-100%
  isNearby: boolean;
}
