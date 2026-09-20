import { AstroTime, SiderealTime } from 'astronomy-engine';
import { PlanetName, ZodiacSign, SanskritSign, BirthDetails, KundaliData } from '../types';
import {
  ZODIAC_SIGNS,
  SANSKRIT_SIGNS,
  SIGN_LORDS,
  NAKSHATRAS,
  deg2rad,
  normalize360,
  calculateLahiriAyanamsha,
} from './vedicCalculations';

export type KpAyanamshaType = 'kp_original' | 'kp_new' | 'lahiri';

export interface KpSubCoordinates {
  longitude: number; // 0-360
  sign: ZodiacSign;
  signIndex: number;
  sanskritSign: SanskritSign;
  signLord: PlanetName;
  degreeInSign: number;
  degStr: string;
  nakshatra: string;
  nakshatraIndex: number; // 0 to 26
  nakshatraLord: PlanetName;
  subLord: PlanetName;
  subSubLord: PlanetName;
  subStartLon: number;
  subEndLon: number;
}

export interface KpCuspInfo {
  houseNumber: number; // 1 to 12
  longitude: number; // 0 to 360
  sign: ZodiacSign;
  signIndex: number;
  sanskritSign: SanskritSign;
  signLord: PlanetName;
  degreeInSign: number;
  degStr: string;
  nakshatra: string;
  starLord: PlanetName;
  subLord: PlanetName;
  subSubLord: PlanetName;
  endLongitude: number;
  spanDeg: number;
  occupants: PlanetName[];
}

export interface KpPlanetInfo {
  name: PlanetName;
  longitude: number;
  degreeInSign: number;
  degStr: string;
  sign: ZodiacSign;
  signLord: PlanetName;
  nakshatra: string;
  nakshatraNumber: number;
  starLord: PlanetName;
  subLord: PlanetName;
  subSubLord: PlanetName;
  kpBhava: number; // 1 to 12 in Placidus
  isRetrograde: boolean;
  isUntenanted: boolean; // Self-significator if no planet is in its star
  signifiesHouses: {
    levelA: number[]; // In star of occupant
    levelB: number[]; // Occupant
    levelC: number[]; // In star of lord
    levelD: number[]; // Lord of house
    all: number[];
  };
}

export interface KpHouseSignificator {
  houseNumber: number;
  levelA: PlanetName[]; // Planets in star of occupants (Strongest)
  levelB: PlanetName[]; // Occupants of house
  levelC: PlanetName[]; // Planets in star of lord of house
  levelD: PlanetName[]; // Lord of house
  allSignificators: PlanetName[];
  cuspSubLord: PlanetName;
  cuspStarLord: PlanetName;
  cuspSignLord: PlanetName;
}

export interface KpRulingPlanets {
  dayLord: PlanetName;
  moonSignLord: PlanetName;
  moonStarLord: PlanetName;
  moonSubLord: PlanetName;
  ascSignLord: PlanetName;
  ascStarLord: PlanetName;
  ascSubLord: PlanetName;
  rahuRepresenting: PlanetName[];
  ketuRepresenting: PlanetName[];
  rulingPlanetsOrdered: {
    planet: PlanetName;
    role: string;
    starLord: PlanetName;
    isStarRetrograde: boolean;
    isPlanetRetrograde: boolean;
    strengthNote: string;
  }[];
  timestamp: string;
}

export interface KpEventEvaluation {
  id: string;
  title: string;
  category: string;
  primaryCusp: number;
  favorableHouses: number[];
  detrimentalHouses: number[];
  facilitatingHouses: number[];
  cuspSubLord: PlanetName;
  subLordStarLord: PlanetName;
  subLordSignifies: number[];
  starLordSignifies: number[];
  status: 'Strongly Promised' | 'Promised with Effort / Delay' | 'Challenging / Denied';
  score: number; // 0 to 100%
  verdict: string;
  classicalReasoning: string[];
  recommendedDbaPlanets: PlanetName[];
}

export interface Kp249Entry {
  seedNumber: number; // 1 to 249
  sign: ZodiacSign;
  signIndex: number;
  signLord: PlanetName;
  nakshatra: string;
  nakshatraIndex: number;
  starLord: PlanetName;
  subLord: PlanetName;
  startLongitude: number;
  endLongitude: number;
  startDegStr: string;
  endDegStr: string;
  spanMinutes: number;
}

// Vimshottari Cycle for Sub & Sub-Sub calculation
export const KP_VIMSHOTTARI_CYCLE: { lord: PlanetName; years: number }[] = [
  { lord: 'Ketu', years: 7 },
  { lord: 'Venus', years: 20 },
  { lord: 'Sun', years: 6 },
  { lord: 'Moon', years: 10 },
  { lord: 'Mars', years: 7 },
  { lord: 'Rahu', years: 18 },
  { lord: 'Jupiter', years: 16 },
  { lord: 'Saturn', years: 19 },
  { lord: 'Mercury', years: 17 },
];

export function formatDegreeDMS(degVal: number): string {
  const norm = normalize360(degVal);
  const signDeg = norm % 30;
  const d = Math.floor(signDeg);
  const m = Math.floor((signDeg - d) * 60);
  const s = Math.round(((signDeg - d) * 60 - m) * 60);
  return `${d}° ${String(m).padStart(2, '0')}' ${String(s).padStart(2, '0')}"`;
}

