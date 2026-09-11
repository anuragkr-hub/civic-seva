const KOLKATA_AUTHORITIES = [
  {
    id: 'auth_kmc_roads',
    name: 'KMC Roads & Asphalt Department',
    department: 'Civil Infrastructure & Roads',
    officialTitle: 'Executive Engineer (Roads Division)',
    wardCoverage: [1, 10, 28, 45, 48, 58, 64, 70, 85, 93, 120],
    email: 'roads.kmc.demo@kolkatamunicipalcorporation.gov.in.demo',
    phone: '+91-33-2286-1000 (Ext 4210)',
    verified: true,
    officeAddress: '5, S.N. Banerjee Road, Kolkata - 700013',
    resolvedCount: 842,
    avgResolutionDays: 3.8
  },
  {
    id: 'auth_kmc_swm',
    name: 'KMC Solid Waste Management Dept (SWM)',
    department: 'Solid Waste & Sanitation',
    officialTitle: 'Chief Municipal Health Officer / DG (SWM)',
    wardCoverage: [1, 10, 28, 45, 48, 58, 64, 70, 85, 93, 120],
    email: 'swm.cleankolkata.demo@kmcgov.in.demo',
    phone: '+91-33-2286-1234 (Ext 5120)',
    verified: true,
    officeAddress: 'KMC Central Municipal Office, Kolkata - 700013',
    resolvedCount: 1290,
    avgResolutionDays: 1.6
  },
  {
    id: 'auth_kmc_drainage',
    name: 'KMC Sewerage & Drainage Department',
    department: 'Drainage & Waterlogging Mitigation',
    officialTitle: 'Director General (Sewerage & Drainage)',
    wardCoverage: [1, 10, 28, 45, 48, 58, 64, 70, 85, 93, 120],
    email: 'drainage.mitigation.demo@kmcgov.in.demo',
    phone: '+91-33-2286-9876',
    verified: true,
    officeAddress: '159, Acharya J.C. Bose Road, Kolkata - 700014',
    resolvedCount: 615,
    avgResolutionDays: 2.9
  },
  {
    id: 'auth_kmc_lighting',
    name: 'KMC Lighting & Electricity Wing',
    department: 'Street Lighting & Urban Power',
    officialTitle: 'Executive Engineer (Lighting Dept)',
    wardCoverage: [1, 10, 28, 45, 48, 58, 64, 70, 85, 93, 120],
    email: 'lighting.grid.demo@kmcgov.in.demo',
    phone: '+91-33-2286-4433',
    verified: true,
    officeAddress: 'KMC Hogg Building, 1 Hogg Street, Kolkata - 700087',
    resolvedCount: 934,
    avgResolutionDays: 2.1
  },
  {
    id: 'auth_kolkata_traffic',
    name: 'Kolkata Police Traffic Department',
    department: 'Urban Mobility & Traffic Safety',
    officialTitle: 'Deputy Commissioner of Police (Traffic)',
    wardCoverage: [1, 10, 28, 45, 48, 58, 64, 70, 85, 93, 120],
    email: 'trafficops.kp.demo@kolkatapolice.gov.in.demo',
    phone: '+91-33-2214-3644',
    verified: true,
    officeAddress: '18, Lalbazar Street, Kolkata - 700001',
    resolvedCount: 420,
    avgResolutionDays: 1.2
  },
  {
    id: 'auth_kmda',
    name: 'Kolkata Metropolitan Development Authority (KMDA)',
    department: 'Flyovers, Bridges & Metropolitan Infra',
    officialTitle: 'Superintending Engineer (Bridges & Heavy Infra)',
    wardCoverage: [1, 10, 28, 45, 48, 58, 64, 70, 85, 93, 120],
    email: 'kmda.infrastructure.demo@wb.gov.in.demo',
    phone: '+91-33-2358-6414',
    verified: true,
    officeAddress: 'Prashasan Bhavan, DD-1, Sector 1, Salt Lake, Kolkata - 700064',
    resolvedCount: 310,
    avgResolutionDays: 6.4
  }
];

