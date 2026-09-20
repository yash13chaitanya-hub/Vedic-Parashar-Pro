export type ZodiacSign =
  | 'Aries'
  | 'Taurus'
  | 'Gemini'
  | 'Cancer'
  | 'Leo'
  | 'Virgo'
  | 'Libra'
  | 'Scorpio'
  | 'Sagittarius'
  | 'Capricorn'
  | 'Aquarius'
  | 'Pisces';

export type SanskritSign =
  | 'Mesha'
  | 'Vrishabha'
  | 'Mithuna'
  | 'Karka'
  | 'Simha'
  | 'Kanya'
  | 'Tula'
  | 'Vrishchika'
  | 'Dhanu'
  | 'Makara'
  | 'Kumbha'
  | 'Meena';

export type PlanetName =
  | 'Sun'
  | 'Moon'
  | 'Mars'
  | 'Mercury'
  | 'Jupiter'
  | 'Venus'
  | 'Saturn'
  | 'Rahu'
  | 'Ketu'
  | 'Ascendant';

export type SanskritPlanet =
  | 'Surya'
  | 'Chandra'
  | 'Mangal'
  | 'Budha'
  | 'Guru'
  | 'Shukra'
  | 'Shani'
  | 'Rahu'
  | 'Ketu'
  | 'Lagna';

export interface PlanetPosition {
  name: PlanetName;
  sanskritName: SanskritPlanet;
  longitude: number; // 0 - 360
  sign: ZodiacSign;
  sanskritSign: SanskritSign;
  signIndex: number; // 0 to 11
  degrees: number; // 0 to 30
  minutes: number;
  seconds: number;
  house: number; // 1 to 12
  isRetrograde: boolean;
  isCombust: boolean;
  dignity: 'Exalted' | 'Debilitated' | 'Moolatrikona' | 'Own Sign' | 'Friendly' | 'Neutral' | 'Enemy';
  nakshatra: string;
  nakshatraNumber: number; // 1 to 27
  nakshatraLord: string;
  pada: number; // 1 to 4
  speed?: number;
}

export interface HouseInfo {
  houseNumber: number;
  sign: ZodiacSign;
  sanskritSign: SanskritSign;
  signIndex: number;
  planets: PlanetName[];
  aspects: PlanetName[];
  signLord: PlanetName;
}

export interface DashaPeriod {
  lord: PlanetName;
  sanskritLord: SanskritPlanet;
  startDate: string;
  endDate: string;
  durationYears: number;
  isCurrent?: boolean;
  subDashas?: {
    lord: PlanetName;
    startDate: string;
    endDate: string;
    isCurrent?: boolean;
  }[];
}

export interface BirthDetails {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string; // YYYY-MM-DD
  timeOfBirth: string; // HH:MM
  placeOfBirth: string;
  latitude: number;
  longitude: number;
  timezone: number; // e.g., +5.5 for IST
  isUnknownBirthDetails?: boolean; // When user does not know their birth year, date, or time (Nashta Jataka / Prashna Mode)
}

export interface OuterPlanetInfo {
  name: 'Uranus' | 'Neptune' | 'Pluto';
  symbol: string;
  longitude: number;
  sign: ZodiacSign;
  sanskritSign: SanskritSign;
  signIndex: number;
  degrees: number;
  minutes: number;
  seconds?: number;
  house: number;
  isRetrograde: boolean;
  nakshatra?: string;
}

