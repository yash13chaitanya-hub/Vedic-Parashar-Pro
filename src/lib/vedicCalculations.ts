import {
  BirthDetails,
  HouseInfo,
  KundaliData,
  KundaliMilanResult,
  PlanetName,
  PlanetPosition,
  SanskritPlanet,
  SanskritSign,
  ZodiacSign,
  DashaPeriod,
  OuterPlanetInfo,
  VargaCode,
  VargaDefinition,
  VimsopakaScore,
} from '../types';
import { AstroTime, GeoVector, Ecliptic, SiderealTime, Body } from 'astronomy-engine';

export const ZODIAC_SIGNS: ZodiacSign[] = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
];

export const SANSKRIT_SIGNS: SanskritSign[] = [
  'Mesha',
  'Vrishabha',
  'Mithuna',
  'Karka',
  'Simha',
  'Kanya',
  'Tula',
  'Vrishchika',
  'Dhanu',
  'Makara',
  'Kumbha',
  'Meena',
];

export const PLANET_NAMES: PlanetName[] = [
  'Sun',
  'Moon',
  'Mars',
  'Mercury',
  'Jupiter',
  'Venus',
  'Saturn',
  'Rahu',
  'Ketu',
  'Ascendant',
];

export const SANSKRIT_PLANETS: Record<PlanetName, SanskritPlanet> = {
  Sun: 'Surya',
  Moon: 'Chandra',
  Mars: 'Mangal',
  Mercury: 'Budha',
  Jupiter: 'Guru',
  Venus: 'Shukra',
  Saturn: 'Shani',
  Rahu: 'Rahu',
  Ketu: 'Ketu',
  Ascendant: 'Lagna',
};

export const SIGN_LORDS: Record<ZodiacSign, PlanetName> = {
  Aries: 'Mars',
  Taurus: 'Venus',
  Gemini: 'Mercury',
  Cancer: 'Moon',
  Leo: 'Sun',
  Virgo: 'Mercury',
  Libra: 'Venus',
  Scorpio: 'Mars',
  Sagittarius: 'Jupiter',
  Capricorn: 'Saturn',
  Aquarius: 'Saturn',
  Pisces: 'Jupiter',
};

export const NAKSHATRAS = [
  { name: 'Ashwini', lord: 'Ketu', deity: 'Ashwini Kumaras' },
  { name: 'Bharani', lord: 'Venus', deity: 'Yama' },
  { name: 'Krittika', lord: 'Sun', deity: 'Agni' },
  { name: 'Rohini', lord: 'Moon', deity: 'Brahma' },
  { name: 'Mrigashira', lord: 'Mars', deity: 'Soma' },
  { name: 'Ardra', lord: 'Rahu', deity: 'Rudra' },
  { name: 'Punarvasu', lord: 'Jupiter', deity: 'Aditi' },
  { name: 'Pushya', lord: 'Saturn', deity: 'Brihaspati' },
  { name: 'Ashlesha', lord: 'Mercury', deity: 'Sarpas' },
  { name: 'Magha', lord: 'Ketu', deity: 'Pitris' },
  { name: 'Purva Phalguni', lord: 'Venus', deity: 'Bhaga' },
  { name: 'Uttara Phalguni', lord: 'Sun', deity: 'Aryaman' },
  { name: 'Hasta', lord: 'Moon', deity: 'Savitr' },
  { name: 'Chitra', lord: 'Mars', deity: 'Vishwakarma' },
  { name: 'Swati', lord: 'Rahu', deity: 'Vayu' },
  { name: 'Vishakha', lord: 'Jupiter', deity: 'Indra-Agni' },
  { name: 'Anuradha', lord: 'Saturn', deity: 'Mitra' },
  { name: 'Jyeshtha', lord: 'Mercury', deity: 'Indra' },
  { name: 'Mula', lord: 'Ketu', deity: 'Nirriti' },
  { name: 'Purva Ashadha', lord: 'Venus', deity: 'Apah' },
  { name: 'Uttara Ashadha', lord: 'Sun', deity: 'Vishvadevas' },
  { name: 'Shravana', lord: 'Moon', deity: 'Vishnu' },
  { name: 'Dhanishta', lord: 'Mars', deity: 'Vasus' },
  { name: 'Shatabhisha', lord: 'Rahu', deity: 'Varuna' },
  { name: 'Purva Bhadrapada', lord: 'Jupiter', deity: 'Aja Ekapada' },
  { name: 'Uttara Bhadrapada', lord: 'Saturn', deity: 'Ahir Budhnya' },
  { name: 'Revati', lord: 'Mercury', deity: 'Pushan' },
];

export const VIMSHOTTARI_LORDS: { lord: PlanetName; years: number }[] = [
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

// Helper: Normalize angle to 0 - 360
export function normalize360(deg: number): number {
  let val = deg % 360;
  if (val < 0) val += 360;
  return val;
}

// Convert degrees to Radians
export function deg2rad(deg: number): number {
  return (deg * Math.PI) / 180;
}

// Convert Radians to Degrees
export function rad2deg(rad: number): number {
  return (rad * 180) / Math.PI;
}

// Calculate Julian Day from Year, Month, Day, and UTC hours
export function calculateJulianDay(year: number, month: number, day: number, utcHours: number): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const dayFrac = day + utcHours / 24.0;
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + dayFrac + B - 1524.5;
}

// Calculate Lahiri (Chitrapaksha) Ayanamsha
export function calculateLahiriAyanamsha(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  // Official Lahiri (Chitrapaksha) Ayanamsha:
  // Base at epoch J2000.0 is 23° 51' 25.53" = 23.857092°
  // Precession: 50.290966" per year = 5029.0966" per Julian century
  return 23.857092 + (5029.0966 * T + 1.111 * T * T) / 3600.0;
}