// Calculate KP Ayanamsha (Original, New, or Lahiri)
export function getKpAyanamsha(jd: number, type: KpAyanamshaType = 'kp_original'): { ayanamsha: number; name: string } {
  const lahiri = calculateLahiriAyanamsha(jd);
  if (type === 'lahiri') {
    return { ayanamsha: lahiri, name: 'Chitrapaksha (Lahiri)' };
  } else if (type === 'kp_original') {
    // Prof. K.S. Krishnamurti Original Ayanamsha is approximately 0° 05' 56" (0.098889°) less than Lahiri
    const kpOrig = lahiri - 0.098889;
    return { ayanamsha: kpOrig, name: 'KP Original (Prof. K.S. Krishnamurti)' };
  } else {
    // KP New Ayanamsha (modern modified) is approx 0° 06' 05" less than Lahiri
    const kpNew = lahiri - 0.101389;
    return { ayanamsha: kpNew, name: 'KP New (Modern Standard)' };
  }
}

// Deconstruct any sidereal longitude into Sign, Star Lord, Sub Lord, Sub-Sub Lord
export function getKpCoordinates(longitude: number): KpSubCoordinates {
  const normLon = normalize360(longitude);
  const signIndex = Math.floor(normLon / 30);
  const sign = ZODIAC_SIGNS[signIndex];
  const sanskritSign = SANSKRIT_SIGNS[signIndex];
  const signLord = SIGN_LORDS[sign];
  const degreeInSign = normLon % 30;

  const nakArc = 360 / 27; // 13° 20' = 13.333333333333334 degrees
  const nakIndex = Math.floor(normLon / nakArc);
  const nakInfo = NAKSHATRAS[nakIndex] || NAKSHATRAS[0];
  const nakStart = nakIndex * nakArc;
  const degInNak = normLon - nakStart;

  const starLordCycleIdx = nakIndex % 9;
  const starLord = KP_VIMSHOTTARI_CYCLE[starLordCycleIdx].lord;

  // Find Sub Lord
  let subStart = nakStart;
  let subLord: PlanetName = starLord;
  let subEnd = nakStart;
  let subArc = 0;

  for (let s = 0; s < 9; s++) {
    const sIdx = (starLordCycleIdx + s) % 9;
    const sInfo = KP_VIMSHOTTARI_CYCLE[sIdx];
    const sDuration = (sInfo.years / 120) * nakArc;
    if (degInNak >= (subStart - nakStart) && degInNak < (subStart - nakStart + sDuration + 1e-9)) {
      subLord = sInfo.lord;
      subEnd = subStart + sDuration;
      subArc = sDuration;
      break;
    }
    subStart += sDuration;
  }

  // Find Sub-Sub Lord (SSL)
  const degInSub = normLon - subStart;
  let sslStart = subStart;
  let subSubLord: PlanetName = subLord;
  const subLordIdx = KP_VIMSHOTTARI_CYCLE.findIndex((v) => v.lord === subLord);

  for (let ss = 0; ss < 9; ss++) {
    const ssIdx = (subLordIdx + ss) % 9;
    const ssInfo = KP_VIMSHOTTARI_CYCLE[ssIdx];
    const ssDuration = (ssInfo.years / 120) * subArc;
    if (degInSub >= (sslStart - subStart) && degInSub < (sslStart - subStart + ssDuration + 1e-9)) {
      subSubLord = ssInfo.lord;
      break;
    }
    sslStart += ssDuration;
  }

  return {
    longitude: normLon,
    sign,
    signIndex,
    sanskritSign,
    signLord,
    degreeInSign,
    degStr: formatDegreeDMS(normLon),
    nakshatra: nakInfo.name,
    nakshatraIndex: nakIndex,
    nakshatraLord: starLord,
    subLord,
    subSubLord,
    subStartLon: subStart,
    subEndLon: subEnd,
  };
}

// Helper: Equatorial coordinates from Ecliptic Longitude
function getRaDec(lonDeg: number, epsDeg: number): { ra: number; deltaDeg: number } {
  const lon = deg2rad(lonDeg);
  const eps = deg2rad(epsDeg);
  const sinDelta = Math.sin(eps) * Math.sin(lon);
  const delta = Math.asin(Math.max(-1, Math.min(1, sinDelta)));
  const ra = normalize360((Math.atan2(Math.sin(lon) * Math.cos(eps), Math.cos(lon)) * 180) / Math.PI);
  return { ra, deltaDeg: (delta * 180) / Math.PI };
}

// Numerical solver for Placidus House Cusps
function solvePlacidusCusp(ramcDeg: number, latDeg: number, epsDeg: number, cuspNumber: 11 | 12 | 2 | 3): number {
  const lat = deg2rad(latDeg);

  const targetAngleDiff = (guessLonDeg: number) => {
    const { ra, deltaDeg } = getRaDec(guessLonDeg, epsDeg);
    const delta = deg2rad(deltaDeg);
    let sinAD = Math.tan(lat) * Math.tan(delta);
    sinAD = Math.max(-0.9999, Math.min(0.9999, sinAD));
    const adDeg = (Math.asin(sinAD) * 180) / Math.PI;
    const sdaDeg = 90 + adDeg; // Semi-diurnal arc
    const snaDeg = 180 - sdaDeg; // Semi-nocturnal arc

    let expectedRA = 0;
    if (cuspNumber === 11) expectedRA = normalize360(ramcDeg + (1 / 3) * sdaDeg);
    else if (cuspNumber === 12) expectedRA = normalize360(ramcDeg + (2 / 3) * sdaDeg);
    else if (cuspNumber === 2) expectedRA = normalize360(ramcDeg + 180 - (2 / 3) * snaDeg);
    else if (cuspNumber === 3) expectedRA = normalize360(ramcDeg + 180 - (1 / 3) * snaDeg);

    let diff = ra - expectedRA;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    return diff;
  };

  // Seed guess
  let guess = normalize360(ramcDeg + (cuspNumber === 11 ? 30 : cuspNumber === 12 ? 60 : cuspNumber === 2 ? 120 : 150));

  for (let i = 0; i < 25; i++) {
    const f = targetAngleDiff(guess);
    if (Math.abs(f) < 1e-7) break;
    const fPlus = targetAngleDiff(guess + 0.001);
    const deriv = (fPlus - f) / 0.001;
    if (Math.abs(deriv) < 1e-9) break;
    guess = normalize360(guess - f / deriv);
  }

  return guess;
}

