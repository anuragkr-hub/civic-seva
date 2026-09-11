import { Authority, IncidentCategory } from '../types';

export const KOLKATA_AUTHORITIES: Authority[] = [
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

export function routeCategoryToAuthority(category: IncidentCategory): Authority {
  switch (category) {
    case 'pothole':
    case 'road_damage':
    case 'damaged_footpath':
      return KOLKATA_AUTHORITIES[0]; // KMC Roads
    case 'garbage_dump':
    case 'overflowing_waste':
    case 'illegal_dumping':
      return KOLKATA_AUTHORITIES[1]; // KMC SWM
    case 'drainage_blockage':
    case 'waterlogging':
    case 'open_manhole':
      return KOLKATA_AUTHORITIES[2]; // KMC Drainage
    case 'broken_streetlight':
      return KOLKATA_AUTHORITIES[3]; // KMC Lighting
    default:
      return KOLKATA_AUTHORITIES[0]; // Default KMC Roads
  }
}
