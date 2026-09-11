import { CivicIncident } from '../types';

export const INITIAL_INCIDENTS: CivicIncident[] = [
  {
    id: 'CS-1042',
    category: 'pothole',
    categoryDisplay: 'Critical Road Pothole',
    title: 'Severe Deep Pothole outside Calcutta University Gate',
    description: 'A 2.5ft wide, 8-inch deep crater has opened up on College Street tram tracks near Gate 1. Multiple motorbikes have skidded and buses are taking abrupt diversions.',
    aiSuggestedDescription: 'Large road surface depression affecting vehicular flow and creating high risk for two-wheelers and pedestrians near educational institution.',
    images: [
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584463699026-62181d5964d8?auto=format&fit=crop&w=800&q=80'
    ],
    latitude: 22.5744,
    longitude: 88.3629,
    address: '87/1 College Street, Bowbazar, Kolkata - 700073',
    ward: 48,
    borough: 'Borough V',
    nearestLandmark: 'Calcutta University Centenary Building & Coffee House',
    severity: 'critical',
    priorityScore: 91,
    priorityBreakdown: {
      safetyRisk: 30,
      citizenImpact: 24,
      locationSensitivity: 18,
      issueSeverity: 19,
      total: 91,
      factors: [
        'Proximity to Calcutta University and Presidency University (<100m)',
        'Heavy public transit corridor (Buses, Trams, Auto-rickshaws)',
        'Reported two-wheeler skidding risk',
        '24 community confirmations logged'
      ]
    },
    status: 'in_progress',
    createdAt: '2026-09-08T09:30:00Z',
    updatedAt: '2026-09-10T14:15:00Z',
    reportedBy: {
      userId: 'usr_suvro_kolkata',
      userName: 'Suvro Mukherjee',
      isAnonymous: false
    },
    responsibleAuthorityId: 'auth_kmc_roads',
    responsibleAuthorityName: 'KMC Roads & Asphalt Department',
    department: 'Civil Infrastructure & Roads',
    affectedCitizenCount: 38,
    confirmationCount: 26,
    confirmedByUserIds: ['usr_1', 'usr_2', 'usr_3', 'usr_4'],
    escalationCount: 0,
    officialEmail: {
      subject: 'Urgent Civic Issue – Critical Road Pothole at College Street (Ward 48)',
      recipientEmail: 'roads.kmc.demo@kolkatamunicipalcorporation.gov.in.demo',
      recipientTitle: 'Executive Engineer (Roads Division)',
      department: 'Civil Infrastructure & Roads',
      body: 'Dear Sir/Madam,\n\nRef: CivicSeva Incident #CS-1042.\n\nA critical road crater with high accident likelihood has been reported at 87/1 College Street, Ward 48 (near Calcutta University). The AI Priority Score is 91/100 with 26 verified citizen confirmations.\n\nImmediate road resurfacing / cold-patch mastic asphalt laying is requested before evening rush hour.\n\nInspection coordinates: 22.5744° N, 88.3629° E.\n\nRespectfully submitted via CivicSeva.',
      generatedAt: '2026-09-08T09:32:00Z',
      approvedByCitizen: true,
      sentAt: '2026-09-08T09:35:00Z'
    },
    timeline: [
      {
        id: 'evt_1',
        incidentId: 'CS-1042',
        status: 'reported',
        actor: 'Suvro Mukherjee',
        actorRole: 'citizen',
        timestamp: '2026-09-08T09:30:00Z',
        note: 'Issue reported with geotagged photo evidence.'
      },
      {
        id: 'evt_2',
        incidentId: 'CS-1042',
        status: 'ai_verified',
        actor: 'CivicSeva Vision Engine',
        actorRole: 'system',
        timestamp: '2026-09-08T09:31:00Z',
        note: 'AI classified as Critical Pothole (Confidence: 94.2%). Priority Score calculated: 91/100.'
      },
      {
        id: 'evt_3',
        incidentId: 'CS-1042',
        status: 'authority_assigned',
        actor: 'CivicSeva Routing Engine',
        actorRole: 'system',
        timestamp: '2026-09-08T09:32:00Z',
        note: 'Assigned to KMC Roads & Asphalt Department (Ward 48 jurisdiction).'
      },
      {
        id: 'evt_4',
        incidentId: 'CS-1042',
        status: 'acknowledged',
        actor: 'Sri A. K. Sengupta (KMC AE)',
        actorRole: 'authority',
        timestamp: '2026-09-09T11:00:00Z',
        note: 'Complaint acknowledged. Inspection team dispatched from KMC Borough V Asphalt depot.'
      },
      {
        id: 'evt_5',
        incidentId: 'CS-1042',
        status: 'work_started',
        actor: 'KMC Roads Division',
        actorRole: 'authority',
        timestamp: '2026-09-10T14:15:00Z',
        note: 'Barricades placed. Mastic asphalt road repair gang scheduled for night execution.'
      }
    ]
  },
  {
    id: 'CS-1038',
    category: 'open_manhole',
    categoryDisplay: 'Hazardous Open Manhole',
    title: 'Uncovered Underground Sewer Manhole near Shyambazar Metro Gate 3',
    description: 'Concrete lid broke during heavy downpour and fell inside. Open drain cavity is approximately 6 feet deep right on the pedestrian footpath corridor.',
    aiSuggestedDescription: 'Hazardous missing sewer cover on active pedestrian sidewalk with severe danger of fatal fall.',
    images: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80'
    ],
    latitude: 22.6025,
    longitude: 88.3712,
    address: 'Shyambazar 5-Point Crossing, Ward 10, Kolkata - 700004',
    ward: 10,
    borough: 'Borough II',
    nearestLandmark: 'Shyambazar Metro Gate 3 & Netaji Equestrian Statue',
    severity: 'critical',
    priorityScore: 97,
    priorityBreakdown: {
      safetyRisk: 30,
      citizenImpact: 29,
      locationSensitivity: 19,
      issueSeverity: 19,
      total: 97,
      factors: [
        'Direct fatality risk for pedestrians and visually impaired citizens',
        'Within 25m of busy Shyambazar Metro Station exit',
        '41 community reports and hazard warnings',
        'Open deep sewage drop'
      ]
    },
    status: 'escalated',
    createdAt: '2026-09-03T18:10:00Z',
    updatedAt: '2026-09-10T08:00:00Z',
    reportedBy: {
      userId: 'usr_priya_s',
      userName: 'Priya Sen',
      isAnonymous: false
    },
    responsibleAuthorityId: 'auth_kmc_drainage',
    responsibleAuthorityName: 'KMC Sewerage & Drainage Department',
    department: 'Drainage & Waterlogging Mitigation',
    affectedCitizenCount: 74,
    confirmationCount: 52,
    confirmedByUserIds: ['usr_5', 'usr_6'],
    escalationCount: 2,
    lastEscalatedAt: '2026-09-10T08:00:00Z',
    timeline: [
      {
        id: 'evt_10',
        incidentId: 'CS-1038',
        status: 'reported',
        actor: 'Priya Sen',
        actorRole: 'citizen',
        timestamp: '2026-09-03T18:10:00Z',
        note: 'Emergency civic report submitted.'
      },
      {
        id: 'evt_11',
        incidentId: 'CS-1038',
        status: 'ai_verified',
        actor: 'CivicSeva Vision Engine',
        actorRole: 'system',
        timestamp: '2026-09-03T18:11:00Z',
        note: 'Extreme hazard identified. Score 97/100 (CRITICAL RED ALERT).'
      },
      {
        id: 'evt_12',
        incidentId: 'CS-1038',
        status: 'escalated',
        actor: 'CivicSeva Escalation Monitor',
        actorRole: 'system',
        timestamp: '2026-09-10T08:00:00Z',
        note: 'Automated Tier-2 Escalation triggered: Unresolved for > 7 days. Escalation notice generated to Chief Municipal Health Officer and KMC Commissioner.'
      }
    ]
  },
  {
    id: 'CS-1025',
    category: 'garbage_dump',
    categoryDisplay: 'Illegal Overflowing Waste Dump',
    title: 'Accumulated Commercial Waste & Garbage Heap on Gariahat Footpath',
    description: 'Rotting organic food waste and plastic debris dumped opposite the market. Blocking pedestrian transit and causing severe odor and stray animal gathering.',
    aiSuggestedDescription: 'Major unsanitary municipal garbage accumulation spreading onto pedestrian corridor.',
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
      factors: [
        'Commercial hub with intense footfall (>50,000 daily commuters)',
        'Public health and hygiene hazard',
        'Roadway narrowing by 1.8 meters'
      ]
    },
    status: 'marked_resolved',
    createdAt: '2026-09-06T07:45:00Z',
    updatedAt: '2026-09-11T10:00:00Z',
    reportedBy: {
      userId: 'usr_rohit_b',
      userName: 'Rohit Bose',
      isAnonymous: false
    },
    responsibleAuthorityId: 'auth_kmc_swm',
    responsibleAuthorityName: 'KMC Solid Waste Management Dept (SWM)',
    department: 'Solid Waste & Sanitation',
    affectedCitizenCount: 45,
    confirmationCount: 31,
    confirmedByUserIds: ['usr_10', 'usr_11'],
    escalationCount: 0,
    resolution: {
      markedResolvedAt: '2026-09-11T10:00:00Z',
      authorityEvidenceUrl: 'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=800&q=80',
      authorityNotes: 'Special night sanitation vehicle deployed. 2.4 metric tonnes of waste lifted, area washed with bleaching powder.',
      citizenVerdict: 'pending',
      aiVerificationScore: 89,
      aiVerificationLabel: 'appears_resolved',
      aiVerificationConfidence: 89
    },
    timeline: [
      {
        id: 'evt_20',
        incidentId: 'CS-1025',
        status: 'reported',
        actor: 'Rohit Bose',
        actorRole: 'citizen',
        timestamp: '2026-09-06T07:45:00Z',
        note: 'Garbage accumulation reported with photo.'
      },
      {
        id: 'evt_21',
        incidentId: 'CS-1025',
        status: 'work_started',
        actor: 'KMC SWM Team Ward 85',
        actorRole: 'authority',
        timestamp: '2026-09-10T22:30:00Z',
        note: 'Compactor truck and mechanical sweeper arrived on site.'
      },
      {
        id: 'evt_22',
        incidentId: 'CS-1025',
        status: 'marked_resolved',
        actor: 'Ward 85 SWM Supervisor',
        actorRole: 'authority',
        timestamp: '2026-09-11T10:00:00Z',
        note: 'Work marked complete. Awaiting citizen verification inspection.'
      }
    ]
  },
  {
    id: 'CS-1019',
    category: 'waterlogging',
    categoryDisplay: 'Waterlogging & Blocked Inlets',
    title: 'Persistent Waterlogging & Submerged Roadway at Park Circus 7-Point',
    description: 'Knee-deep water logging after brief 30-minute rain due to clogged gully pits. Road traffic choked on Suhrawardy Avenue approach.',
    aiSuggestedDescription: 'Significant urban waterlogging obstructing traffic flow due to blocked drainage gullies.',
    images: [
      'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80'
    ],
    latitude: 22.5412,
    longitude: 88.3678,
    address: 'Park Circus 7-Point Crossing, Ward 64, Kolkata - 700017',
    ward: 64,
    borough: 'Borough VII',
    nearestLandmark: 'Lady Brabourne College & Don Bosco School Approach',
    severity: 'high',
    priorityScore: 86,
    priorityBreakdown: {
      safetyRisk: 24,
      citizenImpact: 28,
      locationSensitivity: 18,
      issueSeverity: 16,
      total: 86,
      factors: [
        'Vital hospital arterial route (near Chittaranjan National Hospital)',
        'School bus transit corridor',
        'Stagnant water breeding dengue larvae'
      ]
    },
    status: 'work_started',
    createdAt: '2026-09-09T16:20:00Z',
    updatedAt: '2026-09-11T09:00:00Z',
    reportedBy: {
      userId: 'usr_tariq_a',
      userName: 'Tariq Anwar',
      isAnonymous: false
    },
    responsibleAuthorityId: 'auth_kmc_drainage',
    responsibleAuthorityName: 'KMC Sewerage & Drainage Department',
    department: 'Drainage & Waterlogging Mitigation',
    affectedCitizenCount: 62,
    confirmationCount: 39,
    confirmedByUserIds: ['usr_15'],
    escalationCount: 0,
    timeline: [
      {
        id: 'evt_30',
        incidentId: 'CS-1019',
        status: 'reported',
        actor: 'Tariq Anwar',
        actorRole: 'citizen',
        timestamp: '2026-09-09T16:20:00Z',
        note: 'Reported water logging blocking ambulance lane.'
      },
      {
        id: 'evt_31',
        incidentId: 'CS-1019',
        status: 'work_started',
        actor: 'KMC Drainage Gully Emptier Team',
        actorRole: 'authority',
        timestamp: '2026-09-11T09:00:00Z',
        note: 'High-power suction pumps mobilized to clear silting in drainage chambers.'
      }
    ]
  },
  {
    id: 'CS-1004',
    category: 'broken_streetlight',
    categoryDisplay: 'Dark Zone / Broken Streetlight',
    title: 'Series of 4 Broken LED Streetlights on Diamond Harbour Road',
    description: 'Blacked-out stretch of 120 meters between Taratala and Behala Chowrasta. Creates unsafe conditions for women commuters at night.',
    aiSuggestedDescription: 'Failed urban street illumination creating public safety vulnerability in high-density transit zone.',
    images: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'
    ],
    latitude: 22.4892,
    longitude: 88.3184,
    address: 'Diamond Harbour Road near Tram Depot, Ward 120, Behala, Kolkata - 700034',
    ward: 120,
    borough: 'Borough XIII',
    nearestLandmark: 'Behala Blind School & Taratala Flyover approach',
    severity: 'medium',
    priorityScore: 68,
    priorityBreakdown: {
      safetyRisk: 22,
      citizenImpact: 19,
      locationSensitivity: 14,
      issueSeverity: 13,
      total: 68,
      factors: [
        'Nighttime women pedestrian safety risk',
        'Narrow road section with ongoing metro construction',
        '28 confirmations from local residents'
      ]
    },
    status: 'acknowledged',
    createdAt: '2026-09-07T21:15:00Z',
    updatedAt: '2026-09-09T10:30:00Z',
    reportedBy: {
      userId: 'usr_ananya_m',
      userName: 'Ananya Mitra',
      isAnonymous: false
    },
    responsibleAuthorityId: 'auth_kmc_lighting',
    responsibleAuthorityName: 'KMC Lighting & Electricity Wing',
    department: 'Street Lighting & Urban Power',
    affectedCitizenCount: 31,
    confirmationCount: 22,
    confirmedByUserIds: [],
    escalationCount: 0,
    timeline: [
      {
        id: 'evt_40',
        incidentId: 'CS-1004',
        status: 'reported',
        actor: 'Ananya Mitra',
        actorRole: 'citizen',
        timestamp: '2026-09-07T21:15:00Z',
        note: 'Dark zone reported.'
      },
      {
        id: 'evt_41',
        incidentId: 'CS-1004',
        status: 'acknowledged',
        actor: 'KMC Lighting Inspector Borough XIII',
        actorRole: 'authority',
        timestamp: '2026-09-09T10:30:00Z',
        note: 'Transformer jumper fault identified. Replacement LED driver ordered.'
      }
    ]
  },
  {
    id: 'CS-1050',
    category: 'damaged_footpath',
    categoryDisplay: 'Damaged & Broken Paver Footpath',
    title: 'Dislodged Paver Tiles & Exposed Iron Rebars near Jadavpur 8B',
    description: 'Footpath broken over 40 feet with protruding sharp metal rods and caved-in stone tiles right outside Jadavpur University Gate 4.',
    aiSuggestedDescription: 'Damaged pedestrian sidewalk pavers causing tripping hazard and impeding accessibility.',
    images: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'
    ],
    latitude: 22.4988,
    longitude: 88.3715,
    address: 'Raja S.C. Mallick Road, Ward 93, Jadavpur, Kolkata - 700032',
    ward: 93,
    borough: 'Borough X',
    nearestLandmark: 'Jadavpur 8B Bus Stand & JU Gate 4',
    severity: 'medium',
    priorityScore: 61,
    priorityBreakdown: {
      safetyRisk: 18,
      citizenImpact: 19,
      locationSensitivity: 13,
      issueSeverity: 11,
      total: 61,
      factors: [
        'High student footfall zone',
        'Accessibility obstacle for senior citizens and differently-abled'
      ]
    },
    status: 'verified_resolved',
    createdAt: '2026-08-28T11:00:00Z',
    updatedAt: '2026-09-05T17:30:00Z',
    reportedBy: {
      userId: 'usr_dipanjan_d',
      userName: 'Dipanjan Deb',
      isAnonymous: false
    },
    responsibleAuthorityId: 'auth_kmc_roads',
    responsibleAuthorityName: 'KMC Roads & Asphalt Department',
    department: 'Civil Infrastructure & Roads',
    affectedCitizenCount: 40,
    confirmationCount: 29,
    confirmedByUserIds: [],
    escalationCount: 0,
    resolution: {
      markedResolvedAt: '2026-09-04T12:00:00Z',
      authorityEvidenceUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      authorityNotes: 'Replaced missing paver blocks with high-durability interlock tiles. Leveled walking grade.',
      citizenEvidenceUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      citizenNotes: 'Verified on spot. Footpath is completely smooth and safe to walk on now.',
      citizenVerdict: 'completely_fixed',
      aiVerificationScore: 94,
      aiVerificationLabel: 'appears_resolved',
      aiVerificationConfidence: 94,
      verifiedAt: '2026-09-05T17:30:00Z'
    },
    timeline: [
      {
        id: 'evt_50',
        incidentId: 'CS-1050',
        status: 'reported',
        actor: 'Dipanjan Deb',
        actorRole: 'citizen',
        timestamp: '2026-08-28T11:00:00Z',
        note: 'Footpath damage logged.'
      },
      {
        id: 'evt_51',
        incidentId: 'CS-1050',
        status: 'marked_resolved',
        actor: 'KMC Borough X Civil Engineer',
        actorRole: 'authority',
        timestamp: '2026-09-04T12:00:00Z',
        note: 'Pavers re-laid.'
      },
      {
        id: 'evt_52',
        incidentId: 'CS-1050',
        status: 'verified_resolved',
        actor: 'Dipanjan Deb & 12 Citizens',
        actorRole: 'citizen',
        timestamp: '2026-09-05T17:30:00Z',
        note: 'AI Visual Match 94% + Citizen Verified: Completely Fixed.'
      }
    ]
  }
];
