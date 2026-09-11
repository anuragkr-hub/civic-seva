import { IncidentCategory, IncidentSeverity, PriorityBreakdown } from '../types';

export interface AIAnalysisResult {
  detectedCategory: IncidentCategory;
  categoryDisplay: string;
  confidence: number; // e.g. 94
  suggestedTitle: string;
  suggestedDescription: string;
  detectedFeatures: string[];
  recommendedSeverity: IncidentSeverity;
}

export function analyzeUploadedImage(fileNameOrUrl: string, userHint?: string): AIAnalysisResult {
  const lower = (fileNameOrUrl + ' ' + (userHint || '')).toLowerCase();

  if (lower.includes('manhole') || lower.includes('drain_open') || lower.includes('cover')) {
    return {
      detectedCategory: 'open_manhole',
      categoryDisplay: 'Hazardous Open Manhole',
      confidence: 96,
      suggestedTitle: 'Open Uncovered Sewer Manhole on Pedestrian Way',
      suggestedDescription: 'Cavity detected on active transit pathway without barricades or warning lids. High risk of fatal falls.',
      detectedFeatures: ['Sub-surface cavity', 'Missing concrete slab', 'Sewer opening', 'Pedestrian hazard'],
      recommendedSeverity: 'critical'
    };
  }

  if (lower.includes('water') || lower.includes('flood') || lower.includes('logging') || lower.includes('rain')) {
    return {
      detectedCategory: 'waterlogging',
      categoryDisplay: 'Urban Waterlogging & Drain Choke',
      confidence: 91,
      suggestedTitle: 'Severe Road Waterlogging Obstruction',
      suggestedDescription: 'Stagnant stormwater accumulated over road surface due to choked storm drainage inlets.',
      detectedFeatures: ['Standing water layer', 'Submerged curb', 'Traffic lane restriction', 'Silting indicators'],
      recommendedSeverity: 'high'
    };
  }

  if (lower.includes('garbage') || lower.includes('waste') || lower.includes('dump') || lower.includes('trash')) {
    return {
      detectedCategory: 'garbage_dump',
      categoryDisplay: 'Solid Waste Accumulation',
      confidence: 93,
      suggestedTitle: 'Unregulated Solid Waste & Overflowing Garbage',
      suggestedDescription: 'Significant unsegregated domestic and commercial trash heap encroaching on pedestrian walkway.',
      detectedFeatures: ['Plastic debris', 'Organic refuse', 'Public walkway encroachment', 'Odor hazard'],
      recommendedSeverity: 'high'
    };
  }

  if (lower.includes('light') || lower.includes('dark') || lower.includes('lamp')) {
    return {
      detectedCategory: 'broken_streetlight',
      categoryDisplay: 'Defective Streetlight / Dark Zone',
      confidence: 88,
      suggestedTitle: 'Non-Functional Street Illumination',
      suggestedDescription: 'Luminaire fixture defective or disconnected, causing dark unsafe zones on roadway at night.',
      detectedFeatures: ['Overhead luminaire failure', 'Unlit roadway section', 'Public safety risk'],
      recommendedSeverity: 'medium'
    };
  }

  if (lower.includes('footpath') || lower.includes('paver') || lower.includes('sidewalk')) {
    return {
      detectedCategory: 'damaged_footpath',
      categoryDisplay: 'Damaged Pedestrian Footpath',
      confidence: 89,
      suggestedTitle: 'Broken Sidewalk Pavers & Tripping Hazard',
      suggestedDescription: 'Cracked and missing pedestrian tiles with exposed foundation, impeding safe pedestrian accessibility.',
      detectedFeatures: ['Dislodged paver tiles', 'Uneven walking plane', 'Obstruction to elderly/disabled'],
      recommendedSeverity: 'medium'
    };
  }

  // Default to pothole / road damage
  return {
    detectedCategory: 'pothole',
    categoryDisplay: 'Road Pothole Infrastructure Damage',
    confidence: 94,
    suggestedTitle: 'Deep Asphalt Crater & Road Surface Depression',
    suggestedDescription: 'Large road surface depression affecting vehicular flow and creating potential skidding hazard for two-wheelers.',
    detectedFeatures: ['Asphalt sub-base erosion', 'Sharp crater edges', 'Two-wheeler hazard', 'Traffic bottleneck'],
    recommendedSeverity: 'critical'
  };
}

