import {
  PlanetName,
  ZodiacSign,
  SanskritSign,
  KundaliData,
  BirthDetails,
  HoraryCategory,
  HoraryQueryParams,
  HoraryYogaResult,
  HoraryAnalysis,
  HoraryChartData,
} from '../types';
import {
  generateKundali,
  ZODIAC_SIGNS,
  SANSKRIT_SIGNS,
  SIGN_LORDS,
  NAKSHATRAS,
  normalize360,
  deg2rad,
  calculateDignity,
} from './vedicCalculations';

export interface KpSubEntry {
  seedNumber: number; // 1 to 249
  signIndex: number;
  sign: ZodiacSign;
  signLord: PlanetName;
  nakshatraIndex: number;
  nakshatra: string;
  starLord: PlanetName;
  subLord: PlanetName;
  startLongitude: number;
  endLongitude: number;
  startDegStr: string;
  endDegStr: string;
}

const VIMSHOTTARI_CYCLE: { lord: PlanetName; years: number }[] = [
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

function formatDegMinSec(degVal: number): string {
  const norm = normalize360(degVal);
  const signDeg = norm % 30;
  const d = Math.floor(signDeg);
  const m = Math.floor((signDeg - d) * 60);
  const s = Math.round(((signDeg - d) * 60 - m) * 60);
  return `${d}° ${String(m).padStart(2, '0')}' ${String(s).padStart(2, '0')}"`;
}

// Generate standard 249 Krishnamurti Paddhati (KP) Sub-Division Table
export function generateKp249Table(): KpSubEntry[] {
  const table: KpSubEntry[] = [];
  let currentSeed = 1;
  const nakshatraArc = 800 / 60; // 13° 20' = 13.333333333333334 degrees

  for (let nakIdx = 0; nakIdx < 27; nakIdx++) {
    const nakStartLon = nakIdx * nakshatraArc;
    const starLordCycleIdx = nakIdx % 9;
    const starLord = VIMSHOTTARI_CYCLE[starLordCycleIdx].lord;
    const nakName = NAKSHATRAS[nakIdx]?.name || `Star ${nakIdx + 1}`;

    let subStartLon = nakStartLon;

    for (let subStep = 0; subStep < 9; subStep++) {
      const subLordCycleIdx = (starLordCycleIdx + subStep) % 9;
      const subLordInfo = VIMSHOTTARI_CYCLE[subLordCycleIdx];
      const subDurationDeg = (subLordInfo.years / 120) * nakshatraArc;
      const subEndLon = subStartLon + subDurationDeg;

      // Check if this sub crosses a 30-degree zodiac sign boundary
      const startSignIdx = Math.floor(subStartLon / 30);
      const endSignIdx = Math.floor(subEndLon / 30);

      if (endSignIdx > startSignIdx && subEndLon % 30 > 0.00001) {
        // Crossed a sign boundary: split into two KP numbers
        const boundaryLon = endSignIdx * 30;

        // Part 1: before boundary
        table.push({
          seedNumber: currentSeed++,
          signIndex: startSignIdx,
          sign: ZODIAC_SIGNS[startSignIdx],
          signLord: SIGN_LORDS[ZODIAC_SIGNS[startSignIdx]],
          nakshatraIndex: nakIdx,
          nakshatra: nakName,
          starLord,
          subLord: subLordInfo.lord,
          startLongitude: subStartLon,
          endLongitude: boundaryLon,
          startDegStr: formatDegMinSec(subStartLon),
          endDegStr: formatDegMinSec(boundaryLon),
        });

        // Part 2: after boundary
        table.push({
          seedNumber: currentSeed++,
          signIndex: endSignIdx,
          sign: ZODIAC_SIGNS[endSignIdx],
          signLord: SIGN_LORDS[ZODIAC_SIGNS[endSignIdx]],
          nakshatraIndex: nakIdx,
          nakshatra: nakName,
          starLord,
          subLord: subLordInfo.lord,
          startLongitude: boundaryLon,
          endLongitude: subEndLon,
          startDegStr: formatDegMinSec(boundaryLon),
          endDegStr: formatDegMinSec(subEndLon),
        });
      } else {
        // Normal single sub
        const actualSignIdx = Math.min(startSignIdx, 11);
        table.push({
          seedNumber: currentSeed++,
          signIndex: actualSignIdx,
          sign: ZODIAC_SIGNS[actualSignIdx],
          signLord: SIGN_LORDS[ZODIAC_SIGNS[actualSignIdx]],
          nakshatraIndex: nakIdx,
          nakshatra: nakName,
          starLord,
          subLord: subLordInfo.lord,
          startLongitude: subStartLon,
          endLongitude: subEndLon,
          startDegStr: formatDegMinSec(subStartLon),
          endDegStr: formatDegMinSec(subEndLon),
        });
      }

      subStartLon = subEndLon;
    }
  }

  return table;
}

export const KP_249_TABLE = generateKp249Table();

// Category configuration for Prashna Tantra
export const HORARY_CATEGORIES_CONFIG: Record<
  HoraryCategory,
  {
    title: string;
    description: string;
    karyaHouse: number;
    secondaryHouses: number[];
    significators: PlanetName[];
    sampleQuestions: string[];
  }
> = {
  career_job: {
    title: 'Career & Job Opportunities',
    description: '10th House (Karma/Profession), 6th House (Service), 11th House (Income/Fulfillment)',
    karyaHouse: 10,
    secondaryHouses: [6, 11],
    significators: ['Sun', 'Saturn', 'Mercury'],
    sampleQuestions: [
      'Will I get the job offer I recently interviewed for?',
      'Is this favorable timing to switch my career or employer?',
      'Will I receive the promotion and salary hike this quarter?',
    ],
  },
  finance_wealth: {
    title: 'Finance, Wealth & Investment',
    description: '2nd House (Accumulated Wealth), 11th House (Gains/Profits), 5th House (Speculation)',
    karyaHouse: 2,
    secondaryHouses: [11, 5],
    significators: ['Jupiter', 'Mercury', 'Venus'],
    sampleQuestions: [
      'Will my pending financial dues or loan be recovered?',
      'Will the financial investment yield positive profits?',
      'Will I secure funding/capital for my business venture?',
    ],
  },
  love_marriage: {
    title: 'Love, Marriage & Relationships',
    description: '7th House (Kalatra/Spouse), 2nd House (Family Expansion), 11th House (Union)',
    karyaHouse: 7,
    secondaryHouses: [2, 11],
    significators: ['Venus', 'Jupiter', 'Moon'],
    sampleQuestions: [
      'Will this marriage proposal finalize successfully?',
      'Will my romantic relationship culminate in marriage?',
      'Will the current conflict or estrangement with partner resolve?',
    ],
  },
  health_recovery: {
    title: 'Health, Recovery & Treatment',
    description: '1st House (Vitality/Physique), 11th House (Cure/Relief), 6th House (Disease diagnosis)',
    karyaHouse: 1,
    secondaryHouses: [11, 6],
    significators: ['Sun', 'Moon', 'Jupiter'],
    sampleQuestions: [
      'Will the medical treatment and surgery yield a swift recovery?',
      'Will the health diagnosis be accurate and treatable?',
      'When will chronic health fatigue improve?',
    ],
  },
  property_vehicle: {
    title: 'Property, Real Estate & Vehicles',
    description: '4th House (Bhumi/Vahana/Home), 11th House (Fulfillment), 9th House (Luck in acquisition)',
    karyaHouse: 4,
    secondaryHouses: [11, 9],
    significators: ['Mars', 'Venus', 'Saturn'],
    sampleQuestions: [
      'Will the purchase of this property or house go through smoothly?',
      'Will the sale of my real estate asset bring expected profits?',
      'Is this vehicle acquisition auspicious and problem-free?',
    ],
  },
  education_exam: {
    title: 'Education, Academics & Exams',
    description: '4th House (Basic Studies), 5th House (Intellect/Exams), 11th House (Victory in contest)',
    karyaHouse: 5,
    secondaryHouses: [4, 11],
    significators: ['Mercury', 'Jupiter', 'Sun'],
    sampleQuestions: [
      'Will I clear the competitive exam or university admission?',
      'Will I secure admission to my desired foreign institution?',
      'Will the thesis or academic evaluation be received favorably?',
    ],
  },
  travel_foreign: {
    title: 'Foreign Travel & Relocation',
    description: '9th House (Long Voyages/Higher Purpose), 12th House (Foreign Lands), 3rd House (Journeys)',
    karyaHouse: 9,
    secondaryHouses: [12, 3],
    significators: ['Moon', 'Rahu', 'Jupiter'],
    sampleQuestions: [
      'Will my foreign visa application be approved without delay?',
      'Will the upcoming international journey be safe and fruitful?',
      'Will I settle permanently in a foreign country?',
    ],
  },
  legal_dispute: {
    title: 'Litigation, Court & Disputes',
    description: '6th House (Litigation/Opponents), 11th House (Triumph/Victory), 9th House (Judicial justice)',
    karyaHouse: 6,
    secondaryHouses: [11, 9],
    significators: ['Mars', 'Jupiter', 'Saturn'],
    sampleQuestions: [
      'Will the legal dispute or arbitration conclude in my favor?',
      'Is an out-of-court settlement feasible and advantageous?',
      'Will the ongoing opposition or departmental inquiry dissolve?',
    ],
  },
  lost_item: {
    title: 'Lost Item or Missing Person',
    description: '2nd House (Recovered Wealth), 4th House (Inside Home/Safe), 7th House (Where it went)',
    karyaHouse: 2,
    secondaryHouses: [4, 7],
    significators: ['Mercury', 'Moon'],
    sampleQuestions: [
      'Will the lost article or misplaced document be found?',
      'Is the lost item inside the house or taken outside?',
      'Will the missing pet or person return safely?',
    ],
  },
  general_success: {
    title: 'General Desire & Undertakings',
    description: '11th House (Labha Bhava / All Desires), 1st House (Self Endeavor)',
    karyaHouse: 11,
    secondaryHouses: [1, 9],
    significators: ['Jupiter', 'Sun', 'Moon'],
    sampleQuestions: [
      'Will this intended project or personal desire materialize?',
      'Is current planetary timing auspicious for initiating this plan?',
      'Will expected support from associates and elders arrive?',
    ],
  },
};

// Tajika Orb of Influence (Deeptamsha) in degrees
const TAJIKA_ORBS: Record<PlanetName, number> = {
  Sun: 15,
  Moon: 12,
  Mars: 8,
  Mercury: 7,
  Jupiter: 9,
  Venus: 7,
  Saturn: 9,
  Rahu: 6,
  Ketu: 6,
  Ascendant: 5,
};

// Planetary average speeds for faster/slower determination in Tajika yogas
const PLANET_AVG_SPEEDS: Record<PlanetName, number> = {
  Moon: 13.176,
  Mercury: 1.2,
  Venus: 1.0,
  Sun: 0.985,
  Mars: 0.524,
  Jupiter: 0.083,
  Saturn: 0.033,
  Rahu: -0.053,
  Ketu: -0.053,
  Ascendant: 360,
};

// Check classical Tajika Aspects (3, 5, 7, 9, 10 or 4, 10)
function areInTajikaAspect(pos1: number, pos2: number): { inAspect: boolean; aspectType: 'friendly' | 'neutral' | 'inimical' | 'none'; angularDiff: number } {
  const diff = Math.abs(pos1 - pos2);
  const ang = diff > 180 ? 360 - diff : diff;

  // Sextile (60°) or Trine (120°) = Friendly Pratyaksha / Mitra
  if (Math.abs(ang - 60) <= 8 || Math.abs(ang - 120) <= 8) {
    return { inAspect: true, aspectType: 'friendly', angularDiff: ang };
  }
  // Conjunction (0°) = Powerful
  if (ang <= 8) {
    return { inAspect: true, aspectType: 'friendly', angularDiff: ang };
  }
  // Square (90°) or Opposition (180°) = Inimical / Pratyaksha Shatru
  if (Math.abs(ang - 90) <= 8 || Math.abs(ang - 180) <= 8) {
    return { inAspect: true, aspectType: 'inimical', angularDiff: ang };
  }
  // Semi-sextile (30°) or Inconjunct (150°)
  if (Math.abs(ang - 30) <= 5 || Math.abs(ang - 150) <= 5) {
    return { inAspect: true, aspectType: 'neutral', angularDiff: ang };
  }

  return { inAspect: false, aspectType: 'none', angularDiff: ang };
}

// Compute Tajika Yogas between Lagna Lord and Karya Lord
export function evaluateTajikaYogas(
  lagnaLord: PlanetName,
  karyaLord: PlanetName,
  kundali: KundaliData
): HoraryYogaResult[] {
  const results: HoraryYogaResult[] = [];
  const p1 = kundali.planets[lagnaLord];
  const p2 = kundali.planets[karyaLord];
  const moon = kundali.planets.Moon;

  if (!p1 || !p2) return results;

  // 1. Same Planet (Lagna Lord is also Karya Lord)
  if (lagnaLord === karyaLord) {
    results.push({
      name: 'Eka-Adhipati Yoga (Single Ruler of Querent & Query)',
      type: 'benefic',
      planetsInvolved: [lagnaLord],
      description: `Both the Querent (Lagna) and the Query (House) are governed by ${lagnaLord}. Direct control and positive self-mastery over the outcome.`,
      isFormed: true,
    });
    return results;
  }

  const aspectInfo = areInTajikaAspect(p1.longitude, p2.longitude);
  const orb1 = TAJIKA_ORBS[lagnaLord] || 8;
  const orb2 = TAJIKA_ORBS[karyaLord] || 8;
  const maxOrb = (orb1 + orb2) / 2;

  // Determine faster and slower planet
  const speed1 = PLANET_AVG_SPEEDS[lagnaLord] || 1;
  const speed2 = PLANET_AVG_SPEEDS[karyaLord] || 1;
  const faster = speed1 > speed2 ? lagnaLord : karyaLord;
  const slower = speed1 > speed2 ? karyaLord : lagnaLord;
  const fasterPos = kundali.planets[faster].longitude;
  const slowerPos = kundali.planets[slower].longitude;

  // Faster planet applying to slower (Ithasala) or separating (Ishrafa)
  let diffAhead = slowerPos - fasterPos;
  if (diffAhead < 0) diffAhead += 360;

  const isApplying = diffAhead > 0 && diffAhead <= maxOrb;
  const isSeparating = (fasterPos - slowerPos + 360) % 360 <= maxOrb && (fasterPos - slowerPos + 360) % 360 > 1;

  if (aspectInfo.inAspect) {
    if (isApplying) {
      results.push({
        name: 'Ithasala Yoga (Muthashila - Benefic Applying Connection)',
        type: aspectInfo.aspectType === 'inimical' ? 'neutral' : 'benefic',
        planetsInvolved: [lagnaLord, karyaLord],
        description: `${faster} is swiftly applying towards ${slower} within the Tajika Deeptamsha orb. This classical yoga signifies positive culmination and successful manifestation of the question.`,
        isFormed: true,
      });
    } else if (isSeparating) {
      results.push({
        name: 'Ishrafa Yoga (Musaripha - Separating Aspect)',
        type: 'malefic',
        planetsInvolved: [lagnaLord, karyaLord],
        description: `${faster} has already moved past ${slower}. Indicates an opportunity that was near or already reached its peak; requires renewed negotiation or patience.`,
        isFormed: true,
      });
    }
  }

  // 2. Nakta Yoga (Intermediary Transfer of Light, often Moon)
  if (!aspectInfo.inAspect && moon) {
    const aspMoon1 = areInTajikaAspect(moon.longitude, p1.longitude);
    const aspMoon2 = areInTajikaAspect(moon.longitude, p2.longitude);
    if (aspMoon1.inAspect && aspMoon2.inAspect) {
      results.push({
        name: 'Nakta Yoga (Intermediary Transfer of Celestial Light)',
        type: 'benefic',
        planetsInvolved: ['Moon', lagnaLord, karyaLord],
        description: `Although ${lagnaLord} and ${karyaLord} do not aspect each other directly, the Moon connects both, acting as a divine intermediary or trusted third party to facilitate success.`,
        isFormed: true,
      });
    }
  }

  // 3. Kamboola Yoga (Moon joining in Ithasala with either Lagnesha or Karyesha)
  const moonAsp1 = areInTajikaAspect(moon.longitude, p1.longitude);
  const moonAsp2 = areInTajikaAspect(moon.longitude, p2.longitude);
  if (moonAsp1.inAspect || moonAsp2.inAspect) {
    results.push({
      name: 'Kamboola Yoga (Lunar Empowerment of the Query)',
      type: 'benefic',
      planetsInvolved: ['Moon', lagnaLord],
      description: `The Moon participates intimately with the significators, confirming strong emotional alignment and favorable cosmic energy.`,
      isFormed: true,
    });
  }

  return results;
}

// Full Astronomical & Astrological Horary Engine
export function analyzeHoraryChart(
  kundali: KundaliData,
  category: HoraryCategory
): HoraryAnalysis {
  const config = HORARY_CATEGORIES_CONFIG[category] || HORARY_CATEGORIES_CONFIG.general_success;
  const lagnaSign = kundali.planets.Ascendant.sign;
  const lagnaLord = SIGN_LORDS[lagnaSign];

  // Calculate the sign of the Karya House
  const lagnaSignIdx = kundali.planets.Ascendant.signIndex;
  const karyaSignIdx = (lagnaSignIdx + (config.karyaHouse - 1)) % 12;
  const karyaSign = ZODIAC_SIGNS[karyaSignIdx];
  const karyaLord = SIGN_LORDS[karyaSign];

  const pLagna = kundali.planets[lagnaLord];
  const pKarya = kundali.planets[karyaLord];
  const moon = kundali.planets.Moon;

  // Evaluate Tajika Yogas
  const tajikaYogas = evaluateTajikaYogas(lagnaLord, karyaLord, kundali);

  // Confidence & Verdict Scoring
  let score = 50; // base neutrality

  // 1. Lagna Lord Dignity & House Placement
  if (pLagna) {
    if (pLagna.dignity === 'Exalted') score += 15;
    else if (pLagna.dignity === 'Own Sign' || pLagna.dignity === 'Moolatrikona') score += 12;
    else if (pLagna.dignity === 'Friendly') score += 6;
    else if (pLagna.dignity === 'Debilitated') score -= 15;
    else if (pLagna.dignity === 'Enemy') score -= 8;

    // Kendra/Trikona vs Dussthana
    if ([1, 4, 7, 10, 5, 9, 11].includes(pLagna.house)) score += 8;
    else if ([6, 8, 12].includes(pLagna.house)) score -= 12;

    if (pLagna.isRetrograde && lagnaLord !== 'Rahu' && lagnaLord !== 'Ketu') score -= 5;
    if (pLagna.isCombust) score -= 6;
  }

  // 2. Karya Lord Dignity & House Placement
  if (pKarya) {
    if (pKarya.dignity === 'Exalted') score += 15;
    else if (pKarya.dignity === 'Own Sign' || pKarya.dignity === 'Moolatrikona') score += 12;
    else if (pKarya.dignity === 'Friendly') score += 6;
    else if (pKarya.dignity === 'Debilitated') score -= 15;
    else if (pKarya.dignity === 'Enemy') score -= 8;

    if ([1, 4, 7, 10, 5, 9, 11].includes(pKarya.house)) score += 10;
    else if ([6, 8, 12].includes(pKarya.house)) score -= 12;

    if (pKarya.isRetrograde && karyaLord !== 'Rahu' && karyaLord !== 'Ketu') score -= 6;
    if (pKarya.isCombust) score -= 7;
  }

  // 3. Moon (Chandra) Condition in Prashna
  if (moon) {
    if ([1, 4, 7, 10, 5, 9, 11].includes(moon.house)) score += 6;
    else if ([6, 8, 12].includes(moon.house)) score -= 10;

    if (moon.dignity === 'Exalted' || moon.dignity === 'Own Sign') score += 8;
    else if (moon.dignity === 'Debilitated') score -= 12;
  }

  // 4. Benefic Aspects in Houses of Question
  const jupiter = kundali.planets.Jupiter;
  const venus = kundali.planets.Venus;
  if (jupiter && [config.karyaHouse, 1, 11].includes(jupiter.house)) score += 10;
  if (venus && [config.karyaHouse, 1, 11].includes(venus.house)) score += 7;

  // 5. Tajika Yogas influence
  for (const yoga of tajikaYogas) {
    if (yoga.name.includes('Ithasala')) score += 16;
    if (yoga.name.includes('Eka-Adhipati')) score += 14;
    if (yoga.name.includes('Nakta')) score += 10;
    if (yoga.name.includes('Kamboola')) score += 8;
    if (yoga.name.includes('Ishrafa')) score -= 10;
  }

  // Clamp score between 10 and 96
  score = Math.max(12, Math.min(96, Math.round(score)));

  let verdict: HoraryAnalysis['verdict'];
  if (score >= 78) {
    verdict = 'Highly Favorable (Yes)';
  } else if (score >= 60) {
    verdict = 'Favorable (Yes)';
  } else if (score >= 46) {
    verdict = 'Delayed / Requires Effort';
  } else if (score >= 35) {
    verdict = 'Conditional';
  } else {
    verdict = 'Unfavorable / Challenging (No)';
  }

  // Timing of Manifestation (Phala Kala)
  // In Prashna, Movable signs indicate fast (days/weeks), Dual signs indicate medium (months), Fixed signs indicate slow/delay (years/months).
  const karyaSignType = [0, 3, 6, 9].includes(karyaSignIdx)
    ? 'Chara (Movable)'
    : [1, 4, 7, 10].includes(karyaSignIdx)
    ? 'Sthira (Fixed)'
    : 'Dwisvabhava (Dual)';

  let phalaKalaTiming = '';
  if (karyaSignType === 'Chara (Movable)') {
    phalaKalaTiming = 'Fast resolution: within 1 to 4 weeks (Chara Rasi indicator)';
  } else if (karyaSignType === 'Dwisvabhava (Dual)') {
    phalaKalaTiming = 'Moderate timing: within 2 to 3 months (Dwisvabhava Rasi indicator)';
  } else {
    phalaKalaTiming = 'Gradual or delayed outcome: 4 to 6+ months (Sthira Rasi stability/pause)';
  }

  const guidance: string[] = [];
  if (pLagna) {
    guidance.push(`Lagna Lord ${lagnaLord} occupies House ${pLagna.house} (${pLagna.sign}), representing your direct capacity and clarity of intention.`);
  }
  if (pKarya) {
    guidance.push(`Primary Significator ${karyaLord} for ${config.title} resides in House ${pKarya.house} in ${pKarya.sign} (${pKarya.dignity}).`);
  }
  guidance.push(`Moon resides in ${moon?.sign || 'its sign'} (${moon?.nakshatra || 'Nakshatra'}) in House ${moon?.house || 1}, reflecting the querent's psychological state.`);

  // Authentic Vedic Remedy
  let remedy = '';
  if (karyaLord === 'Sun') remedy = 'Offer water to Surya Deva at sunrise and chant the Gayatri Mantra 27 times.';
  else if (karyaLord === 'Moon') remedy = 'Offer milk or water on Shiva Lingam on Mondays and wear white or pearls.';
  else if (karyaLord === 'Mars') remedy = 'Recite the Hanuman Chalisa on Tuesday and maintain high personal integrity.';
  else if (karyaLord === 'Mercury') remedy = 'Feed green fodder or spinach to cows and chant Om Budhaya Namaha.';
  else if (karyaLord === 'Jupiter') remedy = 'Apply saffron tilak, honor teachers/elders, and chant Om Gram Greem Graum Sah Gurave Namaha.';
  else if (karyaLord === 'Venus') remedy = 'Show respect to women and artistic mentors; offer white sweets or rice in charity on Friday.';
  else if (karyaLord === 'Saturn') remedy = 'Light a mustard oil lamp near a Peepal tree on Saturday evening and help laborers.';
  else remedy = 'Chant Maha Mrityunjaya Mantra and perform selfless service for peaceful resolutions.';

  const astrologicalSummary = `Prashna Lagna is in ${lagnaSign} (${lagnaLord}), querying matters of House ${config.karyaHouse} ruled by ${karyaLord}. ${
    tajikaYogas.length > 0 ? tajikaYogas.map((y) => y.name).join(', ') : 'Standard angular relationship between Lagnesha and Karyesha.'
  }`;

  return {
    verdict,
    confidenceScore: score,
    karyaHouse: config.karyaHouse,
    karyaSignificatorPlanet: karyaLord,
    lagnaLord,
    moonNakshatra: moon?.nakshatra || '',
    moonHouse: moon?.house || 1,
    tajikaYogas,
    phalaKalaTiming,
    astrologicalSummary,
    guidance,
    remedy,
  };
}

// Generate complete Horary Chart Data
export function generateHoraryKundali(params: HoraryQueryParams): HoraryChartData {
  const birthEquivalent: BirthDetails = {
    id: `horary-${Date.now()}`,
    name: `Prashna: ${params.question.slice(0, 30)}`,
    gender: 'other',
    dateOfBirth: params.date,
    timeOfBirth: params.time.slice(0, 5),
    placeOfBirth: params.place,
    latitude: params.latitude,
    longitude: params.longitude,
    timezone: params.timezone,
  };

  let kundali = generateKundali(birthEquivalent);
  let kpDetails: HoraryChartData['kpDetails'] = undefined;

  // If in KP Horary Seed mode (1 to 249), override Ascendant to the exact seed arc entry
  if (params.mode === 'kp_seed' && params.kpSeedNumber && params.kpSeedNumber >= 1 && params.kpSeedNumber <= 249) {
    const kpEntry = KP_249_TABLE[params.kpSeedNumber - 1];
    if (kpEntry) {
      const entryLon = kpEntry.startLongitude;
      const signIdx = kpEntry.signIndex;
      const degInSign = entryLon % 30;
      const deg = Math.floor(degInSign);
      const min = Math.floor((degInSign - deg) * 60);
      const sec = Math.floor((((degInSign - deg) * 60) - min) * 60);

      // Re-assign Ascendant
      kundali.planets.Ascendant = {
        name: 'Ascendant',
        sanskritName: 'Lagna',
        longitude: entryLon,
        sign: kpEntry.sign,
        sanskritSign: SANSKRIT_SIGNS[signIdx],
        signIndex: signIdx,
        degrees: deg,
        minutes: min,
        seconds: sec,
        house: 1,
        isRetrograde: false,
        isCombust: false,
        dignity: 'Neutral',
        nakshatra: kpEntry.nakshatra,
        nakshatraNumber: kpEntry.nakshatraIndex + 1,
        nakshatraLord: kpEntry.starLord,
        pada: Math.floor(((entryLon % (800 / 60)) / (800 / 60 / 4))) + 1,
      };

      // Re-compute all planetary house placements relative to new KP Lagna
      Object.keys(kundali.planets).forEach((key) => {
        const pName = key as PlanetName;
        const p = kundali.planets[pName];
        let h = ((p.signIndex - signIdx + 12) % 12) + 1;
        p.house = h;
      });

      if (kundali.outerPlanets) {
        kundali.outerPlanets.forEach((op) => {
          op.house = ((op.signIndex - signIdx + 12) % 12) + 1;
        });
      }

      kpDetails = {
        seedNumber: params.kpSeedNumber,
        subLord: kpEntry.subLord,
        starLord: kpEntry.starLord,
        signLord: kpEntry.signLord,
        startLongitude: kpEntry.startLongitude,
        endLongitude: kpEntry.endLongitude,
      };
    }
  }

  const analysis = analyzeHoraryChart(kundali, params.category);

  return {
    queryParams: params,
    kundali,
    kpDetails,
    analysis,
  };
}