const KOLKATA_WARDS = [
  {
    ward: 48,
    borough: 'Borough V',
    locality: 'College Street & Bowbazar',
    majorLandmarks: ['Calcutta University', 'Presidency University', 'Coffee House', 'Medical College'],
    coordinates: { lat: 22.5744, lng: 88.3629 },
    councilorName: 'Smt. Ananya Banerjee'
  },
  {
    ward: 10,
    borough: 'Borough II',
    locality: 'Shyambazar 5-Point & Hatibagan',
    majorLandmarks: ['Netaji Subhash Statue', 'Star Theatre', 'Shyambazar Metro', 'Hatibagan Market'],
    coordinates: { lat: 22.6025, lng: 88.3712 },
    councilorName: 'Sri Subrata Ghosh'
  },
  {
    ward: 64,
    borough: 'Borough VII',
    locality: 'Park Circus 7-Point & Beniapukur',
    majorLandmarks: ['Don Bosco Park Circus', 'Quest Mall', 'Chittaranjan Hospital', 'Lady Brabourne College'],
    coordinates: { lat: 22.5412, lng: 88.3678 },
    councilorName: 'Janab Shamim Ahmed'
  },
  {
    ward: 85,
    borough: 'Borough VIII',
    locality: 'Gariahat & Ballygunge',
    majorLandmarks: ['Gariahat Crossing', 'Pantaloons Corner', 'Ballygunge Railway Station', 'Ekdalia Evergreen'],
    coordinates: { lat: 22.5186, lng: 88.3664 },
    councilorName: 'Smt. Debasree Chatterjee'
  },
  {
    ward: 93,
    borough: 'Borough X',
    locality: 'Jadavpur 8B & Prince Anwar Shah',
    majorLandmarks: ['Jadavpur University', 'South City Mall', 'KPC Medical College'],
    coordinates: { lat: 22.4988, lng: 88.3715 },
    councilorName: 'Sri Pradip Bhattacharya'
  },
  {
    ward: 120,
    borough: 'Borough XIII',
    locality: 'Behala Chowrasta & Diamond Harbour Rd',
    majorLandmarks: ['Behala Chowrasta Tram Depot', 'Blind School', 'Behala Thana'],
    coordinates: { lat: 22.4892, lng: 88.3184 },
    councilorName: 'Sri Sushanta Ghosh'
  }
];

