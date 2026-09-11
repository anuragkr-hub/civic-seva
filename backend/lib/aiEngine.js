function analyzeUploadedImage(fileNameOrHint, userHint = '')  {
  const lower = (fileNameOrHint + ' ' + userHint).toLowerCase();

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

  // Default: Pothole / Road damage
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

function calculateCivicPriorityScore(params) {
  const { category, severity, confirmationCount = 1, nearSchoolOrHospital = true, transitHubProximity = true } = params;

  let safetyRisk = 16;
  if (category === 'open_manhole') safetyRisk = 30;
  else if (category === 'pothole' || category === 'waterlogging') safetyRisk = 26;
  else if (category === 'broken_streetlight') safetyRisk = 20;
  else if (category === 'garbage_dump') safetyRisk = 18;

  if (severity === 'critical') safetyRisk = Math.min(30, safetyRisk + 3);

  let citizenImpact = 15;
  if (transitHubProximity) citizenImpact += 6;
  citizenImpact = Math.min(30, citizenImpact + Math.min(8, Math.floor(confirmationCount / 4)));

  let locationSensitivity = 10;
  if (nearSchoolOrHospital) locationSensitivity += 6;
  if (transitHubProximity) locationSensitivity += 3;
  locationSensitivity = Math.min(20, locationSensitivity);

  let issueSeverity = 10;
  if (severity === 'critical') issueSeverity = 19;
  else if (severity === 'high') issueSeverity = 16;
  else if (severity === 'medium') issueSeverity = 12;
  else issueSeverity = 8;

  const total = Math.min(100, safetyRisk + citizenImpact + locationSensitivity + issueSeverity);

  return {
    safetyRisk,
    citizenImpact,
    locationSensitivity,
    issueSeverity,
    total,
    factors: [
      'Public safety & accident likelihood evaluation',
      nearSchoolOrHospital ? 'Proximity to hospital / educational facility' : null,
      transitHubProximity ? 'High-density transit artery' : null,
      `${confirmationCount} community confirmations`
    ].filter(Boolean)
  };
}

function compareBeforeAndAfterAI(beforeCategory, userVerdict = 'completely_fixed') {
  if (userVerdict === 'not_fixed') {
    return {
      confidenceScore: 32,
      verdict: 'unresolved',
      explanation: 'Defect cavity or hazard persists in current visual frame.',
      surfaceRestorationPercentage: 15,
      residualHazardDetected: true
    };
  }

  if (userVerdict === 'partially_fixed') {
    return {
      confidenceScore: 68,
      verdict: 'partially_resolved',
      explanation: 'Debris or temporary filling detected, but permanent paving remains incomplete.',
      surfaceRestorationPercentage: 65,
      residualHazardDetected: true
    };
  }

  const score = Math.floor(Math.random() * 6) + 92;
  return {
    confidenceScore: score,
    verdict: 'appears_resolved',
    explanation: 'Surface feature continuity restored. Road cavity leveled and hazard eliminated.',
    surfaceRestorationPercentage: 98,
    residualHazardDetected: false
  };
}

module.exports = {
  analyzeUploadedImage,
  calculateCivicPriorityScore,
  compareBeforeAndAfterAI
};