export interface KundaliData {
  birthDetails: BirthDetails;
  ayanamsha: number;
  ayanamshaName: string;
  julianDay: number;
  planets: Record<PlanetName, PlanetPosition>;
  outerPlanets?: OuterPlanetInfo[];
  houses: HouseInfo[];
  divisionalCharts: {
    d1: Record<PlanetName, number>; // Rashi (signIndex per planet)
    d2: Record<PlanetName, number>; // Hora (Wealth)
    d3: Record<PlanetName, number>; // Drekkana (Siblings, Courage)
    d4: Record<PlanetName, number>; // Chaturthamsha (Fixed Assets, Property)
    d5: Record<PlanetName, number>; // Panchamsha (Fame, Prowess)
    d6: Record<PlanetName, number>; // Shashtamsha (Health, Debts, Enemies)
    d7: Record<PlanetName, number>; // Saptamsha (Children, Progeny)
    d8: Record<PlanetName, number>; // Ashtamsha (Longevity, Hazards)
    d9: Record<PlanetName, number>; // Navamsha (Spouse, Dharma)
    d10: Record<PlanetName, number>; // Dashamsha (Career, Profession)
    d11: Record<PlanetName, number>; // Rudramsha (Gains, Overcoming hurdles)
    d12: Record<PlanetName, number>; // Dwadashamsha (Parents, Lineage)
    d13: Record<PlanetName, number>; // Trayodashamsha (Hidden talents)
    d14: Record<PlanetName, number>; // Chaturdashamsha (Transcendence)
    d15: Record<PlanetName, number>; // Panchadashamsha (Character, Bhakti)
    d16: Record<PlanetName, number>; // Shodashamsha (Vehicles, Luxuries, Inner happiness)
    d20: Record<PlanetName, number>; // Vimsamsha (Spiritual Upasana)
    d24: Record<PlanetName, number>; // Chaturvimsamsha / Siddhamsa (Education)
    d27: Record<PlanetName, number>; // Saptavimsamsha / Bhamsa (Strengths)
    d30: Record<PlanetName, number>; // Trimsamsha (Arishta, Misfortunes)
    d40: Record<PlanetName, number>; // Khavedamsha (Matrilineal, Auspiciousness)
    d45: Record<PlanetName, number>; // Akshavedamsha (General Well-being)
    d60: Record<PlanetName, number>; // Shashtiamsha (Past Karma - Pinnacle of BPHS)
    chandraKundali: Record<PlanetName, number>; // Moon as 1st house
  };
  vimsopakaScores?: Record<PlanetName, VimsopakaScore>;
  vimshottariDasha: {
    balanceAtBirthYears: number;
    birthBalanceLord: PlanetName;
    currentMahadasha: DashaPeriod;
    currentAntardasha: {
      lord: PlanetName;
      startDate: string;
      endDate: string;
    };
    allMahadashas: DashaPeriod[];
  };
  panchanga: {
    tithi: string;
    tithiPaksha: 'Shukla' | 'Krishna';
    vara: string;
    nakshatra: string;
    yoga: string;
    karana: string;
  };
  sadeSati: {
    status: 'Not Active' | 'Rising Phase (12th House)' | 'Peak Phase (1st House / Janma)' | 'Setting Phase (2nd House)';
    isActive: boolean;
    saturnSign: ZodiacSign;
    moonSign: ZodiacSign;
    summary: string;
  };
  ashtakavargaScores: Record<number, number>; // house 1-12 score (typically 20-38)
}

export interface DailyHoroscope {
  date: string;
  dayName: string;
  userSummary: string;
  overallScore: number; // 0 - 100
  moonTransitSign: ZodiacSign;
  moonTransitNakshatra: string;
  aspectsSummary: string;
  ratings: {
    careerAndWealth: number;
    loveAndFamily: number;
    healthAndVitality: number;
    spiritualityAndMind: number;
  };
  predictions: {
    general: string;
    career: string;
    relationships: string;
    health: string;
  };
  muhurtaGuidance: {
    auspiciousPeriod: string;
    rahuKalam: string;
    abhijitMuhurta: string;
    favorableDirection: string;
    luckyColor: string;
    luckyNumber: number;
  };
  remedies: {
    dailyMantra: string;
    deity: string;
    charityAction: string;
    gemstoneGuidance: string;
  };
  activeDashaInfluence: string;
}

export interface KundaliMilanResult {
  maleName: string;
  femaleName: string;
  varna: { score: number; max: 1; description: string };
  vashya: { score: number; max: 2; description: string };
  tara: { score: number; max: 3; description: string };
  yoni: { score: number; max: 4; description: string };
  grahaMaitri: { score: number; max: 5; description: string };
  gana: { score: number; max: 6; description: string };
  bhakoot: { score: number; max: 7; description: string };
  nadi: { score: number; max: 8; description: string };
  totalScore: number; // out of 36
  verdict: 'Excellent' | 'Good' | 'Average' | 'Challenging';
  manglikAnalysis: {
    maleManglik: boolean;
    femaleManglik: boolean;
    doshaCancelled: boolean;
    explanation: string;
  };
}

export type HoraryCategory =
  | 'career_job'
  | 'finance_wealth'
  | 'love_marriage'
  | 'health_recovery'
  | 'property_vehicle'
  | 'education_exam'
  | 'travel_foreign'
  | 'legal_dispute'
  | 'lost_item'
  | 'general_success';