// Master Function: Calculate 12 Placidus Cusps (Sidereal Nirayana)
export function calculateKpPlacidusCusps(
  time: AstroTime,
  lat: number,
  lon: number,
  ayanamshaDeg: number
): number[] {
  const gmstHours = SiderealTime(time);
  const gmstDeg = normalize360(gmstHours * 15);
  const ramcDeg = normalize360(gmstDeg + lon);
  const T = time.ut / 36525.0;
  const epsDeg = 23.439291 - 0.0130042 * T;

  const ramcRad = deg2rad(ramcDeg);
  const epsRad = deg2rad(epsDeg);
  const latRad = deg2rad(lat);

  // 10th Cusp (MC) Tropical
  const mcTropical = normalize360((Math.atan2(Math.sin(ramcRad), Math.cos(ramcRad) * Math.cos(epsRad)) * 180) / Math.PI);
  // 4th Cusp (IC) Tropical
  const icTropical = normalize360(mcTropical + 180);

  // 1st Cusp (Ascendant) Tropical
  const y = Math.cos(ramcRad);
  const x = -Math.sin(ramcRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad);
  const ascTropical = normalize360((Math.atan2(y, x) * 180) / Math.PI);
  // 7th Cusp (Descendant) Tropical
  const dscTropical = normalize360(ascTropical + 180);

  // Solve Placidus intermediate cusps
  const cusp11Trop = solvePlacidusCusp(ramcDeg, lat, epsDeg, 11);
  const cusp12Trop = solvePlacidusCusp(ramcDeg, lat, epsDeg, 12);
  const cusp2Trop = solvePlacidusCusp(ramcDeg, lat, epsDeg, 2);
  const cusp3Trop = solvePlacidusCusp(ramcDeg, lat, epsDeg, 3);

  const cusp5Trop = normalize360(cusp11Trop + 180);
  const cusp6Trop = normalize360(cusp12Trop + 180);
  const cusp8Trop = normalize360(cusp2Trop + 180);
  const cusp9Trop = normalize360(cusp3Trop + 180);

  const tropicalCusps = [
    ascTropical,   // 1
    cusp2Trop,     // 2
    cusp3Trop,     // 3
    icTropical,    // 4
    cusp5Trop,     // 5
    cusp6Trop,     // 6
    dscTropical,   // 7
    cusp8Trop,     // 8
    cusp9Trop,     // 9
    mcTropical,    // 10
    cusp11Trop,    // 11
    cusp12Trop,    // 12
  ];

  // Convert to Sidereal Nirayana via Ayanamsha
  return tropicalCusps.map((trop) => normalize360(trop - ayanamshaDeg));
}

// Build complete KP 12 Cusps Table with Occupants & Sub-Lords
export function buildKpCuspsTable(
  cuspLongitudes: number[],
  planetPositions: Record<PlanetName, { longitude: number }>
): KpCuspInfo[] {
  const cusps: KpCuspInfo[] = [];

  for (let i = 0; i < 12; i++) {
    const houseNum = i + 1;
    const startLon = cuspLongitudes[i];
    const nextLon = cuspLongitudes[(i + 1) % 12];
    const coords = getKpCoordinates(startLon);

    let span = nextLon - startLon;
    if (span < 0) span += 360;

    cusps.push({
      houseNumber: houseNum,
      longitude: startLon,
      sign: coords.sign,
      signIndex: coords.signIndex,
      sanskritSign: coords.sanskritSign,
      signLord: coords.signLord,
      degreeInSign: coords.degreeInSign,
      degStr: coords.degStr,
      nakshatra: coords.nakshatra,
      starLord: coords.nakshatraLord,
      subLord: coords.subLord,
      subSubLord: coords.subSubLord,
      endLongitude: nextLon,
      spanDeg: span,
      occupants: [],
    });
  }

  // Populate occupants in Placidus Bhavas
  const planetsToTest: PlanetName[] = [
    'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu',
  ];

  for (const pName of planetsToTest) {
    const pLon = planetPositions[pName]?.longitude;
    if (pLon === undefined) continue;

    for (let i = 0; i < 12; i++) {
      const c = cusps[i];
      let inHouse = false;
      if (c.endLongitude > c.longitude) {
        inHouse = pLon >= c.longitude && pLon < c.endLongitude;
      } else {
        // Crosses 0° Aries boundary
        inHouse = pLon >= c.longitude || pLon < c.endLongitude;
      }

      if (inHouse) {
        c.occupants.push(pName);
        break;
      }
    }
  }

  return cusps;
}