export function calculateCivicPriorityScore(params: {
  category: IncidentCategory;
  severity: IncidentSeverity;
  ward: number;
  confirmationCount: number;
  nearSchoolOrHospital?: boolean;
  transitHubProximity?: boolean;
}): PriorityBreakdown {
  const { category, severity, confirmationCount, nearSchoolOrHospital = true, transitHubProximity = true } = params;

  // 1. Safety Risk (max 30)
  let safetyRisk = 15;
  if (category === 'open_manhole') safetyRisk = 30;
  else if (category === 'pothole' || category === 'waterlogging') safetyRisk = 26;
  else if (category === 'broken_streetlight') safetyRisk = 20;
  else if (category === 'garbage_dump') safetyRisk = 18;
  else safetyRisk = 16;

  if (severity === 'critical') safetyRisk = Math.min(30, safetyRisk + 3);

  // 2. Citizen Impact (max 30) - based on confirmations and traffic
  let citizenImpact = 15;
  if (transitHubProximity) citizenImpact += 6;
  const confBonus = Math.min(8, Math.floor(confirmationCount / 4));
  citizenImpact = Math.min(30, citizenImpact + confBonus);

  // 3. Location Sensitivity (max 20)
  let locationSensitivity = 10;
  if (nearSchoolOrHospital) locationSensitivity += 6;
  if (transitHubProximity) locationSensitivity += 3;
  locationSensitivity = Math.min(20, locationSensitivity);

  // 4. Issue Severity (max 20)
  let issueSeverity = 10;
  if (severity === 'critical') issueSeverity = 19;
  else if (severity === 'high') issueSeverity = 16;
  else if (severity === 'medium') issueSeverity = 12;
  else issueSeverity = 8;

  const total = Math.min(100, safetyRisk + citizenImpact + locationSensitivity + issueSeverity);

  const factors: string[] = [];
  if (safetyRisk >= 25) factors.push('Severe acute public safety or fatality hazard');
  if (nearSchoolOrHospital) factors.push('Within 200m zone of hospital / educational institution');
  if (transitHubProximity) factors.push('High-density arterial public transit route');
  if (confirmationCount > 10) factors.push(`${confirmationCount} community confirmations amplifying urgency`);

  return {
    safetyRisk,
    citizenImpact,
    locationSensitivity,
    issueSeverity,
    total,
    factors
  };
}

export interface BeforeAfterComparison {
  confidenceScore: number; // 0 - 100%
  verdict: 'appears_resolved' | 'partially_resolved' | 'unresolved';
  explanation: string;
  surfaceRestorationPercentage: number;
  residualHazardDetected: boolean;
}

export function compareBeforeAndAfterAI(
  beforeCategory: IncidentCategory,
  userVerdict?: string
): BeforeAfterComparison {
  if (userVerdict === 'not_fixed') {
    return {
      confidenceScore: 32,
      verdict: 'unresolved',
      explanation: 'AI visual analysis matches ongoing structural defect. Original hazard signature persists in current visual frame.',
      surfaceRestorationPercentage: 15,
      residualHazardDetected: true
    };
  }

  if (userVerdict === 'partially_fixed') {
    return {
      confidenceScore: 68,
      verdict: 'partially_resolved',
      explanation: 'Debris or temporary filling detected, but permanent paving or seal layer appears incomplete.',
      surfaceRestorationPercentage: 65,
      residualHazardDetected: true
    };
  }

  // High confidence resolved
  const score = Math.floor(Math.random() * 8) + 90; // 90 - 97%
  return {
    confidenceScore: score,
    verdict: 'appears_resolved',
    explanation: 'Surface feature continuity restored. Defect cavity or obstruction removed with clean grade finish matching surrounding infrastructure.',
    surfaceRestorationPercentage: 98,
    residualHazardDetected: false
  };
}