let incidentsCache = [
  {
    id: 'CS-1042',
    category: 'pothole',
    categoryDisplay: 'Critical Road Pothole',
    title: 'Severe Deep Pothole outside Calcutta University Gate',
    description: 'A 2.5ft wide, 8-inch deep crater on College Street tram tracks. Multiple motorbikes have skidded.',
    images: [
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
    ],
    latitude: 22.5744,
    longitude: 88.3629,
    address: '87/1 College Street, Bowbazar, Kolkata - 700073',
    ward: 48,
    borough: 'Borough V',
    nearestLandmark: 'Calcutta University Centenary Building',
    severity: 'critical',
    priorityScore: 91,
    priorityBreakdown: {
      safetyRisk: 30,
      citizenImpact: 24,
      locationSensitivity: 18,
      issueSeverity: 19,
      total: 91,
      factors: ['Proximity to Calcutta University (<100m)', 'Heavy transit corridor', '24 confirmations']
    },
    status: 'in_progress',
    createdAt: '2026-09-08T09:30:00Z',
    updatedAt: '2026-09-10T14:15:00Z',
    reportedBy: { userId: 'usr_suvro_kolkata', userName: 'Suvro Mukherjee', isAnonymous: false },
    responsibleAuthorityId: 'auth_kmc_roads',
    responsibleAuthorityName: 'KMC Roads & Asphalt Department',
    department: 'Civil Infrastructure & Roads',
    affectedCitizenCount: 38,
    confirmationCount: 26,
    confirmedByUserIds: ['usr_1', 'usr_2'],
    escalationCount: 0,
    timeline: [
      { id: 'e1', incidentId: 'CS-1042', status: 'reported', actor: 'Suvro Mukherjee', actorRole: 'citizen', timestamp: '2026-09-08T09:30:00Z', note: 'Reported with photo.' },
      { id: 'e2', incidentId: 'CS-1042', status: 'ai_verified', actor: 'CivicSeva Vision Engine', actorRole: 'system', timestamp: '2026-09-08T09:31:00Z', note: 'AI classified Pothole (94%). Score: 91/100.' },
      { id: 'e3', incidentId: 'CS-1042', status: 'work_started', actor: 'KMC Roads Division', actorRole: 'authority', timestamp: '2026-09-10T14:15:00Z', note: 'Repair gang deployed.' }
    ]
  },
  {
    id: 'CS-1038',
    category: 'open_manhole',
    categoryDisplay: 'Hazardous Open Manhole',
    title: 'Uncovered Underground Sewer Manhole near Shyambazar Metro Gate 3',
    description: 'Concrete lid broke during heavy downpour. 6ft deep open cavity on active pedestrian way.',
    images: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80'
    ],
    latitude: 22.6025,
    longitude: 88.3712,
    address: 'Shyambazar 5-Point Crossing, Ward 10, Kolkata - 700004',
    ward: 10,
    borough: 'Borough II',
    nearestLandmark: 'Shyambazar Metro Gate 3',
    severity: 'critical',
    priorityScore: 97,
    priorityBreakdown: {
      safetyRisk: 30,
      citizenImpact: 29,
      locationSensitivity: 19,
      issueSeverity: 19,
      total: 97,
      factors: ['Fatality hazard for pedestrians', 'Near metro station exit', '41 citizen reports']
    },
    status: 'escalated',
    createdAt: '2026-09-03T18:10:00Z',
    updatedAt: '2026-09-10T08:00:00Z',
    reportedBy: { userId: 'usr_priya_s', userName: 'Priya Sen', isAnonymous: false },
    responsibleAuthorityId: 'auth_kmc_drainage',
    responsibleAuthorityName: 'KMC Sewerage & Drainage Department',
    department: 'Drainage & Waterlogging Mitigation',
    affectedCitizenCount: 74,
    confirmationCount: 52,
    confirmedByUserIds: [],
    escalationCount: 2,
    timeline: [
      { id: 'e10', incidentId: 'CS-1038', status: 'reported', actor: 'Priya Sen', actorRole: 'citizen', timestamp: '2026-09-03T18:10:00Z', note: 'Emergency report logged.' },
      { id: 'e11', incidentId: 'CS-1038', status: 'escalated', actor: 'CivicSeva Escalation Monitor', actorRole: 'system', timestamp: '2026-09-10T08:00:00Z', note: 'Overdue > 7 days. Tier-2 Escalation to Commissioner.' }
    ]
  },
  {
    id: 'CS-1025',
    category: 'garbage_dump',
    categoryDisplay: 'Illegal Overflowing Waste Dump',
    title: 'Accumulated Commercial Waste on Gariahat Footpath',
    description: 'Rotting organic food waste and plastic debris dumped opposite the market.',
    images: [
      'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80'
    ],
    latitude: 22.5186,
    longitude: 88.3664,
    address: 'Rashbehari Avenue, Gariahat Crossing, Ward 85, Kolkata - 700019',
    ward: 85,
    borough: 'Borough VIII',
    nearestLandmark: 'Gariahat Market & Pantaloons Crossing',
    severity: 'high',
    priorityScore: 78,
    priorityBreakdown: {
      safetyRisk: 18,
      citizenImpact: 26,
      locationSensitivity: 16,
      issueSeverity: 18,
      total: 78,
      factors: ['Commercial hub footfall', 'Hygiene hazard']
    },
    status: 'marked_resolved',
    createdAt: '2026-09-06T07:45:00Z',
    updatedAt: '2026-09-11T10:00:00Z',
    reportedBy: { userId: 'usr_rohit_b', userName: 'Rohit Bose', isAnonymous: false },
    responsibleAuthorityId: 'auth_kmc_swm',
    responsibleAuthorityName: 'KMC Solid Waste Management Dept (SWM)',
    department: 'Solid Waste & Sanitation',
    affectedCitizenCount: 45,
    confirmationCount: 31,
    confirmedByUserIds: [],
    escalationCount: 0,
    resolution: {
      markedResolvedAt: '2026-09-11T10:00:00Z',
      authorityEvidenceUrl: 'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80',
      authorityNotes: 'Special night compactor deployed. Area sanitized.',
      citizenVerdict: 'pending',
      aiVerificationScore: 89,
      aiVerificationLabel: 'appears_resolved'
    },
    timeline: [
      { id: 'e20', incidentId: 'CS-1025', status: 'reported', actor: 'Rohit Bose', actorRole: 'citizen', timestamp: '2026-09-06T07:45:00Z', note: 'Dump reported.' },
      { id: 'e21', incidentId: 'CS-1025', status: 'marked_resolved', actor: 'Ward 85 SWM Supervisor', actorRole: 'authority', timestamp: '2026-09-11T10:00:00Z', note: 'Marked resolved. Awaiting citizen verification.' }
    ]
  }
];

function getIncidents() {
  return incidentsCache;
}

function saveIncidents(updated) {
  incidentsCache = updated;
}

module.exports = {
  KOLKATA_AUTHORITIES,
  KOLKATA_WARDS,
  getIncidents,
  saveIncidents
};