export interface HoraryQueryParams {
  question: string;
  category: HoraryCategory;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS or HH:MM
  place: string;
  latitude: number;
  longitude: number;
  timezone: number;
  kpSeedNumber?: number; // 1 to 249
  mode: 'time_based' | 'kp_seed';
  isUnknownBirthDetails?: boolean;
}

export interface HoraryYogaResult {
  name: string;
  type: 'benefic' | 'malefic' | 'neutral';
  planetsInvolved: PlanetName[];
  description: string;
  isFormed: boolean;
}

export interface HoraryAnalysis {
  verdict: 'Highly Favorable (Yes)' | 'Favorable (Yes)' | 'Delayed / Requires Effort' | 'Unfavorable / Challenging (No)' | 'Conditional';
  confidenceScore: number; // 0 - 100%
  karyaHouse: number;
  karyaSignificatorPlanet: PlanetName;
  lagnaLord: PlanetName;
  moonNakshatra: string;
  moonHouse: number;
  tajikaYogas: HoraryYogaResult[];
  phalaKalaTiming: string;
  astrologicalSummary: string;
  guidance: string[];
  remedy: string;
}

export interface HoraryAiResponse {
  verdictTitle: string;
  verdictBadge: 'Yes' | 'Likely Yes' | 'Delayed' | 'Caution / No';
  directAnswer: string;
  astrologicalBasis: string;
  dashaAnalysis?: string;
  timingEstimate: string;
  actionableAdvice: string[];
  remedies: string;
}

export interface HoraryChartData {
  queryParams: HoraryQueryParams;
  kundali: KundaliData;
  kpDetails?: {
    seedNumber: number;
    subLord: PlanetName;
    starLord: PlanetName;
    signLord: PlanetName;
    startLongitude: number;
    endLongitude: number;
  };
  analysis: HoraryAnalysis;
  aiInterpretation?: HoraryAiResponse;
}

// Shodashvarga (D1 to D16 + Higher Vargas) Types
export type VargaCode =
  | 'd1'
  | 'd2'
  | 'd3'
  | 'd4'
  | 'd5'
  | 'd6'
  | 'd7'
  | 'd8'
  | 'd9'
  | 'd10'
  | 'd11'
  | 'd12'
  | 'd13'
  | 'd14'
  | 'd15'
  | 'd16'
  | 'd20'
  | 'd24'
  | 'd27'
  | 'd30'
  | 'd40'
  | 'd45'
  | 'd60'
  | 'chandraKundali';

export interface VargaDefinition {
  code: VargaCode;
  dNumber: number;
  name: string;
  sanskritName: string;
  divisionArc: string;
  significance: string;
  category: 'Body & Wealth (D1-D4)' | 'Karma & Progeny (D5-D8)' | 'Destiny & Profession (D9-D12)' | 'Higher Vibrations (D13-D16)' | 'Parashara Mahavargas (D20-D60)';
  parasharaWeight?: number; // out of 20 in Shodashvarga Vimsopaka Bala
  deities?: string;
  description: string;
  classicalRule: string;
}

export interface VimsopakaScore {
  planet: PlanetName;
  score: number; // out of 20
  percentage: number;
  grade: 'Pramana (Supreme >15)' | 'Madhyama (Strong 10-15)' | 'Sadharana (Moderate 7-10)' | 'Alpa (Weak <7)';
  vargaDignities: Partial<Record<VargaCode, 'Exalted' | 'Moolatrikona' | 'Own Sign' | 'Great Friend' | 'Friend' | 'Neutral' | 'Enemy' | 'Debilitated'>>;
}

// All 22 Official Scheduled Indian Languages + English
export type IndianLanguageCode =
  | 'hi' // Hindi (हिन्दी)
  | 'sa' // Sanskrit (संस्कृतम्)
  | 'bn' // Bengali (বাংলা)
  | 'te' // Telugu (తెలుగు)
  | 'mr' // Marathi (मराठी)
  | 'ta' // Tamil (தமிழ்)
  | 'gu' // Gujarati (ગુજરાતી)
  | 'kn' // Kannada (ಕನ್ನಡ)
  | 'ml' // Malayalam (മലയാളം)
  | 'pa' // Punjabi (ਪੰਜਾਬੀ)
  | 'or' // Odia (ଓଡ଼ିଆ)
  | 'as' // Assamese (অসমীয়া)
  | 'ur' // Urdu (اردو)
  | 'mai' // Maithili (मैथिली)
  | 'sat' // Santali (ᱥᱟᱱᱛᱟᱲᱤ)
  | 'ks' // Kashmiri (कॉशुर)
  | 'ne' // Nepali (नेपाली)
  | 'kok' // Konkani (कोंकणी)
  | 'sd' // Sindhi (सिन्धी)
  | 'doi' // Dogri (डोगरी)
  | 'mni' // Manipuri / Meitei (মৈতৈলোন্)
  | 'brx' // Bodo (बड़ो)
  | 'en'; // English