// Build Complete KP Planetary Coordinates & Significators Table
export function buildKpPlanetsTable(
  kundali: KundaliData,
  kpCusps: KpCuspInfo[]
): {
  planets: Record<PlanetName, KpPlanetInfo>;
  houseSignificators: Record<number, KpHouseSignificator>;
} {
  const planetKeys: PlanetName[] = [
    'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu', 'Ascendant',
  ];

  const kpPlanetsPartial: Partial<Record<PlanetName, KpPlanetInfo>> = {};

  // 1. First pass: Basic coordinates & KP Bhava
  for (const name of planetKeys) {
    const raw = kundali.planets[name];
    if (!raw) continue;

    const coords = getKpCoordinates(raw.longitude);

    // Find which KP Placidus Bhava this planet occupies
    let bhava = 1;
    for (const c of kpCusps) {
      if (c.occupants.includes(name)) {
        bhava = c.houseNumber;
        break;
      }
    }

    kpPlanetsPartial[name] = {
      name,
      longitude: raw.longitude,
      degreeInSign: coords.degreeInSign,
      degStr: coords.degStr,
      sign: coords.sign,
      signLord: coords.signLord,
      nakshatra: coords.nakshatra,
      nakshatraNumber: coords.nakshatraIndex + 1,
      starLord: coords.nakshatraLord,
      subLord: coords.subLord,
      subSubLord: coords.subSubLord,
      kpBhava: bhava,
      isRetrograde: raw.isRetrograde || false,
      isUntenanted: false, // will update in pass 2
      signifiesHouses: { levelA: [], levelB: [], levelC: [], levelD: [], all: [] },
    };
  }

  const kpPlanets = kpPlanetsPartial as Record<PlanetName, KpPlanetInfo>;

  // 2. Second pass: Untenanted status check
  // A planet is untenanted if no other planet is in its star
  const starOccurrences: Record<PlanetName, number> = {
    Sun: 0, Moon: 0, Mars: 0, Mercury: 0, Jupiter: 0, Venus: 0, Saturn: 0, Rahu: 0, Ketu: 0, Ascendant: 0,
  };

  for (const p of Object.values(kpPlanets)) {
    if (p.name !== 'Ascendant') {
      starOccurrences[p.starLord] = (starOccurrences[p.starLord] || 0) + 1;
    }
  }

  for (const p of Object.values(kpPlanets)) {
    if (p.name !== 'Ascendant') {
      p.isUntenanted = (starOccurrences[p.name] || 0) === 0;
    }
  }

  // 3. Build 4-Fold House Significators (Level A, B, C, D)
  // Level A: Planets in star of an occupant of the house (Strongest)
  // Level B: Occupants of the house
  // Level C: Planets in star of the lord of the house
  // Level D: Lord of the house
  const houseSignificators: Record<number, KpHouseSignificator> = {};

  for (let h = 1; h <= 12; h++) {
    const cusp = kpCusps[h - 1];
    const occupants = cusp.occupants;
    const houseLord = cusp.signLord;

    // Level B: Occupants
    const levelB = [...occupants];

    // Level A: Planets whose starLord is any occupant of this house
    const levelA: PlanetName[] = [];
    for (const p of Object.values(kpPlanets)) {
      if (p.name !== 'Ascendant' && occupants.includes(p.starLord)) {
        if (!levelA.includes(p.name)) levelA.push(p.name);
      }
    }

    // Level D: House Lord
    const levelD: PlanetName[] = [houseLord];

    // Level C: Planets whose starLord is the Lord of this house
    const levelC: PlanetName[] = [];
    for (const p of Object.values(kpPlanets)) {
      if (p.name !== 'Ascendant' && p.starLord === houseLord) {
        if (!levelC.includes(p.name)) levelC.push(p.name);
      }
    }

    const allSigs = Array.from(new Set([...levelA, ...levelB, ...levelC, ...levelD]));

    houseSignificators[h] = {
      houseNumber: h,
      levelA,
      levelB,
      levelC,
      levelD,
      allSignificators: allSigs,
      cuspSubLord: cusp.subLord,
      cuspStarLord: cusp.starLord,
      cuspSignLord: cusp.signLord,
    };
  }

  // 4. Reverse map: Populate signifiesHouses for each planet
  for (const p of Object.values(kpPlanets)) {
    for (let h = 1; h <= 12; h++) {
      const hs = houseSignificators[h];
      if (hs.levelA.includes(p.name)) p.signifiesHouses.levelA.push(h);
      if (hs.levelB.includes(p.name)) p.signifiesHouses.levelB.push(h);
      if (hs.levelC.includes(p.name)) p.signifiesHouses.levelC.push(h);
      if (hs.levelD.includes(p.name)) p.signifiesHouses.levelD.push(h);
    }
    p.signifiesHouses.all = Array.from(
      new Set([
        ...p.signifiesHouses.levelA,
        ...p.signifiesHouses.levelB,
        ...p.signifiesHouses.levelC,
        ...p.signifiesHouses.levelD,
      ])
    ).sort((a, b) => a - b);
  }

  return { planets: kpPlanets, houseSignificators };
}

// Helper to convert BirthDetails to AstroTime with precision
export function getAstroTimeFromBirth(birth: BirthDetails): { astroTime: AstroTime; dateObj: Date } {
  const [yearStr, monthStr, dayStr] = (birth.dateOfBirth || '2013-10-09').split('-');
  const [hourStr, minStr] = (birth.timeOfBirth || '17:12').split(':');
  const year = parseInt(yearStr, 10) || 2013;
  const month = parseInt(monthStr, 10) || 10;
  const day = parseInt(dayStr, 10) || 9;
  const localHours = (parseInt(hourStr, 10) || 0) + (parseInt(minStr, 10) || 0) / 60;
  const tz = birth.timezone !== undefined ? birth.timezone : 5.5;
  const utcHours = localHours - tz;

  const totalUtcMinutes = Math.round(utcHours * 60);
  const utcHour = Math.floor(totalUtcMinutes / 60);
  const utcMin = ((totalUtcMinutes % 60) + 60) % 60;
  const dateObj = new Date(Date.UTC(year, month - 1, day, utcHour, utcMin));
  return { astroTime: new AstroTime(dateObj), dateObj };
}

