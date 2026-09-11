import { CivicIncident, DuplicateMatch, IncidentCategory } from '../types';

/**
 * Calculates geodesic distance between two points in meters using the Haversine formula.
 */
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Finds duplicate or nearby incidents within a defined radius (e.g. 250 meters).
 */
export function findNearbyDuplicates(
  incidents: CivicIncident[],
  currentLat: number,
  currentLng: number,
  category: IncidentCategory,
  maxDistanceMeters: number = 250
): DuplicateMatch[] {
  const matches: DuplicateMatch[] = [];

  for (const incident of incidents) {
    // Only compare against active/unresolved incidents
    if (incident.status === 'verified_resolved') continue;

    const distance = calculateDistanceMeters(
      currentLat,
      currentLng,
      incident.latitude,
      incident.longitude
    );

    const isSameCategory = incident.category === category;
    
    // Calculate conceptual similarity (proximity + category weight)
    let similarityScore = 0;
    if (isSameCategory) similarityScore += 50;
    
    // Distance decay: 100m or less = +45 points
    if (distance <= 50) similarityScore += 45;
    else if (distance <= 120) similarityScore += 35;
    else if (distance <= 250) similarityScore += 20;

    if (distance <= maxDistanceMeters || (isSameCategory && distance <= 350)) {
      matches.push({
        incident,
        distanceMeters: distance,
        similarityScore: Math.min(99, similarityScore),
        isNearby: distance <= maxDistanceMeters
      });
    }
  }

  // Sort by highest similarity first, then closest distance
  return matches.sort((a, b) => b.similarityScore - a.similarityScore || a.distanceMeters - b.distanceMeters);
}