export interface LanguageMeta {
  code: IndianLanguageCode;
  name: string;
  nativeName: string;
  region: string;
  script: string;
  astrologyTradition: string;
  greeting: string;
  sampleQuestionsEasy: string[];
  sampleQuestionsComplex: string[];
}

// AstroSage 100+ Free Reports & Tools Types
export type AstroSageReportCategory =
  | 'predictions'
  | 'life-predictions'
  | 'monthly-predictions'
  | 'dosha-reports'
  | 'lal-kitab'
  | 'varshphal';

export type AstroSageToolId =
  | 'basic'
  | 'dasha'
  | 'kp-system'
  | 'shodashvarga'
  | 'lal-kitab'
  | 'varshphal'
  | 'life-predictions'
  | 'monthly-predictions'
  | 'daily-predictions'
  | 'mangal-dosh'
  | 'sade-sati-life'
  | 'kaal-sarp-dosha'
  | 'lal-kitab-debt'
  | 'lal-kitab-teva'
  | 'lal-kitab-remedies'
  | 'ascendant-prediction'
  | 'planet-consideration'
  | 'gemstones-report'
  | 'transit-today'
  | 'mahadasha-phala';

export interface MangalDoshaAnalysis {
  isManglik: boolean;
  severity: 'None' | 'Low / Partial (Anshik)' | 'High (Purna Manglik)';
  percentage: number;
  lagnaCheck: { house: number; isManglik: boolean; description: string };
  moonCheck: { house: number; isManglik: boolean; description: string };
  venusCheck: { house: number; isManglik: boolean; description: string };
  cancellations: string[];
  effects: string[];
  remedies: string[];
}

export interface KaalSarpDoshaAnalysis {
  present: boolean;
  type: 'None' | 'Purna (Full)' | 'Anshik (Partial)';
  name: string;
  sanskritName: string;
  rahuHouse: number;
  ketuHouse: number;
  direction: 'Savya (Ascending / Udit)' | 'Apasavya (Descending / Anudit)';
  planetsTrapped: string[];
  effects: string[];
  positiveYogas: string[];
  remedies: string[];
}

export interface LalKitabDebtItem {
  id: string;
  name: string;
  hindiName: string;
  present: boolean;
  indication: string;
  pastLifeCause: string;
  remedy: string;
}

export interface LalKitabAnalysis {
  tevaType: {
    primary: string;
    description: string;
    guidelines: string[];
  };
  kismatKaGrah: PlanetName;
  sleepingHouses: number[];
  sleepingPlanets: PlanetName[];
  debts: LalKitabDebtItem[];
  planetRemedies: Array<{
    planet: PlanetName;
    house: number;
    pakkaGhar: number;
    karka: string;
    nature: string;
    upay: string[];
  }>;
}

export interface VarshphalAnalysis {
  targetYear: number;
  nativeAge: number;
  solarReturnDate: string;
  muntha: {
    sign: ZodiacSign;
    house: number;
    lord: PlanetName;
    auspiciousness: 'Highly Auspicious' | 'Auspicious' | 'Challenging / Sensitive';
    prediction: string;
  };
  varshesh: {
    planet: PlanetName;
    title: string;
    balaRank: string;
    significance: string;
  };
  sahams: Array<{
    name: string;
    sanskritName: string;
    sign: ZodiacSign;
    degrees: number;
    significance: string;
  }>;
  tajikYogas: Array<{
    name: string;
    planets: [PlanetName, PlanetName];
    type: string;
    result: string;
  }>;
  monthlyOutlook: Array<{
    month: string;
    sunSign: ZodiacSign;
    rating: number; // 1 to 5 stars
    forecast: string;
  }>;
}

export interface GemstoneRecommendation {
  type: 'Life Stone (Lagna Ratna)' | 'Lucky Stone (Bhagya Ratna)' | 'Wisdom Stone (Punya Ratna)';
  planet: PlanetName;
  primaryGem: string;
  sanskritGem: string;
  substituteGems: string[];
  caratWeight: string;
  metal: string;
  finger: string;
  wearingDayTime: string;
  mantra: string;
  benefits: string[];
  incompatibleGems: string[];
}