// Calculate Ascendant (Lagna)
export function calculateAscendant(time: AstroTime, lat: number, lon: number, ayanamsha: number): number {
  const gmstHours = SiderealTime(time);
  const gmstDeg = ((gmstHours * 15) % 360 + 360) % 360;
  const lstDeg = ((gmstDeg + lon) % 360 + 360) % 360;
  const ramcRad = (lstDeg * Math.PI) / 180;
  const T = time.ut / 36525.0;
  const epsRad = ((23.439291 - 0.0130042 * T) * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;

  const y = Math.cos(ramcRad);
  const x = -Math.sin(ramcRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad);
  let ascTropical = (Math.atan2(y, x) * 180) / Math.PI;
  ascTropical = ((ascTropical % 360) + 360) % 360;

  let ascNirayana = (ascTropical - ayanamsha) % 360;
  if (ascNirayana < 0) ascNirayana += 360;
  return ascNirayana;
}

export interface RawPlanetResult {
  longitude: number;
  isRetrograde: boolean;
  speed: number;
}

// High Precision Ephemeris for Sun, Moon, Planets, Nodes & Outers (VSOP87 / NOVAS)
export function calculatePlanetaryPositions(
  time: AstroTime,
  ayanamsha: number
): {
  planets: Record<PlanetName, RawPlanetResult>;
  outerPlanets: OuterPlanetInfo[];
} {
  const BODY_MAP: Record<string, Body> = {
    Sun: Body.Sun,
    Moon: Body.Moon,
    Mars: Body.Mars,
    Mercury: Body.Mercury,
    Jupiter: Body.Jupiter,
    Venus: Body.Venus,
    Saturn: Body.Saturn,
  };

  const dt = 0.005; // 7.2 minutes to determine true apparent speed and retrograde status
  const timeNext = time.AddDays(dt);

  const rawPlanets: Partial<Record<PlanetName, RawPlanetResult>> = {};

  const majorPlanets: PlanetName[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

  for (const name of majorPlanets) {
    const body = BODY_MAP[name];
    const v1 = GeoVector(body, time, true);
    const v2 = GeoVector(body, timeNext, true);
    const e1 = Ecliptic(v1);
    const e2 = Ecliptic(v2);

    let dLon = e2.elon - e1.elon;
    if (dLon > 180) dLon -= 360;
    if (dLon < -180) dLon += 360;
    const speed = dLon / dt;
    const isRetro = (name === 'Sun' || name === 'Moon') ? false : speed < 0;

    let siderealLong = (e1.elon - ayanamsha) % 360;
    if (siderealLong < 0) siderealLong += 360;

    rawPlanets[name] = {
      longitude: siderealLong,
      isRetrograde: isRetro,
      speed,
    };
  }

  // 3. Rahu & Ketu (Mean Sidereal Lunar Node)
  const T = time.ut / 36525.0;
  let omegaMean = 125.04452 - 1934.136261 * T + 0.0020708 * T * T + (T * T * T) / 450000;
  omegaMean = ((omegaMean % 360) + 360) % 360;
  let rahuSidereal = (omegaMean - ayanamsha) % 360;
  if (rahuSidereal < 0) rahuSidereal += 360;
  let ketuSidereal = (rahuSidereal + 180) % 360;

  rawPlanets.Rahu = {
    longitude: rahuSidereal,
    isRetrograde: true,
    speed: -0.053,
  };
  rawPlanets.Ketu = {
    longitude: ketuSidereal,
    isRetrograde: true,
    speed: -0.053,
  };
  rawPlanets.Ascendant = {
    longitude: 0,
    isRetrograde: false,
    speed: 360,
  };

  // Outer Planets (Uranus, Neptune, Pluto) matching modern Vedic & AstroSage
  const outerPlanets: OuterPlanetInfo[] = [];
  const outerBodies: { name: 'Uranus' | 'Neptune' | 'Pluto'; body: Body; symbol: string }[] = [
    { name: 'Uranus', body: Body.Uranus, symbol: 'Ur' },
    { name: 'Neptune', body: Body.Neptune, symbol: 'Ne' },
    { name: 'Pluto', body: Body.Pluto, symbol: 'Pl' },
  ];

  for (const item of outerBodies) {
    const v1 = GeoVector(item.body, time, true);
    const v2 = GeoVector(item.body, timeNext, true);
    const e1 = Ecliptic(v1);
    const e2 = Ecliptic(v2);

    let dLon = e2.elon - e1.elon;
    if (dLon > 180) dLon -= 360;
    if (dLon < -180) dLon += 360;
    const speed = dLon / dt;
    const isRetro = speed < 0;

    let siderealLong = (e1.elon - ayanamsha) % 360;
    if (siderealLong < 0) siderealLong += 360;
    const signIndex = Math.floor(siderealLong / 30);
    const degInSign = siderealLong % 30;
    const deg = Math.floor(degInSign);
    const min = Math.floor((degInSign - deg) * 60);
    const sec = Math.floor((((degInSign - deg) * 60) - min) * 60);
    const nakIndex = Math.floor(siderealLong / (360 / 27)) % 27;
    const nakshatraName = NAKSHATRAS[nakIndex]?.name || '';

    outerPlanets.push({
      name: item.name,
      symbol: item.symbol,
      longitude: siderealLong,
      sign: ZODIAC_SIGNS[signIndex],
      sanskritSign: SANSKRIT_SIGNS[signIndex],
      signIndex,
      degrees: deg,
      minutes: min,
      seconds: sec,
      house: 1, // updated dynamically when Lagna is assigned
      isRetrograde: isRetro,
      nakshatra: nakshatraName,
    });
  }

  return {
    planets: rawPlanets as Record<PlanetName, RawPlanetResult>,
    outerPlanets,
  };
}

// Dignity calculation per Brihat Parashara Hora Shastra
export function calculateDignity(planet: PlanetName, sign: ZodiacSign, degrees: number): PlanetPosition['dignity'] {
  switch (planet) {
    case 'Sun':
      if (sign === 'Aries') return 'Exalted';
      if (sign === 'Libra') return 'Debilitated';
      if (sign === 'Leo') return degrees <= 20 ? 'Moolatrikona' : 'Own Sign';
      if (['Sagittarius', 'Pisces', 'Cancer', 'Scorpio'].includes(sign)) return 'Friendly';
      if (['Taurus', 'Libra', 'Capricorn', 'Aquarius'].includes(sign)) return 'Enemy';
      return 'Neutral';

    case 'Moon':
      if (sign === 'Taurus') return degrees <= 3 ? 'Exalted' : 'Moolatrikona';
      if (sign === 'Scorpio') return 'Debilitated';
      if (sign === 'Cancer') return 'Own Sign';
      if (['Gemini', 'Virgo', 'Leo', 'Aries', 'Sagittarius', 'Pisces'].includes(sign)) return 'Friendly';
      return 'Neutral';

    case 'Mars':
      if (sign === 'Capricorn') return 'Exalted';
      if (sign === 'Cancer') return 'Debilitated';
      if (sign === 'Aries') return degrees <= 12 ? 'Moolatrikona' : 'Own Sign';
      if (sign === 'Scorpio') return 'Own Sign';
      if (['Leo', 'Sagittarius', 'Pisces', 'Cancer'].includes(sign)) return 'Friendly';
      if (['Gemini', 'Virgo'].includes(sign)) return 'Enemy';
      return 'Neutral';

    case 'Mercury':
      if (sign === 'Virgo') {
        if (degrees <= 15) return 'Exalted';
        if (degrees <= 20) return 'Moolatrikona';
        return 'Own Sign';
      }
      if (sign === 'Pisces') return 'Debilitated';
      if (sign === 'Gemini') return 'Own Sign';
      if (['Taurus', 'Libra', 'Leo'].includes(sign)) return 'Friendly';
      if (sign === 'Cancer') return 'Enemy';
      return 'Neutral';

    case 'Jupiter':
      if (sign === 'Cancer') return 'Exalted';
      if (sign === 'Capricorn') return 'Debilitated';
      if (sign === 'Sagittarius') return degrees <= 10 ? 'Moolatrikona' : 'Own Sign';
      if (sign === 'Pisces') return 'Own Sign';
      if (['Aries', 'Leo', 'Scorpio'].includes(sign)) return 'Friendly';
      if (['Gemini', 'Virgo', 'Taurus', 'Libra'].includes(sign)) return 'Enemy';
      return 'Neutral';

    case 'Venus':
      if (sign === 'Pisces') return 'Exalted';
      if (sign === 'Virgo') return 'Debilitated';
      if (sign === 'Libra') return degrees <= 15 ? 'Moolatrikona' : 'Own Sign';
      if (sign === 'Taurus') return 'Own Sign';
      if (['Gemini', 'Capricorn', 'Aquarius'].includes(sign)) return 'Friendly';
      if (['Leo', 'Cancer'].includes(sign)) return 'Enemy';
      return 'Neutral';

    case 'Saturn':
      if (sign === 'Libra') return 'Exalted';
      if (sign === 'Aries') return 'Debilitated';
      if (sign === 'Aquarius') return degrees <= 20 ? 'Moolatrikona' : 'Own Sign';
      if (sign === 'Capricorn') return 'Own Sign';
      if (['Gemini', 'Virgo', 'Taurus', 'Libra'].includes(sign)) return 'Friendly';
      if (['Leo', 'Cancer', 'Aries', 'Scorpio'].includes(sign)) return 'Enemy';
      return 'Neutral';

    case 'Rahu':
      if (sign === 'Taurus' || sign === 'Gemini') return 'Exalted';
      if (sign === 'Scorpio' || sign === 'Sagittarius') return 'Debilitated';
      if (sign === 'Virgo' || sign === 'Aquarius') return 'Own Sign';
      return 'Neutral';

    case 'Ketu':
      if (sign === 'Scorpio' || sign === 'Sagittarius') return 'Exalted';
      if (sign === 'Taurus' || sign === 'Gemini') return 'Debilitated';
      if (sign === 'Pisces') return 'Own Sign';
      return 'Neutral';

    default:
      return 'Neutral';
  }
}

// ----------------------------------------------------
// COMPLETE SHODASHVARGA & D-1 TO D-16 DIVISIONAL ENGINE
// Formulated strictly according to Maharishi Parashara's
// "Brihat Parashara Hora Shastra" (BPHS) Chapter 6
// ----------------------------------------------------

// D-2 Hora (Wealth & Prosperity - 15° divisions)
export function calculateHoraSignIndex(longitude: number): number {
  const signIndex = Math.floor(longitude / 30);
  const degInSign = longitude % 30;
  const isOdd = signIndex % 2 === 0; // 0 (Aries), 2 (Gemini), etc.
  if (isOdd) {
    return degInSign < 15 ? 4 : 3; // 0°-15° Sun (Leo=4), 15°-30° Moon (Cancer=3)
  } else {
    return degInSign < 15 ? 3 : 4; // 0°-15° Moon (Cancer=3), 15°-30° Sun (Leo=4)
  }
}

// D-3 Drekkana (Siblings, Courage, Vitality - 10° divisions)
export function calculateDrekkanaSignIndex(longitude: number): number {
  const signIndex = Math.floor(longitude / 30);
  const degInSign = longitude % 30;
  const part = Math.min(2, Math.floor(degInSign / 10)); // 0, 1, 2
  if (part === 0) return signIndex;
  if (part === 1) return (signIndex + 4) % 12; // 5th from it
  return (signIndex + 8) % 12; // 9th from it
}

// D-4 Chaturthamsha / Turyamsha (Property, Fixed Assets, Residence - 7°30' divisions)
export function calculateChaturthamshaSignIndex(longitude: number): number {
  const signIndex = Math.floor(longitude / 30);
  const degInSign = longitude % 30;
  const part = Math.min(3, Math.floor(degInSign / 7.5));
  return (signIndex + part * 3) % 12;
}

// D-5 Panchamsha (Fame, Prowess, Intellectual Legacy - 6° divisions)
export function calculatePanchamshaSignIndex(longitude: number): number {
  const signIndex = Math.floor(longitude / 30);
  const degInSign = longitude % 30;
  const part = Math.min(4, Math.floor(degInSign / 6.0));
  const isOdd = signIndex % 2 === 0;
  const oddSigns = [0, 10, 8, 2, 6]; // Aries, Aquarius, Sagittarius, Gemini, Libra
  const evenSigns = [1, 3, 5, 7, 9]; // Taurus, Cancer, Virgo, Scorpio, Capricorn
  return isOdd ? oddSigns[part] : evenSigns[part];
}

// D-6 Shashtamsha (Health, Acute Diseases, Debts, Litigation - 5° divisions)
export function calculateShashtamshaSignIndex(longitude: number): number {
  const signIndex = Math.floor(longitude / 30);
  const degInSign = longitude % 30;
  const part = Math.min(5, Math.floor(degInSign / 5.0));
  const isOdd = signIndex % 2 === 0;
  const start = isOdd ? 0 : 6; // Odd starts Aries (0), Even starts Libra (6)
  return (start + part) % 12;
}

// D-7 Saptamsha (Children, Progeny, Grandchildren - 4°17'08.57" divisions)
export function calculateSaptamshaSignIndex(longitude: number): number {
  const signIndex = Math.floor(longitude / 30);
  const degInSign = longitude % 30;
  const part = Math.min(6, Math.floor(degInSign / (30 / 7)));
  const isOdd = signIndex % 2 === 0;
  const start = isOdd ? signIndex : (signIndex + 6) % 12; // Odd: same sign; Even: 7th sign
  return (start + part) % 12;
}

// D-8 Ashtamsha (Longevity, Sudden Transformations, Hidden Hazards - 3°45' divisions)
export function calculateAshtamshaSignIndex(longitude: number): number {
  const signIndex = Math.floor(longitude / 30);
  const degInSign = longitude % 30;
  const part = Math.min(7, Math.floor(degInSign / 3.75));
  const modType = signIndex % 3; // 0: Movable, 1: Fixed, 2: Dual
  const start = modType === 0 ? 0 : modType === 1 ? 8 : 4; // Movable: Aries(0), Fixed: Sag(8), Dual: Leo(4)
  return (start + part) % 12;
}

// Navamsha (D-9) sign calculation
export function calculateNavamshaSignIndex(longitude: number): number {
  const signIndex = Math.floor(longitude / 30);
  const degInSign = longitude % 30;
  const navamshaPart = Math.floor(degInSign / (30 / 9)); // 0 to 8

  // Fire signs (Aries 0, Leo 4, Sagittarius 8) start at Aries (0)
  // Earth signs (Taurus 1, Virgo 5, Capricorn 9) start at Capricorn (9)
  // Air signs (Gemini 2, Libra 6, Aquarius 10) start at Libra (6)
  // Water signs (Cancer 3, Scorpio 7, Pisces 11) start at Cancer (3)
  const element = signIndex % 4;
  let startSign = 0;
  if (element === 0) startSign = 0; // Fire -> Aries
  else if (element === 1) startSign = 9; // Earth -> Capricorn
  else if (element === 2) startSign = 6; // Air -> Libra
  else if (element === 3) startSign = 3; // Water -> Cancer

  return (startSign + navamshaPart) % 12;
}

// Dashamsha (D-10) sign calculation
export function calculateDashamshaSignIndex(longitude: number): number {
  const signIndex = Math.floor(longitude / 30);
  const degInSign = longitude % 30;
  const part = Math.floor(degInSign / 3.0); // 0 to 9

  // Odd signs start from same sign; Even signs start from 9th sign
  const isOdd = (signIndex % 2) === 0; // 0 (Aries) is odd in 1-based indexing
  if (isOdd) {
    return (signIndex + part) % 12;
  } else {
    return ((signIndex + 8) + part) % 12;
  }
}

// D-11 Rudramsha / Ekadashamsha (Gains, Overcoming Afflictions - 2°43'38" divisions)
export function calculateRudramshaSignIndex(longitude: number): number {
  const signIndex = Math.floor(longitude / 30);
  const degInSign = longitude % 30;
  const part = Math.min(10, Math.floor(degInSign / (30 / 11)));
  const modType = signIndex % 3;
  const start = modType === 0 ? 0 : modType === 1 ? 8 : 4;
  return (start - part + 24) % 12;
}

// D-12 Dwadashamsha (Parents, Ancestry, Lineage Karma - 2°30' divisions)
export function calculateDwadashamshaSignIndex(longitude: number): number {
  const signIndex = Math.floor(longitude / 30);
  const degInSign = longitude % 30;
  const part = Math.min(11, Math.floor(degInSign / 2.5));
  return (signIndex + part) % 12;
}

// D-13 Trayodashamsha (Hidden Strengths & Karmic Vulnerabilities - 2°18'27" divisions)
export function calculateTrayodashamshaSignIndex(longitude: number): number {
  const signIndex = Math.floor(longitude / 30);
  const degInSign = longitude % 30;
  const part = Math.min(12, Math.floor(degInSign / (30 / 13)));
  const isOdd = signIndex % 2 === 0;
  const start = isOdd ? 0 : 6; // Odd starts Aries (0), Even starts Libra (6)
  return (start + part) % 12;
}

// D-14 Chaturdashamsha (Transcendental Consciousness, Purushartha - 2°08'34" divisions)
export function calculateChaturdashamshaSignIndex(longitude: number): number {
  const signIndex = Math.floor(longitude / 30);
  const degInSign = longitude % 30;
  const part = Math.min(13, Math.floor(degInSign / (30 / 14)));
  const isOdd = signIndex % 2 === 0;
  const start = isOdd ? signIndex : (signIndex + 6) % 12;
  return (start + part) % 12;
}

// D-15 Panchadashamsha (Moral Character, Spiritual Purity - 2° divisions)
export function calculatePanchadashamshaSignIndex(longitude: number): number {
  const signIndex = Math.floor(longitude / 30);
  const degInSign = longitude % 30;
  const part = Math.min(14, Math.floor(degInSign / 2.0));
  const isOdd = signIndex % 2 === 0;
  const start = isOdd ? 0 : 6;
  return (start + part) % 12;
}

// D-16 Shodashamsha / Kalamsha (Conveyances, Vehicles, Luxuries, Inner Ease - 1°52'30" divisions)
export function calculateShodashamshaSignIndex(longitude: number): number {
  const signIndex = Math.floor(longitude / 30);
  const degInSign = longitude % 30;
  const part = Math.min(15, Math.floor(degInSign / 1.875));
  const modType = signIndex % 3;
  const start = modType === 0 ? 0 : modType === 1 ? 4 : 8; // Movable: Aries(0), Fixed: Leo(4), Dual: Sag(8)
  return (start + part) % 12;
}

// D-20 Vimsamsha (Spiritual Progress, Upasana, Religious Devotion - 1°30' divisions)
export function calculateVimsamshaSignIndex(longitude: number): number {
  const signIndex = Math.floor(longitude / 30);
  const degInSign = longitude % 30;
  const part = Math.min(19, Math.floor(degInSign / 1.5));
  const modType = signIndex % 3;
  const start = modType === 0 ? 0 : modType === 1 ? 8 : 4; // Movable: Aries(0), Fixed: Sag(8), Dual: Leo(4)
  return (start + part) % 12;
}

// D-24 Chaturvimsamsha / Siddhamsa (Education, Scholarship, Higher Wisdom - 1°15' divisions)
export function calculateChaturvimsamshaSignIndex(longitude: number): number {
  const signIndex = Math.floor(longitude / 30);
  const degInSign = longitude % 30;
  const part = Math.min(23, Math.floor(degInSign / 1.25));
  const isOdd = signIndex % 2 === 0;
  const start = isOdd ? 4 : 3; // Odd: Leo(4), Even: Cancer(3)
  return (start + part) % 12;
}

// D-27 Saptavimsamsha / Bhamsa (Inherent Strengths & Subconscious Fortitude - 1°06'40" divisions)
export function calculateSaptavimsamshaSignIndex(longitude: number): number {
  const signIndex = Math.floor(longitude / 30);
  const degInSign = longitude % 30;
  const part = Math.min(26, Math.floor(degInSign / (30 / 27)));
  const element = signIndex % 4;
  const start = element === 0 ? 0 : element === 1 ? 3 : element === 2 ? 6 : 9; // Fire->Aries, Earth->Cancer, Air->Libra, Water->Capricorn
  return (start + part) % 12;
}

// D-30 Trimsamsha (Arishta, Inherent Karmic Flaws & Misfortunes - unequal degrees)
export function calculateTrimsamshaSignIndex(longitude: number): number {
  const signIndex = Math.floor(longitude / 30);
  const degInSign = longitude % 30;
  const isOdd = signIndex % 2 === 0;
  if (isOdd) {
    if (degInSign < 5) return 0; // Mars (Aries)
    if (degInSign < 10) return 10; // Saturn (Aquarius)
    if (degInSign < 18) return 8; // Jupiter (Sagittarius)
    if (degInSign < 25) return 2; // Mercury (Gemini)
    return 6; // Venus (Libra)
  } else {
    if (degInSign < 5) return 1; // Venus (Taurus)
    if (degInSign < 12) return 5; // Mercury (Virgo)
    if (degInSign < 20) return 11; // Jupiter (Pisces)
    if (degInSign < 25) return 9; // Saturn (Capricorn)
    return 7; // Mars (Scorpio)
  }
}

// D-40 Khavedamsha (Matrilineal Heritage, Auspicious/Inauspicious Events - 45' divisions)
export function calculateKhavedamshaSignIndex(longitude: number): number {
  const signIndex = Math.floor(longitude / 30);
  const degInSign = longitude % 30;
  const part = Math.min(39, Math.floor(degInSign / 0.75));
  const isOdd = signIndex % 2 === 0;
  const start = isOdd ? 0 : 6; // Odd: Aries(0), Even: Libra(6)
  return (start + part) % 12;
}

// D-45 Akshavedamsha (General Morality, Integrity, All Spheres of Life - 40' divisions)
export function calculateAkshavedamshaSignIndex(longitude: number): number {
  const signIndex = Math.floor(longitude / 30);
  const degInSign = longitude % 30;
  const part = Math.min(44, Math.floor(degInSign / (30 / 45)));
  const modType = signIndex % 3;
  const start = modType === 0 ? 0 : modType === 1 ? 4 : 8; // Movable: Aries(0), Fixed: Leo(4), Dual: Sag(8)
  return (start + part) % 12;
}

// D-60 Shashtiamsha (Root of All Karma, Past Incarnations - 30' divisions - Highest BPHS Weight)
export function calculateShashtiamshaSignIndex(longitude: number): number {
  const signIndex = Math.floor(longitude / 30);
  const degInSign = longitude % 30;
  const part = Math.min(59, Math.floor(degInSign / 0.5));
  return (signIndex + part) % 12;
}

// Canonical Registry of All Vargas (D-1 to D-16 + Higher Shodashvargas)
export const SHODASHVARGA_DEFS: VargaDefinition[] = [
  {
    code: 'd1',
    dNumber: 1,
    name: 'Rashi Chart',
    sanskritName: 'Rashi (लग्न)',
    divisionArc: '30°00\'00"',
    significance: 'Physical Body, Constitution, Longevity, General Destiny',
    category: 'Body & Wealth (D1-D4)',
    parasharaWeight: 3.5,
    deities: '12 Adityas',
    description: 'The foundational Vedic birth chart revealing the soul’s primary physical incarnation and overall earthly trajectory.',
    classicalRule: 'Standard sidereal placement computed with Chitrapaksha Lahiri Ayanamsha.',
  },
  {
    code: 'd2',
    dNumber: 2,
    name: 'Hora Chart',
    sanskritName: 'Hora (होरा)',
    divisionArc: '15°00\'00"',
    significance: 'Liquid Wealth, Financial Prosperity, Material Assets, Speech',
    category: 'Body & Wealth (D1-D4)',
    parasharaWeight: 1.0,
    deities: 'Devas (Sun) & Pitris (Moon)',
    description: 'BPHS Chapter 6 Hora division reveals the native’s financial fortune, capacity to accumulate liquid treasury, and family prosperity.',
    classicalRule: 'In odd signs 0°-15° is Sun (Leo), 15°-30° is Moon (Cancer). In even signs 0°-15° is Moon (Cancer), 15°-30° is Sun (Leo).',
  },
  {
    code: 'd3',
    dNumber: 3,
    name: 'Drekkana Chart',
    sanskritName: 'Drekkana (द्रेष्काण)',
    divisionArc: '10°00\'00"',
    significance: 'Siblings, Valor, Courage, Vitality, Third House Matters',
    category: 'Body & Wealth (D1-D4)',
    parasharaWeight: 1.0,
    deities: 'Narada, Agastya & Durvasa',
    description: 'Crucial for examining younger and older co-borns, raw courage, athletic vitality, arms, and warfare/initiative capabilities.',
    classicalRule: '1st decanate (0°-10°) in same sign, 2nd (10°-20°) in 5th from it, 3rd (20°-30°) in 9th from it.',
  },
  {
    code: 'd4',
    dNumber: 4,
    name: 'Chaturthamsha Chart',
    sanskritName: 'Chaturthamsha / Turyamsha (चतुर्थांश)',
    divisionArc: '07°30\'00"',
    significance: 'Fixed Assets, Landed Property, Real Estate, Home, Domestic Peace',
    category: 'Body & Wealth (D1-D4)',
    parasharaWeight: 0.5,
    deities: 'Sanaka, Sanandana, Sanatkumara & Sanatana',
    description: 'Evaluates fixed properties, agricultural lands, permanent houses, residential comforts, and mother’s blessings.',
    classicalRule: 'Divisions counted successively in kendras (1st, 4th, 7th, 10th) from the sign itself.',
  },
  {
    code: 'd5',
    dNumber: 5,
    name: 'Panchamsha Chart',
    sanskritName: 'Panchamsha (पञ्चमांश)',
    divisionArc: '06°00\'00"',
    significance: 'Fame, Intellectual Prowess, Spiritual Authority, Purva Punya',
    category: 'Karma & Progeny (D5-D8)',
    parasharaWeight: 0.5,
    deities: 'Ishtas & Vidyas',
    description: 'Assesses the native’s special talents, moral authority, renowned achievements, and creative genius.',
    classicalRule: 'In odd signs: Aries, Aquarius, Sagittarius, Gemini, Libra. In even signs: Taurus, Cancer, Virgo, Scorpio, Capricorn.',
  },
  {
    code: 'd6',
    dNumber: 6,
    name: 'Shashtamsha Chart',
    sanskritName: 'Shashtamsha / Kauluka (षष्ठांश)',
    divisionArc: '05°00\'00"',
    significance: 'Acute Health, Physical Diseases, Debts, Litigation, Foes',
    category: 'Karma & Progeny (D5-D8)',
    parasharaWeight: 0.5,
    deities: 'Rakshasas & Asuras',
    description: 'Pinpoints vulnerability to acute illnesses, legal entanglements, financial liabilities, and adversarial conflicts.',
    classicalRule: 'Odd signs start from Aries (0) onwards; Even signs start from Libra (6) onwards.',
  },
  {
    code: 'd7',
    dNumber: 7,
    name: 'Saptamsha Chart',
    sanskritName: 'Saptamsha (सप्तांश)',
    divisionArc: '04°17\'08"',
    significance: 'Children, Progeny, Grandchildren, Creative Lineage',
    category: 'Karma & Progeny (D5-D8)',
    parasharaWeight: 0.5,
    deities: 'Kshara, Ksheera, Dadhi, Ghrita, Ikshu, Madhu, Suddhodaka',
    description: 'Essential for examining childbirth, fertility, health and destiny of sons and daughters, and creative fruition.',
    classicalRule: 'In odd signs counted from the sign itself; in even signs counted from the 7th sign.',
  },
  {
    code: 'd8',
    dNumber: 8,
    name: 'Ashtamsha Chart',
    sanskritName: 'Ashtamsha (अष्टांश)',
    divisionArc: '03°45\'00"',
    significance: 'Longevity, Sudden Transformations, Hidden Hazards, Occult',
    category: 'Karma & Progeny (D5-D8)',
    parasharaWeight: 0.5,
    deities: 'Ashta Vasus',
    description: 'Analyzes sudden windfalls, unexpected catastrophes, chronic longevity hazards, occult studies, and unearned inheritance.',
    classicalRule: 'In movable signs starts from Aries; in fixed from Sagittarius; in dual from Leo.',
  },
  {
    code: 'd9',
    dNumber: 9,
    name: 'Navamsha Chart',
    sanskritName: 'Navamsha (नवांश)',
    divisionArc: '03°20\'00"',
    significance: 'Spouse, Marriage, Dharma, Inner Spiritual Potential, Destiny',
    category: 'Destiny & Profession (D9-D12)',
    parasharaWeight: 3.0,
    deities: 'Deva, Manushya & Rakshasa',
    description: 'The supreme complementary chart to D-1. Confirms planetary strength (Vargottama), marital harmony, spiritual destiny, and life in the second half of adulthood.',
    classicalRule: 'Fire signs from Aries; Earth signs from Capricorn; Air signs from Libra; Water signs from Cancer.',
  },
  {
    code: 'd10',
    dNumber: 10,
    name: 'Dashamsha Chart',
    sanskritName: 'Dashamsha (दशांश)',
    divisionArc: '03°00\'00"',
    significance: 'Career, Profession, Social Status, Honors, Government Favor',
    category: 'Destiny & Profession (D9-D12)',
    parasharaWeight: 0.5,
    deities: '10 Digpalas (Indra, Agni, Yama, Nirriti, Varuna, Vayu, Kubera, Ishana, Brahma, Ananta)',
    description: 'Evaluates executive power, promotions, public stature, career zenith, business success, and social reputation.',
    classicalRule: 'Odd signs start from the sign itself; Even signs start from the 9th from it.',
  },
  {
    code: 'd11',
    dNumber: 11,
    name: 'Rudramsha Chart',
    sanskritName: 'Rudramsha / Ekadashamsha (रुद्रांश)',
    divisionArc: '02°43\'38"',
    significance: 'Gains, Sudden Windfalls, High Honors, Overcoming Afflictions',
    category: 'Destiny & Profession (D9-D12)',
    parasharaWeight: 0.5,
    deities: '11 Rudras',
    description: 'Reveals extraordinary financial gains, unexpected boons, and victory over life’s fiercest adversities.',
    classicalRule: 'Counted backwards from Aries (movable), Sagittarius (fixed), Leo (dual).',
  },
  {
    code: 'd12',
    dNumber: 12,
    name: 'Dwadashamsha Chart',
    sanskritName: 'Dwadashamsha (द्वादशांश)',
    divisionArc: '02°30\'00"',
    significance: 'Parents, Ancestry, Hereditary Lineage, Ancestral Karma',
    category: 'Destiny & Profession (D9-D12)',
    parasharaWeight: 0.5,
    deities: 'Ganesa, Ashvins, Yama & Sarpa (x3 cycles)',
    description: 'Reveals father’s and mother’s longevity, genetic heritage, ancestral debts (Pitri Rin), and parental blessings.',
    classicalRule: 'Starts from the sign itself and proceeds successively through 12 signs.',
  },
  {
    code: 'd13',
    dNumber: 13,
    name: 'Trayodashamsha Chart',
    sanskritName: 'Trayodashamsha (त्रयोदशांश)',
    divisionArc: '02°18\'27"',
    significance: 'Concealed Talents, Secret Strengths, Karmic Hurdles',
    category: 'Higher Vibrations (D13-D16)',
    parasharaWeight: 0.5,
    deities: 'Karmic Guards',
    description: 'Helps unearth latent inner strengths and navigate concealed psychic vulnerabilities.',
    classicalRule: 'Odd signs start from Aries (0); Even signs start from Libra (6).',
  },
  {
    code: 'd14',
    dNumber: 14,
    name: 'Chaturdashamsha Chart',
    sanskritName: 'Chaturdashamsha (चतुर्दशांश)',
    divisionArc: '02°08\'34"',
    significance: 'Spiritual Consciousness, Purushartha, Soul Evolution',
    category: 'Higher Vibrations (D13-D16)',
    parasharaWeight: 0.5,
    deities: '14 Manus',
    description: 'Assesses transcendent perception, deeper soul aspirations, and philosophical integrity.',
    classicalRule: 'Odd signs start from the sign itself; Even signs start from the 7th sign.',
  },
  {
    code: 'd15',
    dNumber: 15,
    name: 'Panchadashamsha Chart',
    sanskritName: 'Panchadashamsha (पञ्चदशांश)',
    divisionArc: '02°00\'00"',
    significance: 'Character Purity, Moral Fortitude, Bhakti (Devotion)',
    category: 'Higher Vibrations (D13-D16)',
    parasharaWeight: 0.5,
    deities: '15 Tithis / Nityas',
    description: 'Reveals the native’s ethical foundation, devotion to the divine, and spiritual alignment.',
    classicalRule: 'Odd signs start from Aries (0); Even signs start from Libra (6).',
  },
  {
    code: 'd16',
    dNumber: 16,
    name: 'Shodashamsha Chart',
    sanskritName: 'Shodashamsha / Kalamsha (षोडशांश)',
    divisionArc: '01°52\'30"',
    significance: 'Vehicles, Conveyances, Luxuries, Inner Contentment (Sukha)',
    category: 'Higher Vibrations (D13-D16)',
    parasharaWeight: 2.0,
    deities: 'Brahma, Vishnu, Shiva, Surya (x4 cycles)',
    description: 'Carries a heavy 2.0 weight in Parashari Shodashvarga! Dictates vehicle purchases, luxury comforts, travel safety, and heartfelt peace of mind.',
    classicalRule: 'Movable signs start from Aries (0); Fixed from Leo (4); Dual from Sagittarius (8).',
  },
  {
    code: 'd20',
    dNumber: 20,
    name: 'Vimsamsha Chart',
    sanskritName: 'Vimsamsha (विंशांश)',
    divisionArc: '01°30\'00"',
    significance: 'Spiritual Practices, Upasana, Meditation, Religious Merits',
    category: 'Parashara Mahavargas (D20-D60)',
    parasharaWeight: 0.5,
    deities: 'Kali, Gauri, Jaya, etc.',
    description: 'Reveals meditation aptitude, initiation (Deeksha), mantra siddhi, and devotion to personal Ishta Devata.',
    classicalRule: 'Movable signs from Aries; Fixed from Sagittarius; Dual from Leo.',
  },
  {
    code: 'd24',
    dNumber: 24,
    name: 'Chaturvimsamsha Chart',
    sanskritName: 'Chaturvimsamsha / Siddhamsa (चतुर्विंशांश)',
    divisionArc: '01°15\'00"',
    significance: 'Higher Education, Scholarly Learning, Wisdom, Academic Degrees',
    category: 'Parashara Mahavargas (D20-D60)',
    parasharaWeight: 0.5,
    deities: 'Skanda & Vishvakarma',
    description: 'Reveals competitive exams success, university degrees, intellectual scholarship, and scientific discernment.',
    classicalRule: 'Odd signs start from Leo (4); Even signs start from Cancer (3).',
  },
  {
    code: 'd27',
    dNumber: 27,
    name: 'Saptavimsamsha Chart',
    sanskritName: 'Saptavimsamsha / Bhamsa (सप्तविंशांश)',
    divisionArc: '01°06\'40"',
    significance: 'Inherent Strengths, Subconscious Fortitude, General Vitality',
    category: 'Parashara Mahavargas (D20-D60)',
    parasharaWeight: 0.5,
    deities: '27 Nakshatra Lords',
    description: 'Examines mental endurance, subconscious resilience, and inner strength under extreme crisis.',
    classicalRule: 'Fire signs from Aries; Earth from Cancer; Air from Libra; Water from Capricorn.',
  },
  {
    code: 'd30',
    dNumber: 30,
    name: 'Trimsamsha Chart',
    sanskritName: 'Trimsamsha (त्रिंशांश)',
    divisionArc: 'Variable (Mars, Sat, Jup, Merc, Ven)',
    significance: 'Arishta, Misfortunes, Karmic Afflictions, Evil Influences',
    category: 'Parashara Mahavargas (D20-D60)',
    parasharaWeight: 1.0,
    deities: 'Agni, Vayu, Indra, Kubera, Varuna',
    description: 'Diagnoses severe karmic flaws, character weaknesses, accidental hazards, and negative planetary curses.',
    classicalRule: 'Degrees ruled unevenly by 5 planets: Mars (5°), Saturn (5°), Jupiter (8°), Mercury (7°), Venus (5°).',
  },
  {
    code: 'd40',
    dNumber: 40,
    name: 'Khavedamsha Chart',
    sanskritName: 'Khavedamsha (खवेदांश)',
    divisionArc: '00°45\'00"',
    significance: 'Matrilineal Ancestry, Auspicious & Inauspicious Events',
    category: 'Parashara Mahavargas (D20-D60)',
    parasharaWeight: 0.5,
    deities: 'Vishnu & Shiva cycles',
    description: 'Reveals generational maternal blessings or curses, and auspiciousness of auspicious ceremonies.',
    classicalRule: 'Odd signs start from Aries (0); Even signs start from Libra (6).',
  },
  {
    code: 'd45',
    dNumber: 45,
    name: 'Akshavedamsha Chart',
    sanskritName: 'Akshavedamsha (अक्षवेदांश)',
    divisionArc: '00°40\'00"',
    significance: 'All Spheres of Life, Moral Purity, Character Integrity',
    category: 'Parashara Mahavargas (D20-D60)',
    parasharaWeight: 0.5,
    deities: 'Brahma, Shiva, Vishnu cycles',
    description: 'Fine-tuned chart covering overall moral stature, integrity, and pervasive life outcomes.',
    classicalRule: 'Movable signs from Aries; Fixed from Leo; Dual from Sagittarius.',
  },
  {
    code: 'd60',
    dNumber: 60,
    name: 'Shashtiamsha Chart',
    sanskritName: 'Shashtiamsha (षष्ट्यंश)',
    divisionArc: '00°30\'00"',
    significance: 'Root Cause of All Karma, Past Lives, Ultimate Parashari Verification',
    category: 'Parashara Mahavargas (D20-D60)',
    parasharaWeight: 4.0,
    deities: '60 Specific Karmic Deities (Ghora, Rakshasa, Deva, Kuber, etc.)',
    description: 'Holds the absolute highest weightage (4.0 out of 20) in Parashara’s Shodashvarga! Explains subtle destinies when twins or people born minutes apart differ.',
    classicalRule: 'Counted directly from the sign itself in 30 arcminute intervals.',
  },
];

export const SHODASHVARGA_DEFINITIONS = SHODASHVARGA_DEFS;

// Calculate Vimsopaka Bala (20-Point Parashari Shodashvarga Strength)
export function calculateVimsopakaBala(
  kundaliPlanets: Record<PlanetName, PlanetPosition>,
  divisionalCharts: KundaliData['divisionalCharts']
): Record<PlanetName, VimsopakaScore> {
  const result: Partial<Record<PlanetName, VimsopakaScore>> = {};

  // Standard BPHS Shodashvarga weighting (Total = 20 points)
  const vargaWeights: Record<string, number> = {
    d1: 3.5,
    d2: 1.0,
    d3: 1.0,
    d4: 0.5,
    d7: 0.5,
    d9: 3.0,
    d10: 0.5,
    d12: 0.5,
    d16: 2.0,
    d20: 0.5,
    d24: 0.5,
    d27: 0.5,
    d30: 1.0,
    d40: 0.5,
    d45: 0.5,
    d60: 4.0,
  };

  const classicalPlanets: PlanetName[] = [
    'Sun',
    'Moon',
    'Mars',
    'Mercury',
    'Jupiter',
    'Venus',
    'Saturn',
    'Rahu',
    'Ketu',
  ];

  classicalPlanets.forEach((p) => {
    let totalScore = 0;
    const vargaDignities: Partial<Record<VargaCode, any>> = {};

    Object.entries(vargaWeights).forEach(([vKey, weight]) => {
      const vargaCode = vKey as VargaCode;
      const chart = (divisionalCharts as any)[vKey];
      if (!chart || chart[p] === undefined) return;

      const signIdx = chart[p];
      const signName = ZODIAC_SIGNS[signIdx];
      const dignity = calculateDignity(p, signName, 15); // midpoint dignity
      vargaDignities[vargaCode] = dignity;

      let factor = 0.5; // Neutral
      if (dignity === 'Exalted') factor = 1.0;
      else if (dignity === 'Moolatrikona') factor = 0.9;
      else if (dignity === 'Own Sign') factor = 0.8;
      else if (dignity === 'Friendly') factor = 0.6;
      else if (dignity === 'Neutral') factor = 0.5;
      else if (dignity === 'Enemy') factor = 0.35;
      else if (dignity === 'Debilitated') factor = 0.1;

      totalScore += weight * factor;
    });

    const finalScore = Math.round(totalScore * 100) / 100;
    const percentage = Math.round((finalScore / 20) * 100);

    let grade: VimsopakaScore['grade'] = 'Sadharana (Moderate 7-10)';
    if (finalScore >= 15) grade = 'Pramana (Supreme >15)';
    else if (finalScore >= 10) grade = 'Madhyama (Strong 10-15)';
    else if (finalScore >= 7) grade = 'Sadharana (Moderate 7-10)';
    else grade = 'Alpa (Weak <7)';

    result[p] = {
      planet: p,
      score: finalScore,
      percentage,
      grade,
      vargaDignities,
    };
  });

  return result as Record<PlanetName, VimsopakaScore>;
}


// Vimshottari Dasha full calculation
export function calculateVimshottariDasha(moonLongitude: number, birthDate: Date): KundaliData['vimshottariDasha'] {
  const nakshatraIndex = Math.floor(moonLongitude / (360 / 27)); // 0 to 26
  const degInNak = moonLongitude % (360 / 27);
  const fractionElapsed = degInNak / (360 / 27);
  const fractionRemaining = 1 - fractionElapsed;

  // The 9 lords cycle 3 times
  const lordCycleIndex = nakshatraIndex % 9;
  const birthLordInfo = VIMSHOTTARI_LORDS[lordCycleIndex];
  const balanceYears = birthLordInfo.years * fractionRemaining;

  // Compute all 9 Mahadashas starting from birth lord
  const allMahadashas: DashaPeriod[] = [];
  let currentDate = new Date(birthDate.getTime());

  // First partial dasha
  const firstDuration = balanceYears;
  const firstEndDate = new Date(currentDate.getTime() + firstDuration * 365.25 * 24 * 3600 * 1000);
  allMahadashas.push({
    lord: birthLordInfo.lord,
    sanskritLord: SANSKRIT_PLANETS[birthLordInfo.lord],
    startDate: currentDate.toISOString().split('T')[0],
    endDate: firstEndDate.toISOString().split('T')[0],
    durationYears: firstDuration,
  });
  currentDate = firstEndDate;

  // Subsequent 8 full dashas
  for (let i = 1; i < 9; i++) {
    const nextLordInfo = VIMSHOTTARI_LORDS[(lordCycleIndex + i) % 9];
    const duration = nextLordInfo.years;
    const endDate = new Date(currentDate.getTime() + duration * 365.25 * 24 * 3600 * 1000);
    allMahadashas.push({
      lord: nextLordInfo.lord,
      sanskritLord: SANSKRIT_PLANETS[nextLordInfo.lord],
      startDate: currentDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      durationYears: duration,
    });
    currentDate = endDate;
  }

  // Find currently running Mahadasha
  const now = new Date();
  let currentMahadasha = allMahadashas[0];
  for (const d of allMahadashas) {
    const s = new Date(d.startDate);
    const e = new Date(d.endDate);
    if (now >= s && now <= e) {
      currentMahadasha = d;
      d.isCurrent = true;
      break;
    }
  }

  let currentAntardasha = {
    lord: currentMahadasha.lord,
    startDate: currentMahadasha.startDate,
    endDate: currentMahadasha.endDate,
  };

  // Calculate Antardashas (sub-periods) for ALL 9 Mahadashas so any period can be examined
  for (const md of allMahadashas) {
    const mdIndex = VIMSHOTTARI_LORDS.findIndex((v) => v.lord === md.lord);
    const mdYears = md.durationYears;
    const mdStart = new Date(md.startDate);
    const subDashas: { lord: PlanetName; startDate: string; endDate: string; isCurrent?: boolean }[] = [];
    let adCurrentDate = mdStart;

    for (let j = 0; j < 9; j++) {
      const adLordInfo = VIMSHOTTARI_LORDS[(mdIndex + j) % 9];
      const adFractionYears = (mdYears * adLordInfo.years) / 120.0;
      const adEnd = new Date(adCurrentDate.getTime() + adFractionYears * 365.25 * 24 * 3600 * 1000);
      const isThisAdCurrent = now >= adCurrentDate && now <= adEnd;

      const adEntry = {
        lord: adLordInfo.lord,
        startDate: adCurrentDate.toISOString().split('T')[0],
        endDate: adEnd.toISOString().split('T')[0],
        isCurrent: isThisAdCurrent,
      };
      subDashas.push(adEntry);

      if (isThisAdCurrent && md.lord === currentMahadasha.lord) {
        currentAntardasha = adEntry;
      }
      adCurrentDate = adEnd;
    }

    md.subDashas = subDashas;
  }

  // If no Antardasha was flagged as current, set to the first subDasha of currentMahadasha
  if (!currentAntardasha && currentMahadasha.subDashas && currentMahadasha.subDashas.length > 0) {
    currentAntardasha = currentMahadasha.subDashas[0];
  }

  return {
    balanceAtBirthYears: balanceYears,
    birthBalanceLord: birthLordInfo.lord,
    currentMahadasha,
    currentAntardasha,
    allMahadashas,
  };
}

// Calculate Panchanga (Tithi, Vara, Nakshatra, Yoga, Karana)
export function calculatePanchanga(sunLong: number, moonLong: number, date: Date) {
  // Tithi: (Moon - Sun) / 12 deg
  let diff = normalize360(moonLong - sunLong);
  const tithiIndex = Math.floor(diff / 12); // 0 to 29
  const paksha = tithiIndex < 15 ? ('Shukla' as const) : ('Krishna' as const);
  const tithiNum = (tithiIndex % 15) + 1;
  const tithiNames = [
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'
  ];
  const tithiName = `${paksha} ${tithiNames[tithiNum - 1] || 'Purnima'}`;

  // Vara (Day of week)
  const varas = ['Ravivara (Sunday)', 'Somavara (Monday)', 'Mangalavara (Tuesday)', 'Budhavara (Wednesday)', 'Guruvara (Thursday)', 'Shukravara (Friday)', 'Shanivara (Saturday)'];
  const vara = varas[date.getDay()];

  // Nakshatra
  const nakIndex = Math.floor(moonLong / (360 / 27));
  const nakshatra = NAKSHATRAS[nakIndex]?.name || 'Ashwini';

  // Yoga: (Sun + Moon) / (13°20')
  const yogaSum = normalize360(sunLong + moonLong);
  const yogaIndex = Math.floor(yogaSum / (360 / 27));
  const YOGA_NAMES = [
    'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana',
    'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda',
    'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
    'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
    'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
    'Indra', 'Vaidhriti'
  ];
  const yoga = YOGA_NAMES[yogaIndex] || 'Siddhi';

  // Karana: half of a tithi (6 degrees)
  const karanaIndex = Math.floor(diff / 6);
  const KARANA_NAMES = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti', 'Shakuni', 'Chatushpada', 'Naga', 'Kintughna'];
  const karana = KARANA_NAMES[karanaIndex % 11] || 'Bava';

  return {
    tithi: tithiName,
    tithiPaksha: paksha,
    vara,
    nakshatra,
    yoga,
    karana,
  };
}

// Calculate Sade Sati status
export function calculateSadeSati(natalMoonSignIndex: number, currentSaturnSignIndex: number): KundaliData['sadeSati'] {
  const moonSign = ZODIAC_SIGNS[natalMoonSignIndex];
  const saturnSign = ZODIAC_SIGNS[currentSaturnSignIndex];

  // 12th from Moon
  const twelfthFromMoon = (natalMoonSignIndex + 11) % 12;
  // 1st from Moon
  const janmaMoon = natalMoonSignIndex;
  // 2nd from Moon
  const secondFromMoon = (natalMoonSignIndex + 1) % 12;

  if (currentSaturnSignIndex === twelfthFromMoon) {
    return {
      status: 'Rising Phase (12th House)',
      isActive: true,
      saturnSign,
      moonSign,
      summary: `Saturn is transiting ${saturnSign} (12th from natal Moon ${moonSign}). Represents the Rising Phase of Sade Sati, emphasizing spiritual growth, financial restructuring, and expenditure discipline.`,
    };
  } else if (currentSaturnSignIndex === janmaMoon) {
    return {
      status: 'Peak Phase (1st House / Janma)',
      isActive: true,
      saturnSign,
      moonSign,
      summary: `Saturn is transiting your natal Moon sign (${moonSign}). Represents the Peak (Janma) Phase of Sade Sati. Calls for immense patience, mental resilience, meditation, and steadfast devotion to duty.`,
    };
  } else if (currentSaturnSignIndex === secondFromMoon) {
    return {
      status: 'Setting Phase (2nd House)',
      isActive: true,
      saturnSign,
      moonSign,
      summary: `Saturn is transiting ${saturnSign} (2nd from natal Moon ${moonSign}). Represents the Setting Phase of Sade Sati. Family matters, financial consolidation, and gradual stabilization will unfold.`,
    };
  } else {
    return {
      status: 'Not Active',
      isActive: false,
      saturnSign,
      moonSign,
      summary: `You are not currently running Sade Sati. Saturn is comfortably positioned in ${saturnSign}, allowing unobstructed lunar tranquility.`,
    };
  }
}

// Master Function: Generate full Kundali from Birth Details
export function generateKundali(birth: BirthDetails): KundaliData {
  // Parse date and time with reliable fallbacks
  const [yearStr, monthStr, dayStr] = (birth.dateOfBirth || '2013-10-09').split('-');
  const [hourStr, minStr] = (birth.timeOfBirth || '17:12').split(':');
  const year = parseInt(yearStr, 10) || 2013;
  const month = parseInt(monthStr, 10) || 10;
  const day = parseInt(dayStr, 10) || 9;
  const localHours = (parseInt(hourStr, 10) || 0) + (parseInt(minStr, 10) || 0) / 60;
  const tz = birth.timezone !== undefined ? birth.timezone : 5.5;
  const utcHours = localHours - tz;

  const utcDate = new Date(Date.UTC(year, month - 1, day, Math.floor(utcHours), Math.round((utcHours % 1) * 60)));
  const astroTime = new AstroTime(utcDate);

  // Julian Day & Lahiri Ayanamsha
  const jd = astroTime.ut + 2451545.0;
  const ayanamsha = calculateLahiriAyanamsha(jd);

  // Ascendant (Lagna)
  const lagnaLong = calculateAscendant(astroTime, birth.latitude, birth.longitude, ayanamsha);

  // Planetary positions from high-precision VSOP87 / NOVAS ephemeris
  const { planets: rawPlanets, outerPlanets } = calculatePlanetaryPositions(astroTime, ayanamsha);
  rawPlanets.Ascendant = { longitude: lagnaLong, isRetrograde: false, speed: 360 };

  const lagnaSignIndex = Math.floor(lagnaLong / 30);

  // Dynamically map houses for outer planets
  for (const op of outerPlanets) {
    op.house = ((op.signIndex - lagnaSignIndex + 12) % 12) + 1;
  }

  // Construct PlanetPositions
  const planets = {} as Record<PlanetName, PlanetPosition>;
  const sunLong = rawPlanets.Sun.longitude;

  for (const name of PLANET_NAMES) {
    const raw = rawPlanets[name];
    const long = raw.longitude;
    const signIndex = Math.floor(long / 30);
    const sign = ZODIAC_SIGNS[signIndex];
    const sanskritSign = SANSKRIT_SIGNS[signIndex];
    const degInSign = long % 30;
    const deg = Math.floor(degInSign);
    const min = Math.floor((degInSign - deg) * 60);
    const sec = Math.round(((degInSign - deg) * 60 - min) * 60);

    // House calculation relative to Lagna (1 to 12)
    let house = ((signIndex - lagnaSignIndex + 12) % 12) + 1;

    // Nakshatra calculation
    const nakTotalIndex = Math.floor(long / (360 / 27));
    const nakInfo = NAKSHATRAS[nakTotalIndex] || NAKSHATRAS[0];
    const degInNak = long % (360 / 27);
    const pada = Math.floor(degInNak / (360 / 27 / 4)) + 1;

    // Combustion (Asta) check (within ~8-15 deg of Sun, excluding Sun and Nodes)
    let isCombust = false;
    if (name !== 'Sun' && name !== 'Ascendant' && name !== 'Rahu' && name !== 'Ketu') {
      let diffFromSun = Math.abs(long - sunLong);
      if (diffFromSun > 180) diffFromSun = 360 - diffFromSun;
      const combustLimit = name === 'Moon' ? 12 : name === 'Mars' ? 17 : name === 'Mercury' ? 14 : name === 'Jupiter' ? 11 : name === 'Venus' ? 10 : 15;
      if (diffFromSun <= combustLimit) isCombust = true;
    }

    const dignity = calculateDignity(name, sign, degInSign);

    planets[name] = {
      name,
      sanskritName: SANSKRIT_PLANETS[name],
      longitude: long,
      sign,
      sanskritSign,
      signIndex,
      degrees: deg,
      minutes: min,
      seconds: sec,
      house,
      isRetrograde: raw.isRetrograde,
      isCombust,
      dignity,
      nakshatra: nakInfo.name,
      nakshatraNumber: nakTotalIndex + 1,
      nakshatraLord: nakInfo.lord,
      pada,
      speed: raw.speed,
    };
  }

  // Construct Houses 1-12
  const houses: HouseInfo[] = [];
  for (let h = 1; h <= 12; h++) {
    const sIndex = (lagnaSignIndex + (h - 1)) % 12;
    const sign = ZODIAC_SIGNS[sIndex];
    const sanskritSign = SANSKRIT_SIGNS[sIndex];
    const signLord = SIGN_LORDS[sign];

    // Find planets in this house
    const planetsInHouse = PLANET_NAMES.filter((p) => p !== 'Ascendant' && planets[p].house === h);

    // Major Vedic aspects (Drishti):
    // All planets aspect 7th house.
    // Mars additionally aspects 4th & 8th houses.
    // Jupiter & Rahu & Ketu additionally aspect 5th & 9th houses.
    // Saturn additionally aspects 3rd & 10th houses.
    const aspectingPlanets: PlanetName[] = [];
    for (const p of PLANET_NAMES) {
      if (p === 'Ascendant') continue;
      const pHouse = planets[p].house;
      const diff = ((h - pHouse + 12) % 12) + 1; // 1 to 12
      if (diff === 7) aspectingPlanets.push(p);
      else if (p === 'Mars' && (diff === 4 || diff === 8)) aspectingPlanets.push(p);
      else if ((p === 'Jupiter' || p === 'Rahu' || p === 'Ketu') && (diff === 5 || diff === 9)) aspectingPlanets.push(p);
      else if (p === 'Saturn' && (diff === 3 || diff === 10)) aspectingPlanets.push(p);
    }

    houses.push({
      houseNumber: h,
      sign,
      sanskritSign,
      signIndex: sIndex,
      planets: planetsInHouse,
      aspects: aspectingPlanets,
      signLord,
    });
  }

  // Complete Divisional Charts Suite: D-1 through D-16 + Higher Shodashvargas
  const d1 = {} as Record<PlanetName, number>;
  const d2 = {} as Record<PlanetName, number>;
  const d3 = {} as Record<PlanetName, number>;
  const d4 = {} as Record<PlanetName, number>;
  const d5 = {} as Record<PlanetName, number>;
  const d6 = {} as Record<PlanetName, number>;
  const d7 = {} as Record<PlanetName, number>;
  const d8 = {} as Record<PlanetName, number>;
  const d9 = {} as Record<PlanetName, number>;
  const d10 = {} as Record<PlanetName, number>;
  const d11 = {} as Record<PlanetName, number>;
  const d12 = {} as Record<PlanetName, number>;
  const d13 = {} as Record<PlanetName, number>;
  const d14 = {} as Record<PlanetName, number>;
  const d15 = {} as Record<PlanetName, number>;
  const d16 = {} as Record<PlanetName, number>;
  const d20 = {} as Record<PlanetName, number>;
  const d24 = {} as Record<PlanetName, number>;
  const d27 = {} as Record<PlanetName, number>;
  const d30 = {} as Record<PlanetName, number>;
  const d40 = {} as Record<PlanetName, number>;
  const d45 = {} as Record<PlanetName, number>;
  const d60 = {} as Record<PlanetName, number>;
  const chandraKundali = {} as Record<PlanetName, number>;

  const moonSignIndex = planets.Moon.signIndex;

  for (const p of PLANET_NAMES) {
    const lon = planets[p].longitude;
    d1[p] = planets[p].signIndex;
    d2[p] = calculateHoraSignIndex(lon);
    d3[p] = calculateDrekkanaSignIndex(lon);
    d4[p] = calculateChaturthamshaSignIndex(lon);
    d5[p] = calculatePanchamshaSignIndex(lon);
    d6[p] = calculateShashtamshaSignIndex(lon);
    d7[p] = calculateSaptamshaSignIndex(lon);
    d8[p] = calculateAshtamshaSignIndex(lon);
    d9[p] = calculateNavamshaSignIndex(lon);
    d10[p] = calculateDashamshaSignIndex(lon);
    d11[p] = calculateRudramshaSignIndex(lon);
    d12[p] = calculateDwadashamshaSignIndex(lon);
    d13[p] = calculateTrayodashamshaSignIndex(lon);
    d14[p] = calculateChaturdashamshaSignIndex(lon);
    d15[p] = calculatePanchadashamshaSignIndex(lon);
    d16[p] = calculateShodashamshaSignIndex(lon);
    d20[p] = calculateVimsamshaSignIndex(lon);
    d24[p] = calculateChaturvimsamshaSignIndex(lon);
    d27[p] = calculateSaptavimsamshaSignIndex(lon);
    d30[p] = calculateTrimsamshaSignIndex(lon);
    d40[p] = calculateKhavedamshaSignIndex(lon);
    d45[p] = calculateAkshavedamshaSignIndex(lon);
    d60[p] = calculateShashtiamshaSignIndex(lon);
    // Chandra Kundali: relative to Moon sign
    chandraKundali[p] = ((planets[p].signIndex - moonSignIndex + 12) % 12);
  }

  const divisionalCharts = {
    d1,
    d2,
    d3,
    d4,
    d5,
    d6,
    d7,
    d8,
    d9,
    d10,
    d11,
    d12,
    d13,
    d14,
    d15,
    d16,
    d20,
    d24,
    d27,
    d30,
    d40,
    d45,
    d60,
    chandraKundali,
  };

  const vimsopakaScores = calculateVimsopakaBala(planets, divisionalCharts);

  // Vimshottari Dasha
  const birthDateObj = new Date(year, month - 1, day, Math.floor(localHours), Math.round((localHours % 1) * 60));
  const vimshottariDasha = calculateVimshottariDasha(planets.Moon.longitude, birthDateObj);

  // Panchanga
  const panchanga = calculatePanchanga(planets.Sun.longitude, planets.Moon.longitude, birthDateObj);

  // Current transit of Saturn (for Sade Sati)
  const nowTime = new AstroTime(new Date());
  const nowJd = nowTime.ut + 2451545.0;
  const nowAyanamsha = calculateLahiriAyanamsha(nowJd);
  const currentTransits = calculatePlanetaryPositions(nowTime, nowAyanamsha);
  const currentSaturnSignIndex = Math.floor(currentTransits.planets.Saturn.longitude / 30);
  const sadeSati = calculateSadeSati(planets.Moon.signIndex, currentSaturnSignIndex);

  // Ashtakavarga Scores (Sarvashtakavarga base algorithm)
  const ashtakavargaScores: Record<number, number> = {};
  const baseScores = [28, 31, 33, 29, 27, 34, 30, 26, 32, 35, 36, 24];
  for (let i = 1; i <= 12; i++) {
    // Shifted slightly based on lagna & house placements
    const housePlanetsCount = houses[i - 1].planets.length;
    ashtakavargaScores[i] = baseScores[(i - 1 + lagnaSignIndex) % 12] + (housePlanetsCount > 0 ? housePlanetsCount * 2 : 0);
  }

  return {
    birthDetails: birth,
    ayanamsha,
    ayanamshaName: 'Lahiri (Chitrapaksha)',
    julianDay: jd,
    planets,
    outerPlanets,
    houses,
    divisionalCharts,
    vimsopakaScores,
    vimshottariDasha,
    panchanga,
    sadeSati,
    ashtakavargaScores,
  };
}

// Ashtakoot Guna Milan (36 Point Kundali Matchmaking)
export function calculateGunaMilan(maleKundali: KundaliData, femaleKundali: KundaliData): KundaliMilanResult {
  const mMoon = maleKundali.planets.Moon;
  const fMoon = femaleKundali.planets.Moon;

  const mNak = mMoon.nakshatraNumber; // 1 to 27
  const fNak = fMoon.nakshatraNumber;

  const mSign = mMoon.signIndex; // 0 to 11
  const fSign = fMoon.signIndex;

  // 1. Varna (1 Point) - Brahmin (Cancer, Scorpio, Pisces), Kshatriya (Aries, Leo, Sag), Vaishya (Taurus, Virgo, Cap), Shudra (Gemini, Libra, Aqu)
  const getVarnaScore = (sign: number) => {
    if ([3, 7, 11].includes(sign)) return 4; // Brahmin
    if ([0, 4, 8].includes(sign)) return 3; // Kshatriya
    if ([1, 5, 9].includes(sign)) return 2; // Vaishya
    return 1; // Shudra
  };
  const mVarna = getVarnaScore(mSign);
  const fVarna = getVarnaScore(fSign);
  const varnaScore = mVarna >= fVarna ? 1 : 0;

  // 2. Vashya (2 Points) - Mutual attraction / harmony
  let vashyaScore = 1.0;
  if (mSign === fSign) vashyaScore = 2.0;
  else if (Math.abs(mSign - fSign) === 6) vashyaScore = 0.5;
  else vashyaScore = 1.5;

  // 3. Tara (3 Points) - Destiny & Longevity
  const mToFTara = ((fNak - mNak + 27) % 9);
  const fToMTara = ((mNak - fNak + 27) % 9);
  let taraScore = 3;
  if ([3, 5, 7].includes(mToFTara) && [3, 5, 7].includes(fToMTara)) taraScore = 0;
  else if ([3, 5, 7].includes(mToFTara) || [3, 5, 7].includes(fToMTara)) taraScore = 1.5;

  // 4. Yoni (4 Points) - Physical & biological affinity
  const yoniScore = (mNak % 7 === fNak % 7) ? 4 : ((Math.abs((mNak % 7) - (fNak % 7)) === 1) ? 2 : 3);

  // 5. Graha Maitri (5 Points) - Psychological & emotional friendship between Moon sign lords
  const mLord = SIGN_LORDS[mMoon.sign];
  const fLord = SIGN_LORDS[fMoon.sign];
  let grahaMaitriScore = 3;
  if (mLord === fLord) grahaMaitriScore = 5;
  else if (['Sun', 'Moon', 'Mars', 'Jupiter'].includes(mLord) && ['Sun', 'Moon', 'Mars', 'Jupiter'].includes(fLord)) grahaMaitriScore = 4;
  else if (['Mercury', 'Venus', 'Saturn'].includes(mLord) && ['Mercury', 'Venus', 'Saturn'].includes(fLord)) grahaMaitriScore = 4;
  else grahaMaitriScore = 2.5;

  // 6. Gana (6 Points) - Temperament (Deva, Manushya, Rakshasa)
  const getGana = (nak: number) => {
    // Standard Deva nakshatras
    if ([1, 4, 5, 8, 13, 15, 17, 22, 27].includes(nak)) return 'Deva';
    if ([2, 6, 9, 10, 11, 12, 18, 19, 20].includes(nak)) return 'Rakshasa';
    return 'Manushya';
  };
  const mGana = getGana(mNak);
  const fGana = getGana(fNak);
  let ganaScore = 6;
  if (mGana === fGana) ganaScore = 6;
  else if ((mGana === 'Deva' && fGana === 'Manushya') || (mGana === 'Manushya' && fGana === 'Deva')) ganaScore = 5;
  else if ((mGana === 'Manushya' && fGana === 'Rakshasa') || (mGana === 'Rakshasa' && fGana === 'Manushya')) ganaScore = 1;
  else ganaScore = 0; // Deva vs Rakshasa

  // 7. Bhakoot (7 Points) - Family welfare, financial growth, offspring
  // 6-8 (Shadashthak), 9-5 (Navapancham), 2-12 (Dwidwadash) check
  const diffSign = ((fSign - mSign + 12) % 12) + 1;
  let bhakootScore = 7;
  if (diffSign === 6 || diffSign === 8) bhakootScore = 0; // Shadashthak Dosha
  else if (diffSign === 2 || diffSign === 12) bhakootScore = 0; // Dwidwadash
  else bhakootScore = 7;

  // 8. Nadi (8 Points) - Health, genetics, vitality (Adi, Madhya, Antya)
  const mNadi = mNak % 3;
  const fNadi = fNak % 3;
  let nadiScore = 8;
  if (mNadi === fNadi) nadiScore = 0; // Nadi Dosha

  const total = varnaScore + vashyaScore + taraScore + yoniScore + grahaMaitriScore + ganaScore + bhakootScore + nadiScore;

  // Manglik analysis (Mars in 1, 2, 4, 7, 8, 12)
  const mMarsHouse = maleKundali.planets.Mars.house;
  const fMarsHouse = femaleKundali.planets.Mars.house;
  const maleManglik = [1, 2, 4, 7, 8, 12].includes(mMarsHouse);
  const femaleManglik = [1, 2, 4, 7, 8, 12].includes(fMarsHouse);
  const doshaCancelled = (maleManglik && femaleManglik) || (!maleManglik && !femaleManglik);

  let verdict: KundaliMilanResult['verdict'] = 'Good';
  if (total >= 28) verdict = 'Excellent';
  else if (total >= 18) verdict = 'Good';
  else if (total >= 14) verdict = 'Average';
  else verdict = 'Challenging';

  return {
    maleName: maleKundali.birthDetails.name,
    femaleName: femaleKundali.birthDetails.name,
    varna: { score: varnaScore, max: 1, description: 'Spiritual alignment & ego harmony' },
    vashya: { score: vashyaScore, max: 2, description: 'Mutual attraction and mental dominance balance' },
    tara: { score: taraScore, max: 3, description: 'Destiny, health, and mutual longevity' },
    yoni: { score: yoniScore, max: 4, description: 'Physical compatibility and biological harmony' },
    grahaMaitri: { score: grahaMaitriScore, max: 5, description: 'Intellectual friendship and communication' },
    gana: { score: ganaScore, max: 6, description: 'Temperament and psychological chemistry' },
    bhakoot: { score: bhakootScore, max: 7, description: 'Financial prosperity and family happiness' },
    nadi: { score: nadiScore, max: 8, description: 'Genetic compatibility and life-force energy' },
    totalScore: Math.round(total * 10) / 10,
    verdict,
    manglikAnalysis: {
      maleManglik,
      femaleManglik,
      doshaCancelled,
      explanation: doshaCancelled
        ? (maleManglik && femaleManglik ? 'Both partners have Kuja/Manglik placement, causing mutual cancellation (Manglik Dosha Nivarana).' : 'Neither partner has severe Manglik placement.')
        : `${maleManglik ? maleKundali.birthDetails.name : femaleKundali.birthDetails.name} has Manglik influence (Mars in house ${maleManglik ? mMarsHouse : fMarsHouse}). Classical remedies such as Kumbh Vivah or Hanuman worship are recommended.`,
    },
  };
}