// Calculate KP Ruling Planets (Natal or Real-Time Transit)
export function calculateRulingPlanets(
  time: AstroTime,
  lat: number,
  lon: number,
  ayanamshaDeg: number,
  dateObj: Date,
  moonLongitude?: number,
  kpPlanets?: Record<PlanetName, KpPlanetInfo>
): KpRulingPlanets {
  const gmstHours = SiderealTime(time);
  const gmstDeg = normalize360(gmstHours * 15);
  const ramcDeg = normalize360(gmstDeg + lon);
  const T = time.ut / 36525.0;
  const epsDeg = 23.439291 - 0.0130042 * T;

  const ramcRad = deg2rad(ramcDeg);
  const epsRad = deg2rad(epsDeg);
  const latRad = deg2rad(lat);

  const y = Math.cos(ramcRad);
  const x = -Math.sin(ramcRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad);
  const ascTropical = normalize360((Math.atan2(y, x) * 180) / Math.PI);
  const ascNirayana = normalize360(ascTropical - ayanamshaDeg);
  const ascCoords = getKpCoordinates(ascNirayana);

  // Day Lord (Vara Lord): Sun=Sun, Mon=Moon, Tue=Mars, Wed=Mercury, Thu=Jupiter, Fri=Venus, Sat=Saturn
  const dayLords: PlanetName[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const dayLord = dayLords[dateObj.getDay()];

  // Moon Coordinates
  const mLong = moonLongitude !== undefined ? moonLongitude : 0;
  const moonCoords = getKpCoordinates(mLong);

  // Check Rahu & Ketu agent representations
  const rahuRepresenting: PlanetName[] = [];
  const ketuRepresenting: PlanetName[] = [];

  if (kpPlanets) {
    const rahuSign = kpPlanets.Rahu?.sign;
    const ketuSign = kpPlanets.Ketu?.sign;
    if (rahuSign) rahuRepresenting.push(SIGN_LORDS[rahuSign]);
    if (ketuSign) ketuRepresenting.push(SIGN_LORDS[ketuSign]);
  }

  // Ordered Ruling Planets per Prof. K.S. Krishnamurti (Asc Star Lord > Asc Sign Lord > Moon Star Lord > Moon Sign Lord > Day Lord)
  const orderedRoles: { planet: PlanetName; role: string }[] = [
    { planet: ascCoords.nakshatraLord, role: 'Ascendant Star Lord (1st Priority)' },
    { planet: ascCoords.signLord, role: 'Ascendant Sign Lord (2nd Priority)' },
    { planet: moonCoords.nakshatraLord, role: 'Moon Star Lord (3rd Priority)' },
    { planet: moonCoords.signLord, role: 'Moon Sign Lord (4th Priority)' },
    { planet: dayLord, role: 'Day Lord (Vara Lord - 5th Priority)' },
  ];

  const rulingPlanetsOrdered = orderedRoles.map((item) => {
    const pInfo = kpPlanets ? kpPlanets[item.planet] : null;
    const starLord = pInfo ? pInfo.starLord : 'Sun';
    const starLordPlanet = kpPlanets ? kpPlanets[starLord] : null;
    const isStarRetrograde = starLordPlanet ? starLordPlanet.isRetrograde : false;
    const isPlanetRetrograde = pInfo ? pInfo.isRetrograde : false;

    let strengthNote = 'Potent & Direct';
    if (isStarRetrograde) {
      strengthNote = 'Star Lord is Retrograde (Delayed / Weakened per KP Rule)';
    } else if (isPlanetRetrograde) {
      strengthNote = 'Planet is Retrograde (Yields result upon becoming Direct)';
    }

    return {
      planet: item.planet,
      role: item.role,
      starLord,
      isStarRetrograde,
      isPlanetRetrograde,
      strengthNote,
    };
  });

  return {
    dayLord,
    moonSignLord: moonCoords.signLord,
    moonStarLord: moonCoords.nakshatraLord,
    moonSubLord: moonCoords.subLord,
    ascSignLord: ascCoords.signLord,
    ascStarLord: ascCoords.nakshatraLord,
    ascSubLord: ascCoords.subLord,
    rahuRepresenting,
    ketuRepresenting,
    rulingPlanetsOrdered,
    timestamp: dateObj.toISOString(),
  };
}

// KP Birth Time Rectification (BTR) Window Calculator
export function calculateBtrWindow(
  birth: BirthDetails,
  ayanamshaDeg: number
): {
  currentAscDegStr: string;
  signLord: PlanetName;
  starLord: PlanetName;
  subLord: PlanetName;
  subSubLord: PlanetName;
  windowStartTime: string;
  windowEndTime: string;
  durationSeconds: number;
  genderRuleVerdict: string;
} {
  const { astroTime } = getAstroTimeFromBirth(birth);
  const gmstHours = SiderealTime(astroTime);
  const gmstDeg = normalize360(gmstHours * 15);
  const ramcDeg = normalize360(gmstDeg + birth.longitude);
  const T = astroTime.ut / 36525.0;
  const epsDeg = 23.439291 - 0.0130042 * T;

  const ramcRad = deg2rad(ramcDeg);
  const epsRad = deg2rad(epsDeg);
  const latRad = deg2rad(birth.latitude);

  const y = Math.cos(ramcRad);
  const x = -Math.sin(ramcRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad);
  const ascTrop = normalize360((Math.atan2(y, x) * 180) / Math.PI);
  const ascNir = normalize360(ascTrop - ayanamshaDeg);
  const currentCoords = getKpCoordinates(ascNir);

  // In Indian latitudes, the ascendant moves ~1 degree in 4 minutes (240 seconds), or 1 arcsecond every 0.067s.
  // Find start and end by stepping backward and forward in 10-second intervals
  const [baseH, baseM] = (birth.timeOfBirth || '12:00').split(':').map((v) => parseInt(v, 10));
  const baseMinutes = baseH * 60 + baseM;

  let startOffsetSec = 0;
  for (let s = 10; s <= 900; s += 10) {
    const testMinutes = baseMinutes - s / 60;
    const testUtcHours = testMinutes / 60 - birth.timezone;
    const [yStr, mStr, dStr] = birth.dateOfBirth.split('-');
    const testDate = new Date(Date.UTC(parseInt(yStr), parseInt(mStr) - 1, parseInt(dStr), Math.floor(testUtcHours), Math.round((testUtcHours % 1) * 60)));
    const testTime = new AstroTime(testDate);
    const tGmst = normalize360(SiderealTime(testTime) * 15);
    const tRamc = normalize360(tGmst + birth.longitude);
    const tY = Math.cos(deg2rad(tRamc));
    const tX = -Math.sin(deg2rad(tRamc)) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad);
    const tAsc = normalize360(normalize360((Math.atan2(tY, tX) * 180) / Math.PI) - ayanamshaDeg);
    const tCoords = getKpCoordinates(tAsc);
    if (tCoords.subLord !== currentCoords.subLord) {
      startOffsetSec = s - 5;
      break;
    }
  }

  let endOffsetSec = 0;
  for (let s = 10; s <= 900; s += 10) {
    const testMinutes = baseMinutes + s / 60;
    const testUtcHours = testMinutes / 60 - birth.timezone;
    const [yStr, mStr, dStr] = birth.dateOfBirth.split('-');
    const testDate = new Date(Date.UTC(parseInt(yStr), parseInt(mStr) - 1, parseInt(dStr), Math.floor(testUtcHours), Math.round((testUtcHours % 1) * 60)));
    const testTime = new AstroTime(testDate);
    const tGmst = normalize360(SiderealTime(testTime) * 15);
    const tRamc = normalize360(tGmst + birth.longitude);
    const tY = Math.cos(deg2rad(tRamc));
    const tX = -Math.sin(deg2rad(tRamc)) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad);
    const tAsc = normalize360(normalize360((Math.atan2(tY, tX) * 180) / Math.PI) - ayanamshaDeg);
    const tCoords = getKpCoordinates(tAsc);
    if (tCoords.subLord !== currentCoords.subLord) {
      endOffsetSec = s - 5;
      break;
    }
  }

  const formatMinSec = (totalSec: number) => {
    const totalM = Math.floor(totalSec / 60);
    const h = Math.floor(totalM / 60) % 24;
    const m = totalM % 60;
    const s = Math.floor(totalSec % 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const startSec = Math.max(0, baseMinutes * 60 - startOffsetSec);
  const endSec = baseMinutes * 60 + endOffsetSec;
  const duration = endSec - startSec;

  // Gender Rule: Odd signs (Aries, Gemini, Leo, Libra, Sagittarius, Aquarius) are Male; Even are Female.
  // Male planets: Sun, Mars, Jupiter; Female planets: Moon, Venus; Neutral/Eunuch: Mercury, Saturn.
  const isOddSign = currentCoords.signIndex % 2 === 0; // 0=Aries (odd)
  const signGender = isOddSign ? 'Male' : 'Female';
  const subLordGender =
    ['Sun', 'Mars', 'Jupiter'].includes(currentCoords.subLord)
      ? 'Male'
      : ['Moon', 'Venus'].includes(currentCoords.subLord)
      ? 'Female'
      : 'Neutral / Dual';

  const genderMatch =
    (birth.gender === 'male' && isOddSign) || (birth.gender === 'female' && !isOddSign)
      ? `High Congruence: Sign (${signGender}) aligns with Native's reported gender (${birth.gender}).`
      : `Sub-Lord (${currentCoords.subLord}, ${subLordGender}) modifies bodily polarization. Inspect Cuspal Sub-Sub-Lord.`;

  return {
    currentAscDegStr: currentCoords.degStr,
    signLord: currentCoords.signLord,
    starLord: currentCoords.nakshatraLord,
    subLord: currentCoords.subLord,
    subSubLord: currentCoords.subSubLord,
    windowStartTime: formatMinSec(startSec),
    windowEndTime: formatMinSec(endSec),
    durationSeconds: duration,
    genderRuleVerdict: genderMatch,
  };
}

// Classical KP Life Events Formulations & Interlinks
export const KP_LIFE_EVENTS_SPECS = [
  {
    id: 'marriage',
    title: 'Marriage & Partnership',
    category: 'Relationship',
    primaryCusp: 7,
    favorableHouses: [2, 7, 11],
    detrimentalHouses: [1, 6, 10],
    facilitatingHouses: [5, 9],
    description: 'Cusp 7 Sub-Lord must signify 2, 7, or 11. If it signifies 1, 6, or 10, obstacles or separation are promised.',
  },
  {
    id: 'career_promotion',
    title: 'Job, Career & Promotion',
    category: 'Profession',
    primaryCusp: 6,
    favorableHouses: [2, 6, 10, 11],
    detrimentalHouses: [5, 9, 12],
    facilitatingHouses: [1, 3],
    description: 'Cusp 6 or 10 Sub-Lord must connect with 2, 6, 10, 11 for lucrative employment, authority, and professional ascent.',
  },
  {
    id: 'wealth_finance',
    title: 'Wealth & Financial Prosperity',
    category: 'Finance',
    primaryCusp: 2,
    favorableHouses: [2, 6, 11],
    detrimentalHouses: [5, 8, 12],
    facilitatingHouses: [1, 10],
    description: 'Cusp 2 Sub-Lord linking to 2, 6, 11 guarantees steady accumulation of assets and financial liquidity.',
  },
  {
    id: 'child_birth',
    title: 'Child Birth & Progeny',
    category: 'Family',
    primaryCusp: 5,
    favorableHouses: [2, 5, 11],
    detrimentalHouses: [1, 4, 10],
    facilitatingHouses: [9],
    description: 'Cusp 5 Sub-Lord must signify 2, 5, or 11. Detrimental houses (1, 4, 10) require medical or spiritual remedies.',
  },
  {
    id: 'education_exams',
    title: 'Higher Education & Competitive Exams',
    category: 'Education',
    primaryCusp: 9,
    favorableHouses: [4, 9, 11, 6],
    detrimentalHouses: [3, 8],
    facilitatingHouses: [1, 2],
    description: 'Cusp 4 (basic) and Cusp 9 (higher) connecting with 11 and 6 brings distinction in competitive qualifications.',
  },
  {
    id: 'foreign_travel',
    title: 'Foreign Travel & Residency',
    category: 'Travel',
    primaryCusp: 12,
    favorableHouses: [3, 9, 12],
    detrimentalHouses: [4, 11],
    facilitatingHouses: [7, 8],
    description: 'Cusp 12 Sub-Lord linking to 3 (relocation), 9 (long journey/visa), and 12 (foreign land) promises overseas life.',
  },
  {
    id: 'property_purchase',
    title: 'Property & Real Estate Purchase',
    category: 'Assets',
    primaryCusp: 4,
    favorableHouses: [4, 11, 12],
    detrimentalHouses: [3, 5],
    facilitatingHouses: [2, 9],
    description: 'Cusp 4 Sub-Lord signifying 4, 11, and 12 (investment/expenditure for acquisition) confirms property ownership.',
  },
  {
    id: 'vehicle_purchase',
    title: 'Vehicle (Conveyance) Purchase',
    category: 'Assets',
    primaryCusp: 4,
    favorableHouses: [4, 11],
    detrimentalHouses: [3, 8],
    facilitatingHouses: [2, 12],
    description: 'Cusp 4 Sub-Lord linked with 4 and 11 indicates vehicle ownership; Venus association enhances luxury.',
  },
  {
    id: 'litigation_dispute',
    title: 'Litigation & Court Disputes',
    category: 'Legal',
    primaryCusp: 6,
    favorableHouses: [6, 11],
    detrimentalHouses: [8, 12],
    facilitatingHouses: [1, 3],
    description: 'Cusp 6 Sub-Lord signifying 6 and 11 ensures victory over adversaries; 8 and 12 indicates fines or compromise.',
  },
  {
    id: 'health_recovery',
    title: 'Health & Illness Recovery',
    category: 'Health',
    primaryCusp: 1,
    favorableHouses: [1, 5, 11],
    detrimentalHouses: [6, 8, 12],
    facilitatingHouses: [2, 10],
    description: 'Cusp 1 Sub-Lord signifying 1, 5, 11 promises rapid recuperation and robust vitality; 6, 8, 12 demands treatment.',
  },
  {
    id: 'lottery_windfall',
    title: 'Speculation, Windfall & Unearned Wealth',
    category: 'Finance',
    primaryCusp: 5,
    favorableHouses: [2, 5, 8, 11],
    detrimentalHouses: [1, 6, 12],
    facilitatingHouses: [9],
    description: 'Cusp 5 (speculation) and 8 (unearned wealth) Sub-Lord signifying 2 and 11 yields windfalls and investment rewards.',
  },
  {
    id: 'spiritual_moksha',
    title: 'Spiritual Awakening & Moksha',
    category: 'Spirituality',
    primaryCusp: 12,
    favorableHouses: [9, 12],
    detrimentalHouses: [2, 7, 11],
    facilitatingHouses: [4, 8],
    description: 'Cusp 12 Sub-Lord linking to 9 (dharma/guru) and 12 (liberation/ashram) brings spiritual elevation.',
  },
];

// Evaluate a KP Life Event using Cuspal Sub-Lord & Significator matrices
export function evaluateKpLifeEvent(
  spec: typeof KP_LIFE_EVENTS_SPECS[0],
  kpCusps: KpCuspInfo[],
  kpPlanets: Record<PlanetName, KpPlanetInfo>
): KpEventEvaluation {
  const cusp = kpCusps[spec.primaryCusp - 1];
  const subLord = cusp.subLord;
  const subLordPlanet = kpPlanets[subLord];

  const starLord = subLordPlanet ? subLordPlanet.starLord : 'Sun';
  const starLordPlanet = kpPlanets[starLord];

  const subLordSignifies = subLordPlanet ? subLordPlanet.signifiesHouses.all : [];
  const starLordSignifies = starLordPlanet ? starLordPlanet.signifiesHouses.all : [];

  const combinedSignifications = Array.from(new Set([...subLordSignifies, ...starLordSignifies]));

  // Calculate matching scores
  let favorableHits = 0;
  let detrimentalHits = 0;

  for (const h of spec.favorableHouses) {
    if (combinedSignifications.includes(h)) favorableHits++;
  }
  for (const h of spec.detrimentalHouses) {
    if (combinedSignifications.includes(h)) detrimentalHits++;
  }

  // Weight favorable vs detrimental
  const totalFav = spec.favorableHouses.length;
  const favRatio = favorableHits / (totalFav || 1);
  const detRatio = detrimentalHits / (spec.detrimentalHouses.length || 1);

  let score = Math.round((favRatio * 75 - detRatio * 35 + 25));
  score = Math.max(10, Math.min(95, score));

  let status: KpEventEvaluation['status'] = 'Promised with Effort / Delay';
  if (score >= 65) status = 'Strongly Promised';
  else if (score < 45) status = 'Challenging / Denied';

  const reasoning: string[] = [
    `Primary Cusp ${spec.primaryCusp} Sub-Lord is ${subLord}, placed in the Star of ${starLord}.`,
    `Sub-Lord ${subLord} signifies House(s): [${subLordSignifies.join(', ') || 'None'}].`,
    `Star Lord ${starLord} signifies House(s): [${starLordSignifies.join(', ') || 'None'}].`,
    `Active Favorable Houses: [${spec.favorableHouses.filter((h) => combinedSignifications.includes(h)).join(', ') || 'None'}].`,
    detrimentalHits > 0
      ? `Active Friction Houses: [${spec.detrimentalHouses.filter((h) => combinedSignifications.includes(h)).join(', ')}].`
      : `No severe detrimental cuspal interference observed.`,
  ];

  // Recommended Dasha-Bhukti-Antara planets
  const fruitfulPlanets = Object.values(kpPlanets)
    .filter((p) => p.name !== 'Ascendant')
    .filter((p) => {
      const sigs = p.signifiesHouses.all;
      return spec.favorableHouses.some((h) => sigs.includes(h));
    })
    .map((p) => p.name);

  return {
    id: spec.id,
    title: spec.title,
    category: spec.category,
    primaryCusp: spec.primaryCusp,
    favorableHouses: spec.favorableHouses,
    detrimentalHouses: spec.detrimentalHouses,
    facilitatingHouses: spec.facilitatingHouses,
    cuspSubLord: subLord,
    subLordStarLord: starLord,
    subLordSignifies,
    starLordSignifies,
    status,
    score,
    verdict:
      status === 'Strongly Promised'
        ? `Event is promised with auspicious ease during DBA periods of ${fruitfulPlanets.slice(0, 3).join(', ')}.`
        : status === 'Promised with Effort / Delay'
        ? `Event is attainable through concerted effort and strategic timing under benefic transits.`
        : `Primary cusp faces resistance from detrimental cusps. Remedial propitiation required.`,
    classicalReasoning: reasoning,
    recommendedDbaPlanets: fruitfulPlanets.slice(0, 4),
  };
}

// Generate the complete 249 KP Sub-Division Table
export function generateKp249Database(): Kp249Entry[] {
  const table: Kp249Entry[] = [];
  let seed = 1;
  const nakArc = 360 / 27; // 13° 20'

  for (let nakIdx = 0; nakIdx < 27; nakIdx++) {
    const nakStart = nakIdx * nakArc;
    const nakName = NAKSHATRAS[nakIdx].name;
    const starLordCycleIdx = nakIdx % 9;
    const starLord = KP_VIMSHOTTARI_CYCLE[starLordCycleIdx].lord;

    let subStart = nakStart;

    for (let subStep = 0; subStep < 9; subStep++) {
      const subLordCycleIdx = (starLordCycleIdx + subStep) % 9;
      const subLordInfo = KP_VIMSHOTTARI_CYCLE[subLordCycleIdx];
      const subDuration = (subLordInfo.years / 120) * nakArc;
      const subEnd = subStart + subDuration;

      const startSign = Math.floor(subStart / 30);
      const endSign = Math.floor(subEnd / 30);

      if (endSign > startSign && subEnd % 30 > 0.00001) {
        // Crosses 30-degree boundary: split
        const boundary = endSign * 30;

        table.push({
          seedNumber: seed++,
          sign: ZODIAC_SIGNS[startSign],
          signIndex: startSign,
          signLord: SIGN_LORDS[ZODIAC_SIGNS[startSign]],
          nakshatra: nakName,
          nakshatraIndex: nakIdx,
          starLord,
          subLord: subLordInfo.lord,
          startLongitude: subStart,
          endLongitude: boundary,
          startDegStr: formatDegreeDMS(subStart),
          endDegStr: formatDegreeDMS(boundary),
          spanMinutes: Math.round((boundary - subStart) * 60),
        });

        table.push({
          seedNumber: seed++,
          sign: ZODIAC_SIGNS[endSign],
          signIndex: endSign,
          signLord: SIGN_LORDS[ZODIAC_SIGNS[endSign]],
          nakshatra: nakName,
          nakshatraIndex: nakIdx,
          starLord,
          subLord: subLordInfo.lord,
          startLongitude: boundary,
          endLongitude: subEnd,
          startDegStr: formatDegreeDMS(boundary),
          endDegStr: formatDegreeDMS(subEnd),
          spanMinutes: Math.round((subEnd - boundary) * 60),
        });
      } else {
        table.push({
          seedNumber: seed++,
          sign: ZODIAC_SIGNS[startSign],
          signIndex: startSign,
          signLord: SIGN_LORDS[ZODIAC_SIGNS[startSign]],
          nakshatra: nakName,
          nakshatraIndex: nakIdx,
          starLord,
          subLord: subLordInfo.lord,
          startLongitude: subStart,
          endLongitude: subEnd,
          startDegStr: formatDegreeDMS(subStart),
          endDegStr: formatDegreeDMS(subEnd),
          spanMinutes: Math.round(subDuration * 60),
        });
      }

      subStart = subEnd;
    }
  }

  return table;
}
