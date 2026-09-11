import { KolkataWardInfo } from '../types';

export const KOLKATA_WARDS: KolkataWardInfo[] = [
  {
    ward: 48,
    borough: 'Borough V',
    boroughRoman: 'V',
    locality: 'College Street & Bowbazar',
    majorLandmarks: ['Calcutta University', 'Presidency University', 'Coffee House', 'Medical College'],
    coordinates: { lat: 22.5744, lng: 88.3629 },
    councilorName: 'Smt. Ananya Banerjee',
    healthUnit: 'KMC Ward Health Center V'
  },
  {
    ward: 10,
    borough: 'Borough II',
    boroughRoman: 'II',
    locality: 'Shyambazar 5-Point & Hatibagan',
    majorLandmarks: ['Netaji Subhash Statue', 'Star Theatre', 'Shyambazar Metro', 'Hatibagan Market'],
    coordinates: { lat: 22.6025, lng: 88.3712 },
    councilorName: 'Sri Subrata Ghosh',
    healthUnit: 'KMC Health Clinic II'
  },
  {
    ward: 64,
    borough: 'Borough VII',
    boroughRoman: 'VII',
    locality: 'Park Circus 7-Point & Beniapukur',
    majorLandmarks: ['Don Bosco Park Circus', 'Quest Mall', 'Chittaranjan Hospital', 'Lady Brabourne College'],
    coordinates: { lat: 22.5412, lng: 88.3678 },
    councilorName: 'Janab Shamim Ahmed',
    healthUnit: 'KMC Health Unit VII'
  },
  {
    ward: 85,
    borough: 'Borough VIII',
    boroughRoman: 'VIII',
    locality: 'Gariahat & Ballygunge',
    majorLandmarks: ['Gariahat Crossing', 'Pantaloons Corner', 'Ballygunge Railway Station', 'Ekdalia Evergreen'],
    coordinates: { lat: 22.5186, lng: 88.3664 },
    councilorName: 'Smt. Debasree Chatterjee',
    healthUnit: 'KMC Ward Health Unit VIII'
  },
  {
    ward: 93,
    borough: 'Borough X',
    boroughRoman: 'X',
    locality: 'Jadavpur 8B & Prince Anwar Shah',
    majorLandmarks: ['Jadavpur University', '8B Bus Stand', 'South City Mall', 'KPC Medical College'],
    coordinates: { lat: 22.4988, lng: 88.3715 },
    councilorName: 'Sri Pradip Bhattacharya',
    healthUnit: 'KMC Health Unit X'
  },
  {
    ward: 120,
    borough: 'Borough XIII',
    boroughRoman: 'XIII',
    locality: 'Behala Chowrasta & Diamond Harbour Rd',
    majorLandmarks: ['Behala Chowrasta Tram Depot', 'Blind School', 'Behala Thana', 'Taratala Flyover'],
    coordinates: { lat: 22.4892, lng: 88.3184 },
    councilorName: 'Sri Sushanta Ghosh',
    healthUnit: 'KMC Health Center XIII'
  },
  {
    ward: 45,
    borough: 'Borough V',
    boroughRoman: 'V',
    locality: 'B.B.D. Bagh & Dalhousie',
    majorLandmarks: ['Writers Building', 'GPO Kolkata', 'High Court', 'St. Johns Church'],
    coordinates: { lat: 22.5714, lng: 88.3496 },
    councilorName: 'Sri Santosh Pathak',
    healthUnit: 'Central KMC Unit V'
  },
  {
    ward: 70,
    borough: 'Borough VIII',
    boroughRoman: 'VIII',
    locality: 'Bhawanipur & Ashutosh Mukherjee Rd',
    majorLandmarks: ['Jadu Babus Bazar', 'Ashutosh College', 'Netaji Bhavan Metro', 'Chittaranjan Sishu Sadan'],
    coordinates: { lat: 22.5327, lng: 88.3468 },
    councilorName: 'Sri Ashim Kumar Bose',
    healthUnit: 'KMC Ward Health Clinic VIII'
  },
  {
    ward: 58,
    borough: 'Borough VII',
    boroughRoman: 'VII',
    locality: 'Tangra & Topsia / EM Bypass',
    majorLandmarks: ['Chinatown Tangra', 'Science City Approach', 'Topsia Police Station', 'Milan Mela'],
    coordinates: { lat: 22.5489, lng: 88.3912 },
    councilorName: 'Sri Swapan Samaddar',
    healthUnit: 'KMC Health Unit VII-B'
  },
  {
    ward: 28,
    borough: 'Borough IV',
    boroughRoman: 'IV',
    locality: 'Sealdah & Rajabazar',
    majorLandmarks: ['Sealdah Railway Station', 'NRS Medical College', 'Koley Market', 'Vidyasagar College'],
    coordinates: { lat: 22.5691, lng: 88.3719 },
    councilorName: 'Smt. Swapna Das',
    healthUnit: 'KMC Health Unit IV'
  }
];

export function findNearestWard(lat: number, lng: number): KolkataWardInfo {
  let nearest = KOLKATA_WARDS[0];
  let minDistance = Infinity;

  for (const ward of KOLKATA_WARDS) {
    const d = Math.hypot(ward.coordinates.lat - lat, ward.coordinates.lng - lng);
    if (d < minDistance) {
      minDistance = d;
      nearest = ward;
    }
  }

  return nearest;
}
