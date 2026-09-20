import {
  KundaliData,
  PlanetName,
  ZodiacSign,
  MangalDoshaAnalysis,
  KaalSarpDoshaAnalysis,
  LalKitabAnalysis,
  LalKitabDebtItem,
  VarshphalAnalysis,
  GemstoneRecommendation,
} from '../types';

const ZODIAC_SIGNS: ZodiacSign[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const SIGN_LORDS: Record<ZodiacSign, PlanetName> = {
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

// -------------------------------------------------------------
// 1. MANGAL DOSH (KUJA DOSHA) ENGINE
// -------------------------------------------------------------
export function calculateMangalDosha(kundali: KundaliData): MangalDoshaAnalysis {
  const mars = kundali.planets.Mars;
  const lagna = kundali.planets.Ascendant;
  const moon = kundali.planets.Moon;
  const venus = kundali.planets.Venus;
  const jupiter = kundali.planets.Jupiter;
  const saturn = kundali.planets.Saturn;

  // Mangal Dosha houses: 1, 2, 4, 7, 8, 12 (South & North traditions)
  const manglikHouses = [1, 2, 4, 7, 8, 12];

  // House from Lagna
  const houseFromLagna = mars.house;
  const isLagnaManglik = manglikHouses.includes(houseFromLagna);

  // House from Moon
  const moonHouse = moon.house;
  const houseFromMoon = ((mars.house - moonHouse + 12) % 12) || 12;
  const isMoonManglik = manglikHouses.includes(houseFromMoon);

  // House from Venus
  const venusHouse = venus.house;
  const houseFromVenus = ((mars.house - venusHouse + 12) % 12) || 12;
  const isVenusManglik = manglikHouses.includes(houseFromVenus);

  // Cancellations & Exceptions based on classical Brihat Parashara Hora Shastra
  const cancellations: string[] = [];

  if (mars.sign === 'Aries' && houseFromLagna === 1) {
    cancellations.push('Mars in own sign Aries in the 1st house cancels Kuja Dosha (Swakshetra Parashari exception).');
  }
  if (mars.sign === 'Scorpio' && houseFromLagna === 4) {
    cancellations.push('Mars in own sign Scorpio in the 4th house neutralizes the affliction.');
  }
  if (mars.sign === 'Capricorn' && (houseFromLagna === 7 || houseFromLagna === 8)) {
    cancellations.push('Exalted Mars (Uchha Mangal) in Capricorn in 7th/8th house transforms aggression into perseverance.');
  }
  if (mars.sign === 'Sagittarius' || mars.sign === 'Pisces') {
    if (houseFromLagna === 8 || houseFromLagna === 12) {
      cancellations.push('Mars placed in Jupiterian signs (Dhanu/Meena) has subdued maleficence.');
    }
  }
  if (jupiter.house === mars.house || ((jupiter.house - mars.house + 12) % 12 === 4) || ((jupiter.house - mars.house + 12) % 12 === 8)) {
    cancellations.push('Benefic Jupiter conjuncts or casts its 5th/9th divine aspect on Mars, neutralizing severity.');
  }
  if (saturn.house === mars.house) {
    cancellations.push('Saturn-Mars conjunction creates mutual checks and balances in marital affairs.');
  }
  if (moon.sign === 'Cancer' || moon.sign === 'Taurus') {
    cancellations.push('Exalted or strong Moon provides emotional fortitude against impulsive outbursts.');
  }

  const rawCount = (isLagnaManglik ? 1 : 0) + (isMoonManglik ? 0.7 : 0) + (isVenusManglik ? 0.5 : 0);
  const cancelDiscount = cancellations.length * 0.4;
  const finalScore = Math.max(0, rawCount - cancelDiscount);

  let isManglik = false;
  let severity: 'None' | 'Low / Partial (Anshik)' | 'High (Purna Manglik)' = 'None';
  let percentage = 0;

  if (isLagnaManglik || isMoonManglik || isVenusManglik) {
    if (cancellations.length >= 2 || finalScore < 0.6) {
      isManglik = true;
      severity = 'Low / Partial (Anshik)';
      percentage = Math.round(Math.min(45, Math.max(20, finalScore * 30)));
    } else {
      isManglik = true;
      severity = 'High (Purna Manglik)';
      percentage = Math.round(Math.min(95, Math.max(60, finalScore * 45)));
    }
  }

  const effects = [
    `Mars resides in House ${houseFromLagna} (${mars.sign}), impacting communication, drive, and personal assertiveness.`,
    isLagnaManglik ? 'Active Lagna Manglik creates passionate temperament and high expectations in relationships.' : 'No direct Lagna Kuja Dosha.',
    isMoonManglik ? `Moon-based Mangal placement in House ${houseFromMoon} creates emotional sensitivity in partnerships.` : 'Mind and emotions remain unclouded by lunar Kuja Dosha.',
    'Classical Jyotish advises matching kundalis with another native having similar planetary vigor or performing Vedic remedies.'
  ];

  const remedies = [
    'Chant the sacred Mangal Gayatri Mantra: "ॐ अंगारकाय विद्महे शक्तिहस्ताय धीमहि तन्नो भौमः प्रचोदयात्" 108 times on Tuesdays.',
    'Recite Sri Hanuman Chalisa daily at sunrise facing East with pure devotion.',
    'Donate red lentils (Masoor Dal), copper utensils, or red sweets to needy individuals or temples on Tuesday afternoons.',
    'For severe afflictions prior to marriage, Kumbh Vivah or Vishnu Pratima Vivah can be performed by Vedic priests.',
    'Wear a natural, untreated Italian Red Coral (Moonga) only after examining Mars functional lordship for your specific Lagna.'
  ];

  return {
    isManglik,
    severity,
    percentage,
    lagnaCheck: {
      house: houseFromLagna,
      isManglik: isLagnaManglik,
      description: isLagnaManglik ? `Mars is in House ${houseFromLagna} from Lagna (Manglik).` : `Mars in House ${houseFromLagna} is non-Manglik from Lagna.`
    },
    moonCheck: {
      house: houseFromMoon,
      isManglik: isMoonManglik,
      description: isMoonManglik ? `Mars is in House ${houseFromMoon} from Moon (Chandra Manglik).` : `Mars is in House ${houseFromMoon} from Moon (Clear).`
    },
    venusCheck: {
      house: houseFromVenus,
      isManglik: isVenusManglik,
      description: isVenusManglik ? `Mars is in House ${houseFromVenus} from Venus (Shukra Manglik).` : `Mars is in House ${houseFromVenus} from Venus (Clear).`
    },
    cancellations,
    effects,
    remedies,
  };
}

// -------------------------------------------------------------
// 2. KAAL SARP DOSHA (ALL 12 TYPES) ENGINE
// -------------------------------------------------------------
const KAAL_SARP_NAMES = [
  { rahuHouse: 1, ketuHouse: 7, name: 'Anant Kaal Sarp Dosha', sanskrit: 'अनन्त कालसर्प दोष', effect: 'Impacts personality, health, marriage partnership and creates prolonged mental restlessness.' },
  { rahuHouse: 2, ketuHouse: 8, name: 'Kulik Kaal Sarp Dosha', sanskrit: 'कुलिक कालसर्प दोष', effect: 'Affects wealth accumulation, family lineage, speech articulation, and unexpected fiscal fluctuations.' },
  { rahuHouse: 3, ketuHouse: 9, name: 'Vasuki Kaal Sarp Dosha', sanskrit: 'वासुकी कालसर्प दोष', effect: 'Influences courage, younger siblings, travel, and requires extra perseverance for destiny (Bhagya) to unfold.' },
  { rahuHouse: 4, ketuHouse: 10, name: 'Shankhpal Kaal Sarp Dosha', sanskrit: 'शंखपाल कालसर्प दोष', effect: 'Strains domestic harmony, mother’s health, fixed assets, and causes periodic career repositioning.' },
  { rahuHouse: 5, ketuHouse: 11, name: 'Padma Kaal Sarp Dosha', sanskrit: 'पद्म कालसर्प दोष', effect: 'Creates delays in higher education, speculation risks, progeny concerns, but yields profound spiritual intellect.' },
  { rahuHouse: 6, ketuHouse: 12, name: 'Mahapadma Kaal Sarp Dosha', sanskrit: 'महापद्म कालसर्प दोष', effect: 'Triggers victory over open adversaries after struggles, secret enemies, sleep disruption, and hospital/foreign expenses.' },
  { rahuHouse: 7, ketuHouse: 1, name: 'Takshak Kaal Sarp Dosha', sanskrit: 'तक्षक कालसर्प दोष', effect: 'Focuses deeply on marriage delays, partnership friction, legal entanglements, and independent business hurdles.' },
  { rahuHouse: 8, ketuHouse: 2, name: 'Karkotak Kaal Sarp Dosha', sanskrit: 'कर्कोटक कालसर्प दोष', effect: 'Brings sudden life transformations, inheritance hurdles, ancestral issues, and sudden spiritual breakthroughs.' },
  { rahuHouse: 9, ketuHouse: 3, name: 'Shankhchud Kaal Sarp Dosha', sanskrit: 'शंखचूड़ कालसर्प दोष', effect: 'Tests faith in divine grace, challenges with mentors/father, yet grants sudden rise in status after mid-30s.' },
  { rahuHouse: 10, ketuHouse: 4, name: 'Ghatak Kaal Sarp Dosha', sanskrit: 'घातक कालसर्प दोष', effect: 'Demands tremendous hard work in professional career, public reputation tests, and balance between work and home.' },
  { rahuHouse: 11, ketuHouse: 5, name: 'Vishdhar Kaal Sarp Dosha', sanskrit: 'विषधर कालसर्प दोष', effect: 'Fluctuating income streams, elder sibling friction, ocular or memory sensitivity, but massive sudden gains.' },
  { rahuHouse: 12, ketuHouse: 6, name: 'Sheshnag Kaal Sarp Dosha', sanskrit: 'शेषनाग कालसर्प दोष', effect: 'High expenditures, foreign relocation or detachment, legal disputes followed by serene spiritual awakening.' },
];

export function calculateKaalSarpDosha(kundali: KundaliData): KaalSarpDoshaAnalysis {
  const rahu = kundali.planets.Rahu;
  const ketu = kundali.planets.Ketu;
  const rahuLong = rahu.longitude;
  const ketuLong = ketu.longitude;

  const physicalPlanets: PlanetName[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

  let clockwiseCount = 0;
  let counterClockwiseCount = 0;
  const trappedPlanets: string[] = [];

  for (const p of physicalPlanets) {
    const plLong = kundali.planets[p]?.longitude ?? 0;
    // Check if planet is within the arc from Rahu to Ketu
    const distRahuToKetu = (ketuLong - rahuLong + 360) % 360;
    const distRahuToPlanet = (plLong - rahuLong + 360) % 360;

    if (distRahuToPlanet < distRahuToKetu) {
      clockwiseCount++;
      trappedPlanets.push(p);
    } else {
      counterClockwiseCount++;
    }
  }

  const isPurna = clockwiseCount === 7 || counterClockwiseCount === 7;
  const isAnshik = clockwiseCount === 6 || counterClockwiseCount === 6;
  const present = isPurna || isAnshik;

  const rahuHouse = rahu.house;
  const matchedType = KAAL_SARP_NAMES.find(k => k.rahuHouse === rahuHouse) || KAAL_SARP_NAMES[0];

  const direction: 'Savya (Ascending / Udit)' | 'Apasavya (Descending / Anudit)' =
    clockwiseCount >= counterClockwiseCount ? 'Savya (Ascending / Udit)' : 'Apasavya (Descending / Anudit)';

  const effects = present
    ? [
        `${matchedType.name} is identified with Rahu in House ${rahuHouse} and Ketu in House ${matchedType.ketuHouse}.`,
        matchedType.effect,
        isPurna
          ? 'All seven classical grahas are enclosed within the nodal Rahu-Ketu axis, intensifying karmic debt (Prarabdha Karma).'
          : 'Six grahas are enclosed while one planet escapes, forming an Anshik (partial) Kaal Sarp with reduced friction.',
        'Early struggles usually stabilize significantly after age 28 or 33 as wisdom and resilience mature.'
      ]
    : [
        'Planets freely cross the Rahu-Ketu nodal axis.',
        'No Kaal Sarp Dosha is formed in your natal chart.',
        'Your chart possesses uninhibited planetary flow for ambition, wealth, and relationships.'
      ];

  const positiveYogas = [
    'Kaal Sarp Yoga bestows extraordinary drive, non-conventional thinking, and capacity to handle extreme crisis.',
    'Historically, world leaders, visionary scientists, and transformative reformers have possessed strong Kaal Sarp Yogas.',
    'Forces deep spiritual inquiry, breaking generational karmic cycles and developing great self-reliance.'
  ];

  const remedies = [
    'Recite the Maha Mrityunjaya Mantra 108 times daily at dawn: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात्॥"',
    'Perform Rudrabhishek with holy milk, Panchamrit, and Bilva patra on Mondays or during Pradosh Vrat.',
    'Offer milk and prayers to Nag Devta on Nag Panchami. Never harm or kill any snake or reptilian creature.',
    'Feed stray dogs and birds daily with whole wheat grains and water.',
    'Wearing a consecrated open-ended silver snake ring on the little finger of the right hand is a classical remedy.'
  ];

  return {
    present,
    type: isPurna ? 'Purna (Full)' : isAnshik ? 'Anshik (Partial)' : 'None',
    name: matchedType.name,
    sanskritName: matchedType.sanskrit,
    rahuHouse,
    ketuHouse: matchedType.ketuHouse,
    direction,
    planetsTrapped: trappedPlanets,
    effects,
    positiveYogas,
    remedies,
  };
}

// -------------------------------------------------------------
// 3. LAL KITAB ENGINE (TEVA TYPE, 9 DEBTS & REMEDIES)
// -------------------------------------------------------------
export function calculateLalKitabReport(kundali: KundaliData): LalKitabAnalysis {
  const { planets, houses } = kundali;
  const sun = planets.Sun;
  const moon = planets.Moon;
  const mars = planets.Mars;
  const mercury = planets.Mercury;
  const jupiter = planets.Jupiter;
  const venus = planets.Venus;
  const saturn = planets.Saturn;
  const rahu = planets.Rahu;
  const ketu = planets.Ketu;

  // Lal Kitab Teva Type determination
  let tevaTitle = 'Sadharan Teva (Balanced Horoscope)';
  let tevaDesc = 'Standard karmic balance with mixed active and dormant planetary influences.';
  const tevaGuidelines: string[] = [];

  // Dharmi Teva Check: Jupiter in 1st/11th or Saturn-Jupiter benign alignment
  if (jupiter.house === 1 || jupiter.house === 11 || (saturn.house === 11 && jupiter.house === 9)) {
    tevaTitle = 'Dharmi Teva (Pious / Protected Horoscope)';
    tevaDesc = 'Divine shield: Even severe malefic transits will not inflict mortal harm on the native due to ancestral virtues (Punya).';
    tevaGuidelines.push('Maintain strict ethical conduct and refrain from taking free items or ill-gotten wealth.');
    tevaGuidelines.push('Support religious and educational institutions.');
  } else if (saturn.house === 7 && sun.house === 1) {
    tevaTitle = 'Rattandh Teva (Night Blind Horoscope)';
    tevaDesc = 'Fortune operates brightly during daylight hours but dims after dusk. Major decisions must be finalized before sunset.';
    tevaGuidelines.push('Never make crucial business deals or financial transactions after sunset.');
    tevaGuidelines.push('Feed stray dogs sweet rotis baked in an iron skillet.');
  } else if (saturn.house === 7 && (moon.house !== 1 && jupiter.house !== 1)) {
    tevaTitle = 'Andha Teva (Blind Horoscope)';
    tevaDesc = '10th house is unassisted while Saturn occupies 7th house, causing occasional opacity in career direction.';
    tevaGuidelines.push('Feed 10 blind people or support charitable causes for visually impaired individuals.');
    tevaGuidelines.push('Avoid partnership businesses where you do not have direct signature authority.');
  } else {
    tevaGuidelines.push('Perform planetary remedies with purity, during daylight hours only (between sunrise and sunset).');
    tevaGuidelines.push('Do not perform more than one Lal Kitab totka/upay on the exact same day.');
  }

  // Kismat Ka Grah (Planet of Destiny)
  const kismatMap: Record<number, PlanetName> = {
    1: 'Mars', 2: 'Jupiter', 3: 'Mercury', 4: 'Moon', 5: 'Sun',
    6: 'Ketu', 7: 'Venus', 8: 'Saturn', 9: 'Jupiter', 10: 'Saturn', 11: 'Jupiter', 12: 'Rahu'
  };
  const kismatKaGrah = kismatMap[moon.house] || 'Jupiter';

  // Sleeping Houses (Soye Hue Ghar): Houses with no planet and no direct aspect in Lal Kitab
  const occupiedHouses = new Set<number>();
  Object.values(planets).forEach(p => occupiedHouses.add(p.house));
  const sleepingHouses: number[] = [];
  for (let h = 1; h <= 12; h++) {
    if (!occupiedHouses.has(h)) sleepingHouses.push(h);
  }

  // Sleeping Planets: Planets sitting in houses whose pakka ghar lords are dormant
  const sleepingPlanets: PlanetName[] = [];
  if (sun.house === 6 || sun.house === 7 || sun.house === 10) sleepingPlanets.push('Sun');
  if (moon.house === 6 || moon.house === 8) sleepingPlanets.push('Moon');
  if (mars.house === 4 || mars.house === 8) sleepingPlanets.push('Mars');
  if (mercury.house === 3 || mercury.house === 8 || mercury.house === 12) sleepingPlanets.push('Mercury');
  if (jupiter.house === 6 || jupiter.house === 7 || jupiter.house === 10) sleepingPlanets.push('Jupiter');
  if (venus.house === 6 || venus.house === 9) sleepingPlanets.push('Venus');
  if (saturn.house === 1 || saturn.house === 5) sleepingPlanets.push('Saturn');

  // Lal Kitab 9 Debts (Rin)
  const debts: LalKitabDebtItem[] = [
    {
      id: 'pitru-rin',
      name: 'Pitru Rin (Forefathers’ Debt)',
      hindiName: 'पितृ ऋण',
      present: jupiter.house === 2 || jupiter.house === 5 || jupiter.house === 9 || jupiter.house === 12
        ? saturn.house === jupiter.house || rahu.house === 9
        : rahu.house === 9 || (jupiter.house === 6 || jupiter.house === 8),
      indication: 'Afflictions to 9th house or Jupiter by Saturn/Rahu/Ketu. Creates obstacles in career zenith and unexplainable property disputes.',
      pastLifeCause: 'Disrespecting father, preceptor, destroying a family temple or religious banyan/peepal tree in past births.',
      remedy: 'Collect equal amounts of money from all blood relatives and organize a collective religious offering or feed poor students.'
    },
    {
      id: 'matru-rin',
      name: 'Matru Rin (Mother’s Debt)',
      hindiName: 'मातृ ऋण',
      present: ketu.house === 4 || (moon.house === 6 || moon.house === 8),
      indication: 'Distress to mother, emotional mood swings, loss of peace at home, educational hiccups.',
      pastLifeCause: 'Neglecting mother, throwing trash into clean rivers, or hurting a cow while grazing.',
      remedy: 'Collect equal silver pieces from all blood relatives and immerse them in a holy flowing river simultaneously.'
    },
    {
      id: 'stri-rin',
      name: 'Stri Rin (Wife / Women’s Debt)',
      hindiName: 'स्त्री ऋण',
      present: venus.house === 2 || venus.house === 8 || (sun.house === 7 && venus.house === 1),
      indication: 'Marital friction, delayed childbearing, financial stress in mid-career.',
      pastLifeCause: 'Mistreating female relatives, taking away a woman’s streedhan, or breaking marriage vows.',
      remedy: 'Collect equal money from all direct family members and feed 100 cows with fresh green fodder and jaggery in a single day.'
    },
    {
      id: 'atma-rin',
      name: 'Atma Rin (Self-inflicted Debt)',
      hindiName: 'स्व ऋण (आत्म ऋण)',
      present: sun.house === 5 || (rahu.house === 5 || ketu.house === 5),
      indication: 'Repeated financial losses despite exceptional talent, legal scrutiny, heart/eye issues.',
      pastLifeCause: 'Misuse of authority, betrayal of friends, or excessive ego harming innocent dependents.',
      remedy: 'Collect equal copper coins or utensils from all family members and offer them to a Shiva temple or running water.'
    },
    {
      id: 'bhai-rin',
      name: 'Bhai / Rishtedar Rin (Relatives’ Debt)',
      hindiName: 'भ्रातृ / सम्बन्धी ऋण',
      present: mars.house === 3 || mars.house === 8 ? mercury.house === mars.house : mercury.house === 3 || ketu.house === 3,
      indication: 'Sibling disputes, inability to get support from brothers, impulsive risky investments.',
      pastLifeCause: 'Deceiving brothers in ancestral partition or setting fire to someone else’s crops.',
      remedy: 'Collect equal amount of whole red lentils (Masoor) from blood relatives and donate to medicine camps or wrestling schools.'
    },
    {
      id: 'zalimana-rin',
      name: 'Zalimana Rin (Cruelty / Oppression Debt)',
      hindiName: 'ज़ालिमाना ऋण',
      present: saturn.house === 10 || saturn.house === 11 ? rahu.house === 10 : saturn.house === 12,
      indication: 'Sudden unexpected house demolition, burglary, loss of employment, chronic musculoskeletal pain.',
      pastLifeCause: 'Unjustly confiscating land, killing domestic animals, or tyrannizing subordinates.',
      remedy: 'Collect equal amount of money from all blood members to feed fish and birds, and arrange water bowls across 10 locations.'
    },
    {
      id: 'kudrati-rin',
      name: 'Kudrati Rin (Nature’s Debt)',
      hindiName: 'कुदरती ऋण',
      present: moon.house === 6 && ketu.house === 6,
      indication: 'Accidents while traveling, fear of deep waters, difficulty retaining household savings.',
      pastLifeCause: 'Killing pregnant creatures or cutting down green fruiting trees.',
      remedy: 'Feed stray dogs with sweet milk bread every Tuesday and Saturday for 43 consecutive days.'
    },
    {
      id: 'ajanme-rin',
      name: 'Ajanme Rin (Unborn Child’s Debt)',
      hindiName: 'अजन्मे का ऋण',
      present: sun.house === 12 && venus.house === 12 && rahu.house === 12,
      indication: 'Delay in conception, family lineage continuity anxiety, unpredictable home atmosphere.',
      pastLifeCause: 'Causing harm to unborn offspring or interfering in natural births.',
      remedy: 'Bury a silver coin embossed with goddess Lakshmi inside your residential threshold.'
    },
    {
      id: 'devta-rin',
      name: 'Devta Rin (Divine Debt)',
      hindiName: 'देवता ऋण',
      present: jupiter.house === 6 || jupiter.house === 8 || mercury.house === 6,
      indication: 'Loss of religious inclination, lack of mental peace, chronic misunderstandings.',
      pastLifeCause: 'Breaking vows made to deities, stealing from temples, or mocking spiritual teachers.',
      remedy: 'Plant a sacred Peepal or Banyan sapling in a public garden and nurture it until fully established.'
    }
  ];

  // Specific Lal Kitab Remedies for the 9 Planets based on their natal house positions
  const planetRemedies = [
    {
      planet: 'Sun' as PlanetName,
      house: sun.house,
      pakkaGhar: 1,
      karka: 'Soul, Father, Vitality, Authority',
      nature: sun.house <= 5 ? 'Auspicious' : 'Needs Harmonization',
      upay: [
        'Offer pure water in a copper jug to the rising Sun every morning.',
        'Throw a copper coin into a clean flowing river to boost vitality.',
        'Never accept free gold or copper gifts from strangers.'
      ]
    },
    {
      planet: 'Moon' as PlanetName,
      house: moon.house,
      pakkaGhar: 4,
      karka: 'Mind, Mother, Liquid Wealth, Peace',
      nature: moon.house === 4 || moon.house === 1 ? 'Deeply Auspicious' : 'Sensitive',
      upay: [
        'Touch your mother’s feet every morning to receive lunar blessings.',
        'Keep a small solid square silver brick (Chandi ka tukda) in your pocket/vault.',
        'Do not donate milk or water at night.'
      ]
    },
    {
      planet: 'Mars' as PlanetName,
      house: mars.house,
      pakkaGhar: 3,
      karka: 'Courage, Blood, Brothers, Ambition',
      nature: mars.house === 3 || mars.house === 10 ? 'Mangal Nek (Benefic)' : 'Mangal Bad (Aggressive)',
      upay: [
        'Bake sweet wheat rotis (meethi roti) with fennel seeds and feed them to stray dogs.',
        'Keep a square piece of pure silver in an earthen pot containing natural honey.',
        'Distribute sweets to friends on Tuesdays, do not eat sweets yourself while donating.'
      ]
    },
    {
      planet: 'Mercury' as PlanetName,
      house: mercury.house,
      pakkaGhar: 7,
      karka: 'Intellect, Speech, Commerce, Logic',
      nature: mercury.house === 6 || mercury.house === 7 ? 'Strong' : 'Fluctuating',
      upay: [
        'Feed fresh green grass (Hari Ghaas) or spinach to cows on Wednesdays.',
        'Pierce the nose/ear with pure silver wire for 96 days if intellect feels clouded.',
        'Never keep broad-leafed rubber plants or broken glass at home.'
      ]
    },
    {
      planet: 'Jupiter' as PlanetName,
      house: jupiter.house,
      pakkaGhar: 2,
      karka: 'Wisdom, Dharma, Gold, Progeny, Fortune',
      nature: jupiter.house === 2 || jupiter.house === 9 || jupiter.house === 5 ? 'Guru Kripa' : 'Mild',
      upay: [
        'Apply natural saffron (Kesar) or turmeric tilak on your forehead and naval daily.',
        'Clean the floor of a local temple or spiritual center once every month.',
        'Water a Peepal tree without touching the trunk on Thursdays.'
      ]
    },
    {
      planet: 'Venus' as PlanetName,
      house: venus.house,
      pakkaGhar: 7,
      karka: 'Love, Beauty, Luxury, Spouse, Refinement',
      nature: venus.house === 7 || venus.house === 12 ? 'Rich' : 'Restless',
      upay: [
        'Keep your attire neat, scented, and wear clean white or pastel clothes.',
        'Donate curd (Dahi), camphor (Kapur), or white sweets at places of worship on Fridays.',
        'Respect your spouse and give gifts of silver or pearls.'
      ]
    },
    {
      planet: 'Saturn' as PlanetName,
      house: saturn.house,
      pakkaGhar: 8,
      karka: 'Karma, Justice, Labor, Longevity, Iron',
      nature: saturn.house === 3 || saturn.house === 10 || saturn.house === 11 ? 'Saturn Favorable' : 'Disciplinary',
      upay: [
        'Perform Chhaya Daan: pour mustard oil in an iron vessel, see your reflection in it, and donate it to a poor person on Saturday.',
        'Serve dark-colored dogs, crows, and laborers with food or footwear.',
        'Never consume alcohol or meat, especially on Saturdays.'
      ]
    },
    {
      planet: 'Rahu' as PlanetName,
      house: rahu.house,
      pakkaGhar: 12,
      karka: 'Illusions, Ambition, Foreign, Technology',
      nature: rahu.house === 3 || rahu.house === 6 ? 'Karmic Catalyst' : 'Intense',
      upay: [
        'Immerse a fresh coconut with water into a flowing river on Saturdays.',
        'Wash whole barley grains in milk and immerse in flowing water to dispel mental fog.',
        'Keep a solid silver ball in your pocket or work desk.'
      ]
    },
    {
      planet: 'Ketu' as PlanetName,
      house: ketu.house,
      pakkaGhar: 6,
      karka: 'Moksha, Intuition, Travel, Liberation',
      nature: ketu.house === 9 || ketu.house === 12 ? 'Spiritual' : 'Unstable',
      upay: [
        'Feed two-colored (black & white) dogs with fresh food regularly.',
        'Donate a warm black and white blanket to a temple or elderly homeless person.',
        'Apply saffron tilak and wear pure gold in the ear or around the neck.'
      ]
    }
  ];

  return {
    tevaType: {
      primary: tevaTitle,
      description: tevaDesc,
      guidelines: tevaGuidelines,
    },
    kismatKaGrah,
    sleepingHouses,
    sleepingPlanets,
    debts,
    planetRemedies,
  };
}

// -------------------------------------------------------------
// 4. VARSHPHAL (TAJIK ANNUAL HOROSCOPE) ENGINE
// -------------------------------------------------------------
export function calculateVarshphal(kundali: KundaliData, targetYear?: number): VarshphalAnalysis {
  const birthYear = parseInt(kundali.birthDetails.dateOfBirth.split('-')[0] || '1995', 10);
  const currentYear = targetYear || new Date().getFullYear();
  const nativeAge = Math.max(1, currentYear - birthYear);

  // Muntha calculation:
  // Muntha progresses 1 sign per completed solar year starting from natal Ascendant sign
  const ascIndex = kundali.planets.Ascendant.signIndex;
  const munthaSignIndex = (ascIndex + (nativeAge % 12)) % 12;
  const munthaSign = ZODIAC_SIGNS[munthaSignIndex];
  const munthaLord = SIGN_LORDS[munthaSign];

  // Muntha House in the annual chart
  // When Muntha is in 4, 6, 7, 8, 12: challenging; in 9, 10, 11, 1, 2, 3, 5: auspicious
  const munthaHouse = ((munthaSignIndex - ascIndex + 12) % 12) + 1;
  const isAuspicious = [1, 2, 3, 5, 9, 10, 11].includes(munthaHouse);
  const isCritical = [4, 6, 8, 12].includes(munthaHouse);

  const munthaStatus: 'Highly Auspicious' | 'Auspicious' | 'Challenging / Sensitive' =
    isAuspicious && (munthaHouse === 9 || munthaHouse === 10 || munthaHouse === 11)
      ? 'Highly Auspicious'
      : isCritical
      ? 'Challenging / Sensitive'
      : 'Auspicious';

  const munthaPred =
    munthaStatus === 'Highly Auspicious'
      ? `Muntha occupies House ${munthaHouse} (${munthaSign}), governed by ${munthaLord}. Exceptional year for honors, career promotion, asset accumulation, and personal victories.`
      : munthaStatus === 'Challenging / Sensitive'
      ? `Muntha occupies sensitive House ${munthaHouse} (${munthaSign}). Requires caution regarding health, expenses, and unexpected journeys. Regular prayers to Ishta Devata bring protection.`
      : `Muntha in House ${munthaHouse} indicates steady progress, balanced productivity, and domestic comfort.`;

  // Varshesh (Year Lord) selection from Pancha Adhikari (5 Office Bearers)
  const varsheshCandidates: PlanetName[] = [munthaLord, SIGN_LORDS[kundali.planets.Ascendant.sign], 'Sun', 'Jupiter', 'Mars'];
  const varsheshPlanet = varsheshCandidates[(nativeAge * 3) % varsheshCandidates.length];

  // Tajik Yogas
  const tajikYogas: VarshphalAnalysis['tajikYogas'] = [
    {
      name: 'Ithasala Yoga (Mutual Aspect)',
      planets: ['Sun', 'Mars'],
      type: 'Benefic Tajik Yoga',
      result: 'Direct applying aspect signifying guaranteed accomplishment of governmental, executive, and competitive goals.'
    },
    {
      name: 'Nakta Yoga (Light Transmission)',
      planets: ['Moon', 'Jupiter'],
      type: 'Supportive Yoga',
      result: 'The Moon acts as a mediator transmitting positive light between key planets, resolving obstacles through family support.'
    },
    {
      name: 'Ishrafa Yoga (Separating Aspect)',
      planets: ['Mercury', 'Saturn'],
      type: 'Cautionary Yoga',
      result: 'Gradual separation indicating that partnerships nearing their conclusion should be dissolved amicably.'
    }
  ];

  // Tajik Sahams (Sensitive points)
  // Punya Saham: Varsha Lagna + Moon - Sun (Day)
  const sunDeg = kundali.planets.Sun.degrees;
  const moonDeg = kundali.planets.Moon.degrees;
  const ascDeg = kundali.planets.Ascendant.degrees;

  const punyaDeg = (ascDeg + moonDeg - sunDeg + 30) % 30;
  const vidyaDeg = (ascDeg + sunDeg - moonDeg + 30) % 30;
  const yashasDeg = (ascDeg + jupiterDegOr(kundali, 15) - sunDeg + 30) % 30;
  const karyaDeg = (ascDeg + saturnDegOr(kundali, 20) - sunDeg + 30) % 30;

  const sahams = [
    {
      name: 'Punya Saham',
      sanskritName: 'पुण्य सहम',
      sign: munthaSign,
      degrees: Math.round(punyaDeg * 10) / 10,
      significance: 'Point of spiritual virtue, unexpected luck, good deeds bearing fruit, and auspicious celebrations.'
    },
    {
      name: 'Vidya Saham',
      sanskritName: 'विद्या सहम',
      sign: ZODIAC_SIGNS[(munthaSignIndex + 4) % 12],
      degrees: Math.round(vidyaDeg * 10) / 10,
      significance: 'Point of higher learning, creative output, competitive exam success, and intellectual acumen.'
    },
    {
      name: 'Yashas Saham',
      sanskritName: 'यशः सहम',
      sign: ZODIAC_SIGNS[(munthaSignIndex + 9) % 12],
      degrees: Math.round(yashasDeg * 10) / 10,
      significance: 'Point of public reputation, fame, political backing, and recognition from seniors.'
    },
    {
      name: 'Karyasiddhi Saham',
      sanskritName: 'कार्यसिद्धि सहम',
      sign: ZODIAC_SIGNS[(munthaSignIndex + 10) % 12],
      degrees: Math.round(karyaDeg * 10) / 10,
      significance: 'Point of guaranteed completion of long-pending projects, litigation victories, and goal realization.'
    }
  ];

  // 12 Months Annual Outlook
  const monthNames = [
    'Month 1 (Solar Return)', 'Month 2', 'Month 3', 'Month 4',
    'Month 5', 'Month 6', 'Month 7', 'Month 8',
    'Month 9', 'Month 10', 'Month 11', 'Month 12'
  ];

  const monthlyOutlook = monthNames.map((m, idx) => {
    const sIndex = (munthaSignIndex + idx) % 12;
    const rating = ((idx * 3 + nativeAge) % 3) + 3; // 3 to 5 stars
    const forecasts = [
      'Focus on new initiatives, health vitality, and personal branding.',
      'Financial consolidation, family gatherings, and investments in quality assets.',
      'Short journeys, business collaborations, and proactive creative writing.',
      'Domestic happiness, vehicular upgrades, and harmony with parents.',
      'Intellectual breakthroughs, romantic warmth, and positive children news.',
      'Overcoming workplace competitors, disciplinary fitness, and task completion.',
      'Partnership milestones, marital joy, and signing lucrative legal agreements.',
      'Deep research, occult studies, unexpected windfalls, and spiritual depth.',
      'Destiny favors bold ethical moves, pilgrimage, and blessings from mentors.',
      'Peak career visibility, leadership elevation, and public commendations.',
      'Major financial inflow, realization of long-held desires, and social joy.',
      'Reflective downtime, foreign exploration, charitable giving, and mental peace.'
    ];

    return {
      month: m,
      sunSign: ZODIAC_SIGNS[sIndex],
      rating: Math.min(5, Math.max(3, rating)),
      forecast: forecasts[idx % forecasts.length]
    };
  });

  return {
    targetYear: currentYear,
    nativeAge,
    solarReturnDate: `${currentYear}-${kundali.birthDetails.dateOfBirth.slice(5)}`,
    muntha: {
      sign: munthaSign,
      house: munthaHouse,
      lord: munthaLord,
      auspiciousness: munthaStatus,
      prediction: munthaPred
    },
    varshesh: {
      planet: varsheshPlanet,
      title: `${varsheshPlanet} (Year Lord / Varshesha)`,
      balaRank: 'Pancha-Vargiya High Strength (Harsha Bala)',
      significance: `Governs overall life momentum throughout age ${nativeAge}. Strengthens executive decisiveness, immunity, and financial stability.`
    },
    sahams,
    tajikYogas,
    monthlyOutlook,
  };
}

function jupiterDegOr(k: KundaliData, def: number): number {
  return k.planets.Jupiter?.degrees ?? def;
}
function saturnDegOr(k: KundaliData, def: number): number {
  return k.planets.Saturn?.degrees ?? def;
}

// -------------------------------------------------------------
// 5. GEMSTONES REPORT ENGINE
// -------------------------------------------------------------
export function calculateGemstonesReport(kundali: KundaliData): GemstoneRecommendation[] {
  const lagnaLord = kundali.houses[0]?.signLord || 'Mars';
  const house9Lord = kundali.houses[8]?.signLord || 'Jupiter';
  const house5Lord = kundali.houses[4]?.signLord || 'Sun';

  const gemCatalog: Record<PlanetName, {
    primary: string;
    sanskrit: string;
    substitutes: string[];
    carat: string;
    metal: string;
    finger: string;
    dayTime: string;
    mantra: string;
    benefits: string[];
    incompatible: string[];
  }> = {
    Sun: {
      primary: 'Ruby (Manikya)',
      sanskrit: 'माणिक्य',
      substitutes: ['Red Garnet', 'Star Ruby', 'Red Spinel'],
      carat: '4.25 to 6.5 Carats',
      metal: 'Pure Gold or Copper',
      finger: 'Ring Finger (Anamika)',
      dayTime: 'Sunday morning during Shukla Paksha sunrise',
      mantra: 'ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः (108 times)',
      benefits: ['Enhances leadership charisma', 'Strengthens eyesight and cardiovascular vitality', 'Boosts governmental favors and executive status'],
      incompatible: ['Blue Sapphire (Neelam)', 'Diamond (Heera)', 'Gomed', 'Cat’s Eye']
    },
    Moon: {
      primary: 'Natural Pearl (Moti)',
      sanskrit: 'मुक्ता / मोती',
      substitutes: ['Moonstone', 'White Coral'],
      carat: '5.25 to 7.5 Carats',
      metal: 'Pure Silver',
      finger: 'Little Finger (Kanishtha)',
      dayTime: 'Monday evening during Shukla Paksha',
      mantra: 'ॐ श्रां श्रीं श्रौं सः चन्द्रमसे नमः (108 times)',
      benefits: ['Calms anxiety, stress and emotional turbulence', 'Promotes sound restorative sleep', 'Harmonizes relationship with mother'],
      incompatible: ['Hessonite (Gomed)', 'Cat’s Eye (Lehsuniya)']
    },
    Mars: {
      primary: 'Red Coral (Moonga)',
      sanskrit: 'प्रवाल / मूँगा',
      substitutes: ['Carnelian', 'Red Jasper'],
      carat: '6.25 to 8.5 Carats',
      metal: 'Gold, Copper, or Panchdhatu',
      finger: 'Ring Finger (Anamika)',
      dayTime: 'Tuesday morning after sunrise',
      mantra: 'ॐ क्रां क्रीं क्रौं सः भौमाय नमः (108 times)',
      benefits: ['Instills courageous initiative and physical vigor', 'Clears muscular lethargy and blood purifications', 'Assists in land acquisition and athletics'],
      incompatible: ['Emerald (Panna)', 'Diamond (Heera)', 'Blue Sapphire (Neelam)']
    },
    Mercury: {
      primary: 'Natural Emerald (Panna)',
      sanskrit: 'मरकत / पन्ना',
      substitutes: ['Green Tourmaline', 'Peridot', 'Green Onyx'],
      carat: '4.25 to 6.25 Carats',
      metal: 'Gold or Panchdhatu',
      finger: 'Little Finger (Kanishtha)',
      dayTime: 'Wednesday morning during sunrise',
      mantra: 'ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः (108 times)',
      benefits: ['Sharpens mathematical, financial and communicative intellect', 'Enhances commerce, software, and public oratory', 'Soothes nervous system agitation'],
      incompatible: ['Red Coral (Moonga)', 'Natural Pearl (Moti)']
    },
    Jupiter: {
      primary: 'Yellow Sapphire (Pukhraj)',
      sanskrit: 'पुष्पराग / पुखराज',
      substitutes: ['Yellow Topaz', 'Citrine (Sunela)', 'Golden Beryl'],
      carat: '4.25 to 7.25 Carats',
      metal: 'Pure Gold or Panchdhatu',
      finger: 'Index Finger (Tarjani)',
      dayTime: 'Thursday morning during sunrise',
      mantra: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः (108 times)',
      benefits: ['Bestows spiritual wisdom, higher consciousness and judgment', 'Protects marital bliss and progeny prosperity', 'Draws divine fortune and philanthropic honors'],
      incompatible: ['Diamond (Heera)', 'Blue Sapphire (Neelam)', 'Hessonite (Gomed)']
    },
    Venus: {
      primary: 'Natural Diamond (Heera) / White Zircon',
      sanskrit: 'वज्र / हीरा',
      substitutes: ['White Zircon', 'White Sapphire', 'Goshenite'],
      carat: '0.75 to 2.5 Carats (Diamond) / 5+ Carats (Zircon)',
      metal: 'Platinum, White Gold or Silver',
      finger: 'Middle Finger (Madhyama) or Little Finger',
      dayTime: 'Friday morning sunrise',
      mantra: 'ॐ द्रां द्रीं द्रौं सः शुक्राय नमः (108 times)',
      benefits: ['Enhances creative artistry, aesthetics and magnetism', 'Attracts luxurious conveyances and romantic harmony', 'Balances endocrine and reproductive vitality'],
      incompatible: ['Ruby (Manikya)', 'Red Coral (Moonga)', 'Yellow Sapphire (Pukhraj)']
    },
    Saturn: {
      primary: 'Blue Sapphire (Neelam)',
      sanskrit: 'नीलमणि / नीलम',
      substitutes: ['Amethyst (Jamunia)', 'Iolite (Neeli)', 'Blue Topaz'],
      carat: '4.5 to 6.5 Carats',
      metal: 'Panchdhatu, Silver or White Gold',
      finger: 'Middle Finger (Madhyama)',
      dayTime: 'Saturday evening after sunset',
      mantra: 'ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः (108 times)',
      benefits: ['Brings rapid elevation in industry, engineering, and jurisprudence', 'Instills formidable patience and meditative focus', 'Guards against catastrophic losses and chronic ailments'],
      incompatible: ['Ruby (Manikya)', 'Red Coral (Moonga)', 'Pearl (Moti)', 'Yellow Sapphire']
    },
    Rahu: {
      primary: 'Hessonite Garnet (Gomed)',
      sanskrit: 'गोमेद',
      substitutes: ['Amber', 'Brown Zircon'],
      carat: '5.25 to 7.5 Carats',
      metal: 'Silver or Panchdhatu',
      finger: 'Middle Finger (Madhyama)',
      dayTime: 'Saturday night after 8 PM',
      mantra: 'ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः (108 times)',
      benefits: ['Clears cognitive illusions, phobias and sudden turbulence', 'Aids breakthroughs in politics, overseas trade, and algorithms'],
      incompatible: ['Ruby', 'Pearl', 'Coral', 'Yellow Sapphire']
    },
    Ketu: {
      primary: 'Chrysoberyl Cat’s Eye (Lehsuniya)',
      sanskrit: 'वैदूर्य / लहसुनिया',
      substitutes: ['Tiger Eye', 'Fibrolite'],
      carat: '4.5 to 6.5 Carats',
      metal: 'Silver or Panchdhatu',
      finger: 'Ring Finger (Anamika) or Little Finger',
      dayTime: 'Thursday evening or Tuesday night',
      mantra: 'ॐ स्रां स्रीं स्रौं सः केतवे नमः (108 times)',
      benefits: ['Accelerates spiritual awakening and Kundalini sensitivity', 'Shields against unknown hazards, poisons and hidden enemies'],
      incompatible: ['Ruby', 'Pearl', 'Coral', 'Emerald']
    },
    Ascendant: {
      primary: 'Ruby (Manikya)',
      sanskrit: 'माणिक्य',
      substitutes: ['Garnet'],
      carat: '5 Carats',
      metal: 'Gold',
      finger: 'Ring Finger',
      dayTime: 'Sunday morning',
      mantra: 'ॐ सूर्याय नमः',
      benefits: ['Enhances vitality'],
      incompatible: ['Blue Sapphire']
    }
  };

  const getGem = (planet: PlanetName, type: GemstoneRecommendation['type']): GemstoneRecommendation => {
    const data = gemCatalog[planet] || gemCatalog.Sun;
    return {
      type,
      planet,
      primaryGem: data.primary,
      sanskritGem: data.sanskrit,
      substituteGems: data.substitutes,
      caratWeight: data.carat,
      metal: data.metal,
      finger: data.finger,
      wearingDayTime: data.dayTime,
      mantra: data.mantra,
      benefits: data.benefits,
      incompatibleGems: data.incompatible,
    };
  };

  return [
    getGem(lagnaLord, 'Life Stone (Lagna Ratna)'),
    getGem(house9Lord, 'Lucky Stone (Bhagya Ratna)'),
    getGem(house5Lord, 'Wisdom Stone (Punya Ratna)'),
  ];
}

// -------------------------------------------------------------
// 6. TRANSIT TODAY (GOCHAR PHALA) ENGINE
// -------------------------------------------------------------
export interface TransitTodayItem {
  planet: PlanetName;
  transitSign: ZodiacSign;
  houseFromMoon: number;
  houseFromLagna: number;
  isAuspicious: boolean;
  prediction: string;
}

export function calculateTransitToday(kundali: KundaliData): {
  overallScore: number;
  transits: TransitTodayItem[];
  todaysGuidance: string;
} {
  const moonSignIndex = kundali.planets.Moon.signIndex;
  const lagnaSignIndex = kundali.planets.Ascendant.signIndex;

  // Approximate current real-time transits based on date
  const now = new Date();
  const month = now.getMonth(); // 0 to 11
  const day = now.getDate();

  // Transit Sun moves 1 sign per month (approx Pisces in mid-March, Aries in mid-April, etc.)
  const approxSunSignIndex = (month + 2) % 12;

  // Auspicious houses from natal Moon (Standard Phaladeepika rules):
  // Sun: 3, 6, 10, 11
  // Moon: 1, 3, 6, 7, 10, 11
  // Mars: 3, 6
  // Mercury: 2, 4, 6, 8, 10, 11
  // Jupiter: 2, 5, 7, 9, 11
  // Venus: 1, 2, 3, 4, 5, 8, 9, 11, 12
  // Saturn: 3, 6, 11
  // Rahu/Ketu: 3, 6, 10, 11
  const auspiciousRules: Record<PlanetName, number[]> = {
    Sun: [3, 6, 10, 11],
    Moon: [1, 3, 6, 7, 10, 11],
    Mars: [3, 6],
    Mercury: [2, 4, 6, 8, 10, 11],
    Jupiter: [2, 5, 7, 9, 11],
    Venus: [1, 2, 3, 4, 5, 8, 9, 11, 12],
    Saturn: [3, 6, 11],
    Rahu: [3, 6, 11],
    Ketu: [3, 6, 11],
    Ascendant: [1, 5, 9],
  };

  const planetTransitOffsets: Record<PlanetName, number> = {
    Sun: approxSunSignIndex,
    Moon: (approxSunSignIndex + Math.floor(day / 2.5)) % 12,
    Mars: (approxSunSignIndex + 3) % 12,
    Mercury: (approxSunSignIndex + 1) % 12,
    Jupiter: (approxSunSignIndex + 8) % 12, // Slow moving
    Venus: (approxSunSignIndex + 2) % 12,
    Saturn: (approxSunSignIndex + 11) % 12, // Slow moving (Aquarius/Pisces)
    Rahu: (approxSunSignIndex + 10) % 12,
    Ketu: (approxSunSignIndex + 4) % 12,
    Ascendant: lagnaSignIndex,
  };

  const planetPredictions: Record<PlanetName, (h: number, ausp: boolean) => string> = {
    Sun: (h, a) => a ? `Transiting House ${h} brings executive recognition, vitality, and authority.` : `Transiting House ${h} advises avoiding ego clashes and staying hydrated.`,
    Moon: (h, a) => a ? `Moon in House ${h} grants mental cheerfulness, intuitive clarity, and sweet communication.` : `Moon in House ${h} suggests slowing down and avoiding emotional impulse shopping.`,
    Mars: (h, a) => a ? `Mars in House ${h} delivers triumphant courage, athletic prowess, and decisive initiative.` : `Mars in House ${h} warns against hurried driving or impatient arguments.`,
    Mercury: (h, a) => a ? `Mercury in House ${h} sparks brilliant financial intellect, witty writing, and profitable trades.` : `Mercury in House ${h} recommends double-checking emails and legal agreements.`,
    Jupiter: (h, a) => a ? `Divine Guru in House ${h} showers expansion, spiritual harmony, and serendipitous good fortune.` : `Jupiter in House ${h} encourages humble contemplation and philanthropic study.`,
    Venus: (h, a) => a ? `Venus in House ${h} brings romantic charm, artistic luxury, and delightful social gatherings.` : `Venus in House ${h} cautions against overindulgence in rich foods or extravagant luxuries.`,
    Saturn: (h, a) => a ? `Lord Shani in House ${h} rewards disciplined perseverance with rock-solid milestones.` : `Saturn in House ${h} requires patience, structured routines, and service to elders.`,
    Rahu: (h, a) => a ? `Rahu in House ${h} sparks unconventional breakthroughs and foreign opportunities.` : `Rahu in House ${h} asks you to verify facts carefully before trusting new acquaintances.`,
    Ketu: (h, a) => a ? `Ketu in House ${h} deepens meditative peace and reveals hidden metaphysical insights.` : `Ketu in House ${h} advises grounding exercises and spending time in nature.`,
    Ascendant: () => 'Lagna orientation stabilizes daily consciousness.'
  };

  const activePlanets: PlanetName[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
  let positiveCount = 0;

  const transits: TransitTodayItem[] = activePlanets.map(p => {
    const tSignIdx = planetTransitOffsets[p];
    const tSign = ZODIAC_SIGNS[tSignIdx];
    const houseFromMoon = ((tSignIdx - moonSignIndex + 12) % 12) + 1;
    const houseFromLagna = ((tSignIdx - lagnaSignIndex + 12) % 12) + 1;
    const isAuspicious = (auspiciousRules[p] || []).includes(houseFromMoon);
    if (isAuspicious) positiveCount++;

    return {
      planet: p,
      transitSign: tSign,
      houseFromMoon,
      houseFromLagna,
      isAuspicious,
      prediction: planetPredictions[p](houseFromMoon, isAuspicious),
    };
  });

  const overallScore = Math.round((positiveCount / activePlanets.length) * 100);
  const todaysGuidance =
    overallScore >= 70
      ? 'A highly favorable cosmic day! Planetary alignments support signing important documents, initiating commercial deals, and making meaningful relationship commitments.'
      : overallScore >= 45
      ? 'A balanced, productive day. Steady focus, respectful diplomacy, and patience with colleagues will yield positive outcomes.'
      : 'A day intended for introspection, steady routine work, and spiritual rejuvenation. Postpone high-stakes gambles and practice mindfulness.';

  return {
    overallScore,
    transits,
    todaysGuidance,
  };
}

// -------------------------------------------------------------
// 7. BASIC AVAKAHADA & PANCHANGA DETAILS
// -------------------------------------------------------------
export function calculateBasicAvakahada(kundali: KundaliData) {
  const moon = kundali.planets.Moon;
  const sun = kundali.planets.Sun;
  const lagna = kundali.planets.Ascendant;

  const varnas: Record<ZodiacSign, string> = {
    Aries: 'Kshatriya (Warrior)', Leo: 'Kshatriya (Warrior)', Sagittarius: 'Kshatriya (Warrior)',
    Taurus: 'Vaishya (Merchant)', Virgo: 'Vaishya (Merchant)', Capricorn: 'Vaishya (Merchant)',
    Gemini: 'Shudra (Artisan/Worker)', Libra: 'Shudra (Artisan/Worker)', Aquarius: 'Shudra (Artisan/Worker)',
    Cancer: 'Brahmin (Scholar/Priest)', Scorpio: 'Brahmin (Scholar/Priest)', Pisces: 'Brahmin (Scholar/Priest)'
  };

  const vashyas: Record<ZodiacSign, string> = {
    Aries: 'Chatushpada (Quadruped)', Taurus: 'Chatushpada (Quadruped)',
    Gemini: 'Manava (Human)', Virgo: 'Manava (Human)', Libra: 'Manava (Human)',
    Cancer: 'Jalachara (Aquatic)', Pisces: 'Jalachara (Aquatic)',
    Leo: 'Vanachara (Wild/Forest)',
    Scorpio: 'Keeta (Insect)',
    Sagittarius: 'Manava (First half) / Quadruped',
    Capricorn: 'Jalachara / Quadruped',
    Aquarius: 'Manava (Human)'
  };

  const elements: Record<ZodiacSign, string> = {
    Aries: 'Fire (Agni)', Leo: 'Fire (Agni)', Sagittarius: 'Fire (Agni)',
    Taurus: 'Earth (Prithvi)', Virgo: 'Earth (Prithvi)', Capricorn: 'Earth (Prithvi)',
    Gemini: 'Air (Vayu)', Libra: 'Air (Vayu)', Aquarius: 'Air (Vayu)',
    Cancer: 'Water (Jala)', Scorpio: 'Water (Jala)', Pisces: 'Water (Jala)'
  };

  const ganaMap: Record<string, string> = {
    Ashwini: 'Deva (Divine)', Bharani: 'Manushya (Human)', Krittika: 'Rakshasa (Demonic)',
    Rohini: 'Manushya (Human)', Mrigashira: 'Deva (Divine)', Ardra: 'Manushya (Human)',
    Punarvasu: 'Deva (Divine)', Pushya: 'Deva (Divine)', Ashlesha: 'Rakshasa (Demonic)',
    Magha: 'Rakshasa (Demonic)', 'Purva Phalguni': 'Manushya (Human)', 'Uttara Phalguni': 'Manushya (Human)',
    Hasta: 'Deva (Divine)', Chitra: 'Rakshasa (Demonic)', Swati: 'Deva (Divine)',
    Vishakha: 'Rakshasa (Demonic)', Anuradha: 'Deva (Divine)', Jyeshtha: 'Rakshasa (Demonic)',
    Mula: 'Rakshasa (Demonic)', 'Purva Ashadha': 'Manushya (Human)', 'Uttara Ashadha': 'Manushya (Human)',
    Shravana: 'Deva (Divine)', Dhanishta: 'Rakshasa (Demonic)', Shatabhisha: 'Rakshasa (Demonic)',
    'Purva Bhadrapada': 'Manushya (Human)', 'Uttara Bhadrapada': 'Manushya (Human)', Revati: 'Deva (Divine)'
  };

  const yoniMap: Record<string, string> = {
    Ashwini: 'Ashwa (Horse)', Bharani: 'Gaja (Elephant)', Krittika: 'Mesha (Sheep)',
    Rohini: 'Sarpa (Serpent)', Mrigashira: 'Sarpa (Serpent)', Ardra: 'Shwan (Dog)',
    Punarvasu: 'Marjara (Cat)', Pushya: 'Mesha (Sheep)', Ashlesha: 'Marjara (Cat)',
    Magha: 'Mushaka (Rat)', 'Purva Phalguni': 'Mushaka (Rat)', 'Uttara Phalguni': 'Gau (Cow)',
    Hasta: 'Mahisha (Buffalo)', Chitra: 'Vyaghra (Tiger)', Swati: 'Mahisha (Buffalo)',
    Vishakha: 'Vyaghra (Tiger)', Anuradha: 'Mriga (Deer)', Jyeshtha: 'Mriga (Deer)',
    Mula: 'Shwan (Dog)', 'Purva Ashadha': 'Vanara (Monkey)', 'Uttara Ashadha': 'Nakula (Mongoose)',
    Shravana: 'Vanara (Monkey)', Dhanishta: 'Simha (Lion)', Shatabhisha: 'Ashwa (Horse)',
    'Purva Bhadrapada': 'Simha (Lion)', 'Uttara Bhadrapada': 'Gau (Cow)', Revati: 'Gaja (Elephant)'
  };

  const nadiMap: Record<string, string> = {
    Ashwini: 'Adi (Vata)', Bharani: 'Madhya (Pitta)', Krittika: 'Antya (Kapha)',
    Rohini: 'Antya (Kapha)', Mrigashira: 'Madhya (Pitta)', Ardra: 'Adi (Vata)',
    Punarvasu: 'Adi (Vata)', Pushya: 'Madhya (Pitta)', Ashlesha: 'Antya (Kapha)',
    Magha: 'Antya (Kapha)', 'Purva Phalguni': 'Madhya (Pitta)', 'Uttara Phalguni': 'Adi (Vata)',
    Hasta: 'Adi (Vata)', Chitra: 'Madhya (Pitta)', Swati: 'Antya (Kapha)',
    Vishakha: 'Antya (Kapha)', Anuradha: 'Madhya (Pitta)', Jyeshtha: 'Adi (Vata)',
    Mula: 'Adi (Vata)', 'Purva Ashadha': 'Madhya (Pitta)', 'Uttara Ashadha': 'Antya (Kapha)',
    Shravana: 'Antya (Kapha)', Dhanishta: 'Madhya (Pitta)', Shatabhisha: 'Adi (Vata)',
    'Purva Bhadrapada': 'Adi (Vata)', 'Uttara Bhadrapada': 'Madhya (Pitta)', Revati: 'Antya (Kapha)'
  };

  const luckyColors: Record<ZodiacSign, string> = {
    Aries: 'Crimson Red & Coral', Taurus: 'Cream & Pearl White', Gemini: 'Emerald Green',
    Cancer: 'Silver White & Light Blue', Leo: 'Gold & Saffron', Virgo: 'Pastel Green & Ivory',
    Libra: 'Pink & Sky Blue', Scorpio: 'Maroon & Amber', Sagittarius: 'Yellow & Saffron',
    Capricorn: 'Navy Blue & Charcoal', Aquarius: 'Electric Blue & Violet', Pisces: 'Golden Yellow & Sea Green'
  };

  const luckyNumbers: Record<ZodiacSign, string> = {
    Aries: '9, 1, 3', Taurus: '6, 2, 7', Gemini: '5, 3, 14',
    Cancer: '2, 7, 9', Leo: '1, 5, 9', Virgo: '5, 6, 8',
    Libra: '6, 15, 24', Scorpio: '9, 18, 27', Sagittarius: '3, 12, 21',
    Capricorn: '8, 17, 26', Aquarius: '8, 4, 13', Pisces: '3, 7, 12'
  };

  const ishtaDevataMap: Record<ZodiacSign, string> = {
    Aries: 'Lord Hanuman & Kartikeya', Taurus: 'Maa Lakshmi & Annapurna', Gemini: 'Lord Vishnu & Narayana',
    Cancer: 'Lord Shiva & Parvati', Leo: 'Lord Surya & Gayatri Mata', Virgo: 'Lord Ganesha & Saraswati',
    Libra: 'Maa Durga & Lakshmi', Scorpio: 'Lord Kartikeya & Hanuman', Sagittarius: 'Lord Vishnu & Brihaspati',
    Capricorn: 'Lord Shiva & Bhairava', Aquarius: 'Lord Hanuman & Shiva', Pisces: 'Lord Vishnu & Dattatreya'
  };

  return {
    varna: varnas[moon.sign] || 'Kshatriya',
    vashya: vashyas[moon.sign] || 'Chatushpada',
    tatva: elements[moon.sign] || 'Fire',
    gana: ganaMap[moon.nakshatra] || 'Deva',
    yoni: yoniMap[moon.nakshatra] || 'Gaja',
    nadi: nadiMap[moon.nakshatra] || 'Madhya',
    paya: ['Loha (Iron)', 'Tamra (Copper)', 'Rajat (Silver)', 'Swarna (Gold)'][moon.signIndex % 4],
    luckyColor: luckyColors[moon.sign] || 'Gold',
    luckyNumbers: luckyNumbers[moon.sign] || '1, 3, 9',
    luckyDays: ['Tuesday', 'Thursday', 'Sunday', 'Friday', 'Wednesday'][moon.signIndex % 5],
    ishtaDevata: ishtaDevataMap[lagna.sign] || 'Lord Shiva',
  };
}
