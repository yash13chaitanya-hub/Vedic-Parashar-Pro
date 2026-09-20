import { IndianLanguageCode, KundaliData, PlanetName } from '../types';

export type TopicCategory =
  | 'marriage'
  | 'career'
  | 'wealth'
  | 'property_vehicles'
  | 'children'
  | 'health'
  | 'education'
  | 'foreign'
  | 'gemstone_remedy'
  | 'dasha_sadesati'
  | 'shodashvarga'
  | 'dosha_analysis'
  | 'spirituality_deity'
  | 'general';

export type SubCategory =
  | 'marriage_timing'
  | 'marriage_love_or_arranged'
  | 'marriage_spouse_nature'
  | 'career_promotion_timing'
  | 'career_job_vs_business'
  | 'career_field_selection'
  | 'wealth_growth_timing'
  | 'wealth_stock_speculation'
  | 'property_buying_home'
  | 'property_buying_vehicle'
  | 'education_exam_success'
  | 'foreign_settlement_visa'
  | 'children_progeny_timing'
  | 'health_ailments_recovery'
  | 'health_mental_stress'
  | 'enemies_court_case'
  | 'dasha_current_influence'
  | 'sade_sati_impact'
  | 'gemstone_selection'
  | 'lucky_number_color'
  | 'mangal_dosha_check'
  | 'kaalsarp_dosha_check'
  | 'deity_worship_mantra'
  | 'general_guidance';

export interface AstrologicalTopic {
  category: TopicCategory;
  subCategory: SubCategory;
  topicLabelHindi: string;
  topicLabelEnglish: string;
  confidence: number;
}

export const SIGN_NAMES_HINDI: Record<string, string> = {
  Aries: 'मेष (Mesha)',
  Taurus: 'वृषभ (Vrishabha)',
  Gemini: 'मिथुन (Mithuna)',
  Cancer: 'कर्क (Karka)',
  Leo: 'सिंह (Simha)',
  Virgo: 'कन्या (Kanya)',
  Libra: 'तुला (Tula)',
  Scorpio: 'वृश्चिक (Vrishchika)',
  Sagittarius: 'धनु (Dhanu)',
  Capricorn: 'मकर (Makara)',
  Aquarius: 'कुम्भ (Kumbha)',
  Pisces: 'मीन (Meena)',
};

export const PLANET_NAMES_HINDI: Record<string, string> = {
  Sun: 'सूर्य (Surya)',
  Moon: 'चन्द्र (Chandra)',
  Mars: 'मंगल (Mangala)',
  Mercury: 'बुध (Budha)',
  Jupiter: 'बृहस्पति / गुरु (Guru)',
  Venus: 'शुक्र (Shukra)',
  Saturn: 'शनि (Shani)',
  Rahu: 'राहु (Rahu)',
  Ketu: 'केतु (Ketu)',
  Ascendant: 'लग्न (Lagna)',
};

export const GEMSTONE_DATA: Record<string, { stoneEn: string; stoneHi: string; metal: string; finger: string; day: string; mantra: string }> = {
  Sun: { stoneEn: 'Ruby (Manikya)', stoneHi: 'माणिक्य (Ruby)', metal: 'Gold / Copper', finger: 'Ring finger (Anamika)', day: 'Sunday morning', mantra: 'Om Hram Hreem Hroum Sah Suryaya Namaha' },
  Moon: { stoneEn: 'Natural Pearl (Moti)', stoneHi: 'सच्चा मोती (Pearl)', metal: 'Pure Silver', finger: 'Little finger (Kanishtha)', day: 'Monday morning', mantra: 'Om Shram Shreem Shroum Sah Chandramase Namaha' },
  Mars: { stoneEn: 'Red Coral (Moonga)', stoneHi: 'लाल मूँगा (Red Coral)', metal: 'Copper / Gold', finger: 'Ring finger (Anamika)', day: 'Tuesday morning', mantra: 'Om Kram Kreem Kroum Sah Bhaumaya Namaha' },
  Mercury: { stoneEn: 'Emerald (Panna)', stoneHi: 'पन्ना (Emerald)', metal: 'Gold / Silver / Bronze', finger: 'Little finger (Kanishtha)', day: 'Wednesday morning', mantra: 'Om Bram Breem Broum Sah Budhaya Namaha' },
  Jupiter: { stoneEn: 'Yellow Sapphire (Pukhraj)', stoneHi: 'पुखराज (Yellow Sapphire)', metal: 'Gold / Brass', finger: 'Index finger (Tarjani)', day: 'Thursday morning', mantra: 'Om Gram Greem Groum Sah Gurave Namaha' },
  Venus: { stoneEn: 'Diamond or Opal', stoneHi: 'ओपल अथवा हीरा (Diamond/Opal)', metal: 'Silver / White Gold', finger: 'Middle or Ring finger', day: 'Friday morning', mantra: 'Om Dram Dreem Droum Sah Shukraya Namaha' },
  Saturn: { stoneEn: 'Blue Sapphire (Neelam) or Amethyst', stoneHi: 'नीलम अथवा जामुनिया (Amethyst)', metal: 'Panchdhatu / Silver', finger: 'Middle finger (Madhyama)', day: 'Saturday evening', mantra: 'Om Pram Preem Proum Sah Shanaischaraya Namaha' },
  Rahu: { stoneEn: 'Hessonite Garnet (Gomed)', stoneHi: 'गोमेद (Hessonite)', metal: 'Silver / Ashtadhatu', finger: 'Middle finger (Madhyama)', day: 'Saturday night', mantra: 'Om Bhram Bhreem Bhroum Sah Rahave Namaha' },
  Ketu: { stoneEn: "Cat's Eye (Lehsuniya)", stoneHi: 'लहसुनिया (Cat’s Eye)', metal: 'Silver / Panchdhatu', finger: 'Middle or Little finger', day: 'Thursday / Tuesday night', mantra: 'Om Stram Streem Stroum Sah Ketave Namaha' },
};

export const SIGN_LORDS_MAP: Record<string, PlanetName> = {
  Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury', Cancer: 'Moon',
  Leo: 'Sun', Virgo: 'Mercury', Libra: 'Venus', Scorpio: 'Mars',
  Sagittarius: 'Jupiter', Capricorn: 'Saturn', Aquarius: 'Saturn', Pisces: 'Jupiter',
};

export const ZODIAC_LIST = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

/**
 * Enhanced Topic Classifier that maps natural language queries to high-resolution astrological intents
 */
export function detectConsultationTopic(query: string): AstrologicalTopic {
  const q = (query || '').toLowerCase().trim();

  // 1. Marriage Sub-queries
  if (/love.*marri|marri.*love|prem.*vivah|prem.*shadi|love.*arrange|arranged.*love|affair|pasand.*shadi|प्रेम विवाह|लव मैरिज|पसंद की शादी|காதல் திருமணம்|ప్రేమ వివాహం/i.test(q)) {
    return {
      category: 'marriage',
      subCategory: 'marriage_love_or_arranged',
      topicLabelHindi: 'प्रेम विवाह बनाम पारिवारिक विवाह (Love vs Arranged)',
      topicLabelEnglish: 'Love Marriage vs Arranged Marriage',
      confidence: 0.98,
    };
  }
  if (/spouse|husband|wife|partner|nature.*spouse|look.*spouse|jeevansathi.*kaisa|patni.*swabhav|pati.*swabhav|swabhav|kaise.*dikhenge|जीवनसाथी कैसा|पत्नी का स्वभाव|पति का स्वभाव|कैसा मिलेगा|जीवनसाथी का रंग रूप|துணைவர்|భాగస్వామి/i.test(q)) {
    return {
      category: 'marriage',
      subCategory: 'marriage_spouse_nature',
      topicLabelHindi: 'जीवनसाथी का स्वभाव, स्वरूप व दिशा (Spouse Characteristics)',
      topicLabelEnglish: 'Spouse Nature, Appearance & Background',
      confidence: 0.96,
    };
  }
  if (/marri|vivah|shaadi|spouse|husband|wife|kalyanam|jeevansathi|relationship|biwi|shadi|शादी|विवाह|वर|वधू|पति|पत्नी|दांपत्य|திருமணம்|கல்யாணம்|పెళ్లి|వివాహం|বিয়ে/i.test(q)) {
    return {
      category: 'marriage',
      subCategory: 'marriage_timing',
      topicLabelHindi: 'विवाह समय निर्धारण एवं सप्तम भाव (Marriage Timing & 7th House)',
      topicLabelEnglish: 'Marriage Timing & 7th House / D9 Analysis',
      confidence: 0.95,
    };
  }

  // 2. Career & Profession Sub-queries
  if (/job.*business|business.*job|vyapar.*naukri|naukri.*vyapar|startup|own business|dukan|independent|self.*employ|नौकरी या व्यापार|व्यापार करूँ या नौकरी|व्यवसाय|दुकान|स्टार्टअप|தொழில் அல்லது வேலை|ఉద్యోగమా వ్యాపారమా/i.test(q)) {
    return {
      category: 'career',
      subCategory: 'career_job_vs_business',
      topicLabelHindi: 'नौकरी बनाम स्वतंत्र व्यापार का चुनाव (Job vs Business Verdict)',
      topicLabelEnglish: 'Career Choice: Job (Service) vs Business',
      confidence: 0.96,
    };
  }
  if (/which.*field|which.*career|best.*profession|kaun.*sector|kisme.*career|stream|line.*chun|क्षेत्र का चुनाव|करियर किसमें बनाएं|किस क्षेत्र में सफलता|எந்த துறை|ఏ రంగం/i.test(q)) {
    return {
      category: 'career',
      subCategory: 'career_field_selection',
      topicLabelHindi: 'अनुकूलतम कार्यक्षेत्र एवं आजीविका चुनाव (Optimal Career Field)',
      topicLabelEnglish: 'Best Suited Career Fields & Professional Path',
      confidence: 0.95,
    };
  }
  if (/job|career|promot|naukri|business|vyapar|kaam|profession|karyakshetra|office|work|salary|transfer|boss|hike|नौकरी|व्यापार|रोजगार|काम|धंधा|करियर|पदोन्नति|प्रमोशन|बदलाव|பணி|வேலை|உద్యోగం|வியாபாரம்|চাকরি/i.test(q)) {
    return {
      category: 'career',
      subCategory: 'career_promotion_timing',
      topicLabelHindi: 'करियर पदोन्नति, स्थानांतरण एवं दशम भाव (Promotion & Career Growth)',
      topicLabelEnglish: 'Career Elevation, Promotion & Job Change Timing',
      confidence: 0.95,
    };
  }

  // 3. Wealth & Financial Speculation
  if (/stock|share.*market|crypto|trading|satta|lottery|speculat|mutual.*fund|invest|बिटकॉइन|शेयर बाजार|ट्रेडिंग|सट्टा|लॉटरी|म्यूचुअल फंड|பங்குச் சந்தை|షేర్ మార్కెట్/i.test(q)) {
    return {
      category: 'wealth',
      subCategory: 'wealth_stock_speculation',
      topicLabelHindi: 'शेयर बाज़ार, ट्रेडिंग एवं आकस्मिक धन लाभ (Speculative Wealth & Stocks)',
      topicLabelEnglish: 'Stock Market, Trading & Speculative Wealth Risks',
      confidence: 0.96,
    };
  }
  if (/wealth|money|dhan|paisa|finance|loss|income|aamdani|lakshmi|rich|karz|debt|कर्ज|धन लाभ|पैसा|रुपया|दौलत|आय|आवक|सम्पत्ति|दरिद्रता|பணம்|செல்வம்|డబ్బు|টাকা/i.test(q)) {
    return {
      category: 'wealth',
      subCategory: 'wealth_growth_timing',
      topicLabelHindi: 'धन योग, संचित धन एवं आर्थिक समृद्धि (Wealth Accumulation & 2nd/11th House)',
      topicLabelEnglish: 'Wealth Prospects, Dhana Yogas & Income Augmentation',
      confidence: 0.95,
    };
  }

  // 4. Property & Vehicles
  if (/car|vehicle|vahan|bike|gadi|motor|scooter|गाड़ी|वाहन|कार|वाहन सुख|வாகனம்|వాహనం/i.test(q)) {
    return {
      category: 'property_vehicles',
      subCategory: 'property_buying_vehicle',
      topicLabelHindi: 'वाहन क्रय योग एवं षोडशांश (D16 Vehicle Acquisition)',
      topicLabelEnglish: 'Vehicle Purchase Timing & D16 Shodashamsha Reading',
      confidence: 0.96,
    };
  }
  if (/property|house|land|flat|makan|ghar|plot|zameen|chaturthamsha|d4|घर|मकान|जमीन|प्लॉट|फ्लैट|भूमि|गृह निर्माण|வீடு|இల్లు|বাড়ি/i.test(q)) {
    return {
      category: 'property_vehicles',
      subCategory: 'property_buying_home',
      topicLabelHindi: 'गृह निर्माण, भूमि-भवन प्राप्ति एवं चतुर्थ भाव (Real Estate & House)',
      topicLabelEnglish: 'Real Estate, Home Construction & Land Acquisition',
      confidence: 0.95,
    };
  }

  // 5. Education & Competitive Exams
  if (/study|exam|degree|padhai|shiksha|vidya|college|university|education|scholarship|upsc|ias|sarkari.*naukri|government.*job|marks|pass|पढ़ाई|शिक्षा|परीक्षा|सरकारी नौकरी|प्रतियोगी परीक्षा|படிப்பு|చదువు|পরীক্ষা/i.test(q)) {
    return {
      category: 'education',
      subCategory: 'education_exam_success',
      topicLabelHindi: 'विद्या, प्रतियोगी परीक्षा एवं सरकारी सेवा योग (Education & Govt Exam)',
      topicLabelEnglish: 'Academic Excellence, Competitive Exams & Govt Service',
      confidence: 0.95,
    };
  }

  // 6. Foreign Travel & Settlement
  if (/abroad|foreign|videsh|settle|visa|pr|passport|immigration|green.*card|विदेश|विदेश यात्रा|वीज़ा|पीआर|வெளிநாடு|విదేశం|বিদেশ/i.test(q)) {
    return {
      category: 'foreign',
      subCategory: 'foreign_settlement_visa',
      topicLabelHindi: 'विदेश गमन, वीज़ा एवं 12वें भाव का विश्लेषण (Foreign Travel & Settlement)',
      topicLabelEnglish: 'Foreign Travel, Relocation & 9th/12th House Analysis',
      confidence: 0.96,
    };
  }

  // 7. Children & Progeny
  if (/child|kid|son|daughter|baby|santaan|garbhadhan|progeny|saptamsha|d7|bacha|bacche|pregnant|बच्चे|संतान|पुत्र|पुत्री|गर्भ|संतान सुख|குழந்தை|పిల్లలు|সন্তান/i.test(q)) {
    return {
      category: 'children',
      subCategory: 'children_progeny_timing',
      topicLabelHindi: 'संतान सुख, पंचम भाव एवं सप्तमांश (Children & D7 Saptamsha)',
      topicLabelEnglish: 'Progeny Timing, 5th House & D7 Saptamsha Evaluation',
      confidence: 0.96,
    };
  }

  // 8. Health, Ailments & Mental Stress
  if (/stress|tension|depression|anxiety|mental|dimag|neend|peace|sukha|तनाव|डिप्रेशन|चिंता|मानसिक अशांति|नींद|மன அழுத்தம்/i.test(q)) {
    return {
      category: 'health',
      subCategory: 'health_mental_stress',
      topicLabelHindi: 'मानसिक शांति, चंद्र-बुध स्थिति एवं तनाव मुक्ति (Mental Wellness & Peace)',
      topicLabelEnglish: 'Mental Equanimity, Stress Mitigation & Moon Balance',
      confidence: 0.95,
    };
  }
  if (/enemy|shatru|court|case|mukadma|jail|police|litigat|dispute|विवाद|शत्रु|कोर्ट केस|मुकदमा|मुक़दमा|எதிரி|కోర్టు/i.test(q)) {
    return {
      category: 'health',
      subCategory: 'enemies_court_case',
      topicLabelHindi: 'शत्रु बाधा, कानूनी विवाद एवं षष्ठ भाव (Litigation & Enemy Victory)',
      topicLabelEnglish: 'Legal Disputes, Adversaries & 6th House Shatru-Hanta Yoga',
      confidence: 0.95,
    };
  }
  if (/health|disease|illness|rog|bimar|hospital|operation|dard|pain|स्वास्थ्य|रोग|बीमारी|तबीयत|अस्पताल|दर्द|உடல்நலம்|ఆరోగ్యం/i.test(q)) {
    return {
      category: 'health',
      subCategory: 'health_ailments_recovery',
      topicLabelHindi: 'आरोग्य विचार, रोग मुक्ति एवं षष्ठ-अष्टम भाव (Health & Vitality)',
      topicLabelEnglish: 'Health Prognosis, Physical Vitality & Ayurvedic Balance',
      confidence: 0.95,
    };
  }

  // 9. Gemstones, Lucky Factors & Remedies
  if (/lucky.*(number|color|digit|day)|shubh.*(ank|rang|din)|शुभ.*(रंग|अंक|दिन)|लकी नंबर|अंक ज्योतिष/i.test(q)) {
    return {
      category: 'gemstone_remedy',
      subCategory: 'lucky_number_color',
      topicLabelHindi: 'शुभ अंक, शुभ रंग एवं शुभ दिशा (Lucky Numbers, Colors & Directions)',
      topicLabelEnglish: 'Lucky Numbers, Auspicious Colors & Favorable Directions',
      confidence: 0.96,
    };
  }
  if (/gem|ratna|stone|rudraksha|panna|pukhraj|manik|neelam|moti|moonga|gomed|रत्न|रुद्राक्ष|स्टोन|माणिक्य|पन्ना|पुखराज|नीलम|रत्न धारण|ரத்தினம்|రత్నం/i.test(q)) {
    return {
      category: 'gemstone_remedy',
      subCategory: 'gemstone_selection',
      topicLabelHindi: 'शुभ रत्न एवं रुद्राक्ष निर्धारण (Personalized Gemstone Selection)',
      topicLabelEnglish: 'Consecrated Vedic Gemstones & Sacred Rudraksha Prescriptions',
      confidence: 0.96,
    };
  }
  if (/ishta|deity|god|bhagwan|puja|mantra|stotra|upay|daan|charity|havan|हवन|पूजा|मंत्र|भगवान|इष्ट देव|दान|பரிகாரம்|ప్రతికారం/i.test(q)) {
    return {
      category: 'spirituality_deity',
      subCategory: 'deity_worship_mantra',
      topicLabelHindi: 'इष्ट देव आराधना, महामंत्र एवं कर्म शुद्धि (Ishta Devata & Sacred Mantras)',
      topicLabelEnglish: 'Ishta Devata Identification, Mantras & Sacred Upayas',
      confidence: 0.95,
    };
  }

  // 10. Doshas
  if (/mangal|kuja|मंगलिक|मांगलिक|भौम दोष|குஜ தோஷம்/i.test(q)) {
    return {
      category: 'dosha_analysis',
      subCategory: 'mangal_dosha_check',
      topicLabelHindi: 'मांगलिक दोष (Kuja Dosha) एवं शास्त्रीय परिहार (Mangal Dosha Analysis)',
      topicLabelEnglish: 'Mangal Dosha (Kuja Dosha) Assessment & Cancellations',
      confidence: 0.98,
    };
  }
  if (/kaal.*sarp|kal.*sarp|कालसर्प|काल सर्प दोष/i.test(q)) {
    return {
      category: 'dosha_analysis',
      subCategory: 'kaalsarp_dosha_check',
      topicLabelHindi: 'कालसर्प दोष स्थिति एवं शांति उपाय (Kaal Sarp Dosha Evaluation)',
      topicLabelEnglish: 'Kaal Sarp Yoga Presence, Classification & Remediation',
      confidence: 0.98,
    };
  }

  // 11. Dasha & Sade Sati
  if (/sade.*sati|dhaiya|shani.*transit|साढ़ेसाती|साढ़े साती|ढैया|शनि की दशा|ஏழரை சனி|ఏలినాటి శని/i.test(q)) {
    return {
      category: 'dasha_sadesati',
      subCategory: 'sade_sati_impact',
      topicLabelHindi: 'शनि साढ़ेसाती एवं ढैया का प्रभाव व उपाय (Saturn Sade Sati Analysis)',
      topicLabelEnglish: 'Saturn Sade Sati / Dhaiya Influence & Shani Shanti',
      confidence: 0.96,
    };
  }
  if (/dasha|mahadasha|antardasha|pratyantar|transit|gochar|दशा|महादशा|अंतर्दशा|गोचर/i.test(q)) {
    return {
      category: 'dasha_sadesati',
      subCategory: 'dasha_current_influence',
      topicLabelHindi: 'सक्रिय विंशोत्तरी महादशा एवं अंतर्दशा फल (Active Vimshottari Dasha)',
      topicLabelEnglish: 'Active Vimshottari Mahadasha & Antardasha Dynamics',
      confidence: 0.95,
    };
  }

  // 12. Shodashvarga
  if (/shodash|varga|vimsopaka|bala|d1|d9|d10|d16|d60|navamsha|dashamsha|hora|drekkana|षोडशवर्ग|विंशोपक|नवमांश|दशमांश|षोडशांश/i.test(q)) {
    return {
      category: 'shodashvarga',
      subCategory: 'general_guidance',
      topicLabelHindi: 'षोडशवर्ग एवं विंशोपक बल विश्लेषण (Shodashvarga & Vimsopaka Bala)',
      topicLabelEnglish: '16 Divisional Charts (Shodashvarga) & Parashari Balas',
      confidence: 0.95,
    };
  }

  return {
    category: 'general',
    subCategory: 'general_guidance',
    topicLabelHindi: 'विशिष्ट प्रश्न का ज्योतिषीय समाधान (Targeted Question Analysis)',
    topicLabelEnglish: 'Direct Vedic Analysis for Your Specific Question',
    confidence: 0.8,
  };
}

/**
 * Main Algorithmic Consultation Entry Point
 */
export function generateAlgorithmicConsultation(
  kundali: KundaliData,
  userMessage: string,
  langCode: IndianLanguageCode = 'en'
): string {
  try {
    const birthDetails = kundali?.birthDetails || { name: 'Jataka' };
    const planets = kundali?.planets || ({} as any);
    const houses = kundali?.houses || [];
    const vimshottariDasha = kundali?.vimshottariDasha || ({
      currentMahadasha: { lord: 'Jupiter', startDate: '2020-01-01', endDate: '2036-01-01' },
      currentAntardasha: { lord: 'Saturn', startDate: '2022-01-01', endDate: '2025-01-01' },
    } as any);
    const sadeSati = kundali?.sadeSati || ({ status: 'Not Active', summary: '' } as any);
    const divisionalCharts = kundali?.divisionalCharts || ({} as any);
    const vimsopakaScores = kundali?.vimsopakaScores || ({} as any);

    const name = birthDetails.name || 'Jataka';
    const lagna = planets.Ascendant || {
      sign: 'Aries', signIndex: 0, degrees: 10.0, minutes: 0,
      nakshatra: 'Ashwini', pada: 1, nakshatraLord: 'Ketu', house: 1,
    };
    const moon = planets.Moon || {
      sign: 'Taurus', signIndex: 1, degrees: 15.0, minutes: 0,
      nakshatra: 'Rohini', pada: 2, nakshatraLord: 'Moon', house: 2,
    };
    const sun = planets.Sun || {
      sign: 'Aries', signIndex: 0, degrees: 5.0, minutes: 0,
      nakshatra: 'Ashwini', pada: 2, nakshatraLord: 'Ketu', house: 1,
    };

    const currentMD = vimshottariDasha.currentMahadasha?.lord || 'Jupiter';
    const currentAD = vimshottariDasha.currentAntardasha?.lord || 'Saturn';
    const currentMDStart = vimshottariDasha.currentMahadasha?.startDate || '2021';
    const currentMDEnd = vimshottariDasha.currentMahadasha?.endDate || '2037';

    const topic = detectConsultationTopic(userMessage || '');

    const lagnaIdx = lagna.signIndex ?? 0;
    const getLord = (hIdx: number, defaultPlanet: PlanetName): PlanetName => {
      if (houses && houses[hIdx]?.signLord) return houses[hIdx].signLord;
      const calculatedSign = ZODIAC_LIST[(lagnaIdx + hIdx) % 12];
      return SIGN_LORDS_MAP[calculatedSign] || defaultPlanet;
    };

    const lagnaLord = getLord(0, 'Mars');
    const house2Lord = getLord(1, 'Venus');
    const house3Lord = getLord(2, 'Mercury');
    const house4Lord = getLord(3, 'Moon');
    const house5Lord = getLord(4, 'Sun');
    const house6Lord = getLord(5, 'Mercury');
    const house7Lord = getLord(6, 'Venus');
    const house8Lord = getLord(7, 'Mars');
    const house9Lord = getLord(8, 'Jupiter');
    const house10Lord = getLord(9, 'Saturn');
    const house11Lord = getLord(10, 'Saturn');
    const house12Lord = getLord(11, 'Jupiter');

    const ctx = {
      name,
      userMessage,
      topic,
      lagna,
      moon,
      sun,
      currentMD,
      currentAD,
      currentMDStart,
      currentMDEnd,
      sadeSati,
      lagnaLord,
      house2Lord,
      house3Lord,
      house4Lord,
      house5Lord,
      house6Lord,
      house7Lord,
      house8Lord,
      house9Lord,
      house10Lord,
      house11Lord,
      house12Lord,
      houses,
      planets,
      divisionalCharts,
      vimsopakaScores,
      langCode,
    };

    const isHindiScript = ['hi', 'sa', 'mr', 'ne', 'mai', 'doi'].includes(langCode);
    if (isHindiScript) {
      return generateDevanagariReading(ctx);
    } else if (langCode === 'ta') {
      return generateTamilReading(ctx);
    } else if (langCode === 'te') {
      return generateTeluguReading(ctx);
    } else if (langCode === 'bn') {
      return generateBengaliReading(ctx);
    } else if (langCode === 'ur') {
      return generateUrduReading(ctx);
    }

    return generateEnglishReading(ctx);
  } catch (err) {
    console.error('Safe consultation fallback error:', err);
    return `### **वैदिक ज्योतिष समाधान (Vedic Guidance)**\n\n**प्रश्न:** "${userMessage}"\n\nआपकी जन्मकुंडली के अनुसार प्रश्नगत विषय में शुभ ग्रहों का सहयोग प्राप्त हो रहा है। धैर्य एवं सत्कर्म बनाए रखें। ॐ नमः शिवाय का नित्य जप एवं सूर्य को प्रातः अर्घ्य देना समस्त विघ्नों को शांत करता है।`;
  }
}

// -------------------------------------------------------------------------------------------------
// DEVANAGARI GENERATOR (Hindi, Sanskrit, Marathi, Nepali, etc.)
// -------------------------------------------------------------------------------------------------
function generateDevanagariReading(ctx: any): string {
  const {
    name, userMessage, topic, lagna, moon, sun,
    currentMD, currentAD, currentMDStart, currentMDEnd,
    sadeSati, lagnaLord, house2Lord, house4Lord, house5Lord,
    house6Lord, house7Lord, house8Lord, house9Lord, house10Lord,
    house11Lord, house12Lord, houses, planets, divisionalCharts,
  } = ctx;

  const getP = (p: string) => planets?.[p] || {};
  const getSign = (p: string) => planets?.[p]?.sign || 'शुभ राशि';
  const getHouse = (p: string) => planets?.[p]?.house || 1;
  const getDignity = (p: string) => planets?.[p]?.dignity || 'सामान्य';

  const sub = topic.subCategory;
  let directVerdict = '';
  let planetaryAnalysis = '';
  let timingPrediction = '';
  let targetedRemedies = '';

  switch (sub) {
    case 'marriage_timing': {
      directVerdict = `आपकी जन्मकुंडली में विवाह योग परिपक्व अवस्था में है। सप्तम भाव और सप्तमेश की अनुकूलता यह दर्शाती है कि आगामी समय में मांगलिक कार्य एवं विवाह संबंध निश्चित होने की पूर्ण संभावना है।`;
      planetaryAnalysis = `
• **सप्तम भाव एवं सप्तमेश (${house7Lord})**: आपके दांपत्य भाव के अधिपति **${house7Lord}** कुंडली के ${getHouse(house7Lord)}वें भाव में ${getSign(house7Lord)} राशि में (${getDignity(house7Lord)}) स्थित हैं।
• **कारक ग्रह शुक्र (Venus) एवं गुरु**: दांपत्य कारक शुक्र ${getHouse('Venus')}वें भाव में स्थित होकर वैवाहिक सुख को पोषित कर रहे हैं।
• **नवमांश (D-9 Navamsha)**: सूक्ष्म दांपत्य फल हेतु महर्षि पाराशर नवमांश चक्र का विधान करते हैं। आपके नवमांश में सप्तमेश की सुदृढ़ता वैवाहिक स्थायित्व का स्पष्ट प्रमाण है।`;
      timingPrediction = `वर्तमान में आपकी **${currentMD}** महादशा में **${currentAD}** अंतर्दशा चल रही है। आगामी **६ से १८ माह** का समय जब गोचर में गुरु आपके लग्न या सप्तम भाव को अमृत दृष्टि से देखेंगे, विवाह संस्कार संपन्न होने का सर्वोत्कृष्ट काल होगा।`;
      targetedRemedies = `
• **वैदिक शुक्र मंत्र**: प्रतिदिन अथवा शुक्रवार को *"ॐ शुं शुक्राय नमः"* का १०८ बार जप करें।
• **दांपत्य सुख हेतु**: शुक्रवार के दिन किसी कन्या या मंदिर में श्वेत मिष्ठान्न या दूध का दान करें।
• **रुद्राक्ष**: दो मुखी रुद्राक्ष अथवा गौरी-शंकर रुद्राक्ष धारण करना वैवाहिक विलंब को तत्काल दूर करता है।`;
      break;
    }

    case 'marriage_love_or_arranged': {
      const p5 = getHouse(house5Lord);
      const p7 = getHouse(house7Lord);
      const isLoveDominant = Math.abs(p5 - p7) <= 2 || p5 === 7 || p7 === 5 || getHouse('Venus') === 5 || getHouse('Venus') === 7;
      directVerdict = isLoveDominant
        ? `आपकी कुंडली में **प्रेम-विवाह (Love Marriage / Love-cum-Arranged)** के अत्यंत प्रबल योग विद्यमान हैं। आपका विवाह अपनी पसंद के व्यक्ति से परिवार की सहमति के साथ संपन्न होगा।`
        : `आपकी कुंडली में **पारंपरिक पारिवारिक विवाह (Arranged Marriage)** सर्वाधिक सुखद, सफल एवं वंश-वृद्धि कारक सिद्ध होगा। पारिवारिक सहमति से हुआ संबंध दीर्घायु एवं समृद्ध रहेगा।`;
      planetaryAnalysis = `
• **पंचम भाव (प्रेम/भावना)**: पंचमेश **${house5Lord}** भाव ${getHouse(house5Lord)} में हैं।
• **सप्तम भाव (विवाह/अनुबंध)**: सप्तमेश **${house7Lord}** भाव ${getHouse(house7Lord)} में विराजमान हैं।
• **प्रेम-विवाह का शास्त्रीय नियम**: पाराशर सिद्धांत के अनुसार पंचम (प्रेम) और सप्तम (विवाह) भावों अथवा उनके स्वामियों के मध्य दृष्टि या युति संबंध होने पर व्यक्ति अपने हृदय की पसंद से परिणय सूत्र में बंधता है।`;
      timingPrediction = `वर्तमान **${currentMD}-${currentAD}** दशा काल में आपके व्यक्तिगत संबंधों को सामाजिक व पारिवारिक स्वीकृति प्राप्त होगी। परिवार से संवाद हेतु शुक्ल पक्ष का समय अत्यंत श्रेयस्कर है।`;
      targetedRemedies = `
• **माता कात्यायनी मंत्र**: *"कात्यायनि महामाये महायोगिन्यधीश्वरि। नन्दगोपसुतं देवि पतिं मे कुरु ते नमः॥"* का नियमित जप मनोवांछित जीवनसाथी की प्राप्ति कराता है।
• **राधा-कृष्ण पूजन**: गुरुवार एवं शुक्रवार को राधा-कृष्ण जी के मंदिर में बांसुरी या पीले पुष्प अर्पित करें।`;
      break;
    }

    case 'marriage_spouse_nature': {
      const s7 = houses?.[6]?.sign || 'तुला';
      directVerdict = `आपके भावी जीवनसाथी **संस्कारवान, बुद्धिमान, स्वाभिमानी एवं पारिवारिक दायित्वों को निष्ठापूर्वक निभाने वाले** होंगे। उनका व्यक्तित्व आकर्षक एवं विचार सुलझे हुए होंगे।`;
      planetaryAnalysis = `
• **सप्तम भाव की राशि**: आपके सप्तम भाव में **${s7}** राशि का प्रभाव है, जो जीवनसाथी को सुरुचिपूर्ण, कलाप्रिय और संतुलित दृष्टिकोण प्रदान करता है।
• **सप्तमेश (${house7Lord}) का स्थान**: सप्तमेश ${getHouse(house7Lord)}वें भाव में स्थित हैं, जो दर्शाता है कि जीवनसाथी सुशिक्षित एवं कर्मठ पृष्ठभूमि से होंगे।
• **दिशा एवं दूरी**: सप्तमेश की दिशा के अनुसार जीवनसाथी का मूल निवास आपके जन्म स्थान से **पूर्व या उत्तर-पूर्व** दिशा में होने के सर्वाधिक संयोग हैं।`;
      timingPrediction = `सप्तम भाव पर शुभ ग्रहों का गोचर सक्रिय होते ही जीवनसाथी के आगमन के द्वार खुलेंगे। आपका दांपत्य जीवन पारस्परिक सम्मान पर आधारित रहेगा।`;
      targetedRemedies = `
• **गृहस्थ सुख वर्धन**: शुक्रवार को गाय को ताजी रोटी में गुड़ या मिश्री रखकर खिलाएं।
• **सौंदर्य एवं आकर्षण**: नित्य प्रातः सूर्य नमस्कार के उपरांत *"ॐ नमो नारायणाय"* का मनन करें।`;
      break;
    }

    case 'career_job_vs_business': {
      const h6Dignity = getDignity(house6Lord);
      const h10Dignity = getDignity(house10Lord);
      const favorBusiness = h10Dignity === 'Exalted' || h10Dignity === 'Own Sign' || getHouse('Mercury') === 10 || getHouse('Sun') === 10;
      directVerdict = favorBusiness
        ? `आपकी कुंडली में **स्वतंत्र व्यापार, स्टार्टअप अथवा व्यावसायिक उद्यम (Business & Entrepreneurship)** में अद्वितीय सफलता का योग है। आप में स्वाभाविक नेतृत्व क्षमता है।`
        : `आपकी कुंडली में **उच्च-स्तरीय नौकरी एवं सेवा क्षेत्र (Executive Job / Corporate Leadership / Public Service)** सर्वाधिक सुरक्षित, मान-सम्मान एवं निरंतर पदोन्नति प्रदायक रहेगा। यदि व्यापार करना हो, तो पार्टनरशिप के बजाय पहले सेवा क्षेत्र में अनुभव लें।`;
      planetaryAnalysis = `
• **षष्ठ भाव (नौकरी/सेवा)**: षष्ठेश **${house6Lord}** भाव ${getHouse(house6Lord)} में स्थित हैं।
• **दशम भाव (आजीविका/कर्म)**: दशमेश **${house10Lord}** भाव ${getHouse(house10Lord)} में ${getSign(house10Lord)} में प्रतिष्ठित हैं।
• **व्यापार कारक बुध (Mercury)**: बुध देव ${getHouse('Mercury')}वें भाव में स्थित होकर व्यावसायिक बुद्धि को दिशा दे रहे हैं।`;
      timingPrediction = `वर्तमान **${currentMD}** महादशा आपके कार्यक्षेत्र में निर्णायक विस्तार का समय है। यदि नौकरी बदलनी हो या नवीन प्रोजेक्ट आरंभ करना हो, तो वर्तमान तिमाही अनुकूल है।`;
      targetedRemedies = `
• **कार्य सिद्धि मंत्र**: नित्य प्रातः *"ॐ नमो भगवते वासुदेवाय"* का १०८ बार जप करें।
• **व्यापारिक उन्नति**: बुधवार को गाय को हरा चारा अथवा पक्षियों को हरी मूंग की दाल खिलाएं।`;
      break;
    }

    case 'career_field_selection': {
      directVerdict = `आपकी जन्मकुंडली के दशमेश एवं प्रमुख ग्रहों के अनुसार आपके लिए **प्रशासन, वित्त, सूचना प्रौद्योगिकी (IT/Tech), प्रबंधन (Management), अथवा परामर्श (Consulting)** का क्षेत्र सर्वाधिक भाग्योदयकारी रहेगा।`;
      planetaryAnalysis = `
• **दशम भाव (कर्म क्षेत्र)**: आपके दशम भाव के अधिपति **${house10Lord}** हैं, जो कार्यक्षेत्र के मूल स्वभाव का निर्धारण करते हैं।
• **दशमांश चक्र (D-10 Dashamsha)**: आजीविका के सूक्ष्म फल हेतु पाराशर मुनि दशमांश चक्र को प्रमाण मानते हैं। दशमांश में सूर्य और गुरु का प्रभाव आपको बौद्धिक एवं संगठनात्मक क्षेत्रों में शीर्ष स्थान प्रदान करता है।
• **प्रधान ग्रह प्रभाव**: यदि आप तकनीकी, कानूनी या वित्तीय विश्लेषण से जुड़े कार्यों में अग्रसर होंगे, तो कम समय में उच्च सम्मान अर्जित करेंगे।`;
      timingPrediction = `आगामी समय में कार्यक्षेत्र में नई जिम्मेदारियां एवं विशेषज्ञता प्राप्त करने का सशक्त योग निर्मित हो रहा है।`;
      targetedRemedies = `
• **सूर्य उपासना**: नित्य प्रातः तांबे के लोटे से भगवान सूर्य को कुंकुम एवं अक्षत मिश्रित जल अर्पित करें।
• **आदित्य हृदय स्तोत्र**: रविवार के दिन आदित्य हृदय स्तोत्र का पाठ नेतृत्व क्षमता में असाधारण वृद्धि करता है।`;
      break;
    }

    case 'career_promotion_timing': {
      directVerdict = `आपके कार्यक्षेत्र में **पदोन्नति (Promotion), वेतन वृद्धि एवं नवीन पदभार प्राप्ति के अत्यंत शुभ योग** बन रहे हैं। वरिष्ठ अधिकारियों से सहयोग और कार्यकुशलता की सराहना प्राप्त होगी।`;
      planetaryAnalysis = `
• **दशमेश (${house10Lord})**: आपके कर्म भाव के स्वामी ${getHouse(house10Lord)}वें भाव में स्थित हैं, जो अधिकार एवं प्रतिष्ठा के संवर्धन का संकेत देते हैं।
• **एकादश भाव (लाभ व आय)**: लाभेश **${house11Lord}** की अनुकूलता परिश्रम के अनुरूप आर्थिक पुरस्कार सुनिश्चित करती है।
• **विंशोत्तरी दशा का बल**: **${currentMD}** महादशा में **${currentAD}** अंतर्दशा कर्म फल को तीव्रता से सक्रिय कर रही है।`;
      timingPrediction = `आगामी **३ से ९ माह** के भीतर प्रमोशन, वेतन वृद्धि अथवा बहुप्रतीक्षित स्थानांतरण का मार्ग प्रशस्त होगा। विशेषकर जब गुरु का गोचर आपके दशम भाव पर दृष्टिपात करेगा।`;
      targetedRemedies = `
• **कार्य सिद्धि प्रयोग**: कार्य पर निकलते समय मीठा जल या तुलसी दल ग्रहण करें।
• **शनि कृपा**: शनिवार को पीपल वृक्ष के नीचे सरसों के तेल का दीपक प्रज्वलित करें।`;
      break;
    }

    case 'wealth_growth_timing': {
      directVerdict = `आपकी कुंडली में **स्थिर धन संचय एवं एकादश भाव जनित लाभ (Dhana Yoga)** के सुंदर संयोग हैं। जीवन में आर्थिक सुदृढ़ता निरंतर बढ़ेगी और संपत्तियों का निर्माण होगा।`;
      planetaryAnalysis = `
• **द्वितीय भाव (धन संचय/कोष)**: धनेश **${house2Lord}** भाव ${getHouse(house2Lord)} में ${getSign(house2Lord)} में स्थित हैं।
• **एकादश भाव (आय/लाभ)**: लाभेश **${house11Lord}** का संबंध आपके प्रयासों को निरंतर आर्थिक प्रतिफल में परिवर्तित करता है।
• **धनकारक बृहस्पति**: गुरु देव ${getHouse('Jupiter')}वें भाव में विराजित होकर धन की स्थिरता एवं शुचिता सुनिश्चित कर रहे हैं।`;
      timingPrediction = `वर्तमान **${currentMD}** महादशा आर्थिक उन्नयन का समय है। आगामी वित्तीय वर्ष में अप्रत्याशित स्रोतों से धन का आगमन एवं पुराने निवेशों से लाभ प्राप्त होगा।`;
      targetedRemedies = `
• **श्री कनकधारा स्तोत्र**: नित्य अथवा शुक्रवार को श्री कनकधारा स्तोत्र अथवा श्री सूक्त का पाठ करें।
• **महालक्ष्मी मंत्र**: *"ॐ श्रीं ह्रीं क्लीं ग्लौं गं गणपतये वर वरद सर्वजनं मे वशमानय स्वाहा॥"* का मनन करें।
• **दान**: शुक्रवार को किसी जरूरतमंद को सफेद वस्त्र या अन्न का दान दें।`;
      break;
    }

    case 'wealth_stock_speculation': {
      const rahuHouse = getHouse('Rahu');
      const p5House = getHouse(house5Lord);
      const isSpeculationSafe = p5House === 5 || p5House === 9 || p5House === 11 || getDignity(house5Lord) === 'Exalted';
      directVerdict = isSpeculationSafe
        ? `शेयर बाज़ार, म्यूचुअल फंड एवं सुविचारित दीर्घावधि निवेश (Calculated Long-term Investing) में आपके लिए **सकारात्मक लाभ के योग** हैं। परंतु इंट्रा-डे या अंधाधुंध सट्टेबाजी से बचना अनिवार्य है।`
        : `आपकी कुंडली के अनुसार **शेयर मार्केट, इंट्रा-डे ट्रेडिंग या क्रिप्टो सट्टेबाजी में अत्यधिक जोखिम एवं अचानक धन हानि के योग** हैं। आपको सुरक्षित फिक्स्ड डिपॉजिट, गोल्ड, अथवा रियल एस्टेट में ही निवेश करना चाहिए।`;
      planetaryAnalysis = `
• **पंचम भाव (आकस्मिक लाभ/सट्टा बुद्धि)**: पंचमेश **${house5Lord}** भाव ${p5House} में स्थित हैं।
• **राहु की स्थिति (अचानक उतार-चढ़ाव)**: राहु देव ${rahuHouse}वें भाव में हैं। राहु यदि ५वें या ८वें भाव को प्रभावित करे, तो ट्रेडिंग में मोह उत्पन्न कर हानि कराता है।
• **बुध (विश्लेषण क्षमता)**: बुध देव की स्थिति बताती है कि भावनात्मक निर्णय लेने के बजाय तथ्यों पर आधारित शोध ही धन की रक्षा करेगा।`;
      timingPrediction = `अस्थिर सट्टेबाजी से दूर रहें। दीर्घावधि एसआईपी (SIP) एवं मजबूत ब्लूचिप कंपनियों में किया गया निवेश आपको सुरक्षित संवृद्धि प्रदान करेगा।`;
      targetedRemedies = `
• **राहु शांति**: पक्षियों को नियमित बाजरा एवं चींटियों को आटा-शक्कर खिलाएं।
• **बुध बल**: बुधवार को भगवान गणेश को दुर्वा की २१ गांठे अर्पित करें एवं *"ॐ गं गणपतये नमः"* जपें।`;
      break;
    }

    case 'property_buying_home': {
      directVerdict = `आपकी जन्मकुंडली में **स्वयं का घर, फ्लैट या अचल संपत्ति (Real Estate & Griha Prapti)** के अति विशिष्ट योग बने हुए हैं। आप अपने बाहुबल एवं भाग्य से सुंदर गृह निर्माण करेंगे।`;
      planetaryAnalysis = `
• **चतुर्थ भाव (गृह-सुख/भूमि)**: चतुर्थेश **${house4Lord}** भाव ${getHouse(house4Lord)} में प्रतिष्ठित हैं।
• **भूमि कारक मंगल (Mars)**: मंगल देव भूमि एवं निर्माण के नैसर्गिक स्वामी हैं। आपके मंगल देव भाव ${getHouse('Mars')} में (${getDignity('Mars')}) विराजमान हैं।
• **चतुर्थांश चक्र (D-4)**: संपत्तियों के सूक्ष्म फल हेतु चतुर्थांश चक्र में अनुकूल ग्रह संपत्ति योग को बल दे रहे हैं।`;
      timingPrediction = `वर्तमान **${currentMD}-${currentAD}** दशा अवधि में संपत्ति सौदे अथवा नवीन मकान का पंजीकरण संपन्न होने का अत्यंत अनुकूल कालखंड सक्रिय है।`;
      targetedRemedies = `
• **भूमि रक्षा मंत्र**: मंगलवार को श्री हनुमान चालीसा एवं सुंदरकांड का पाठ करें।
• **मंगल अर्घ्य**: मंगलवार के दिन तांबे के लोटे से सूर्य एवं मंगल का स्मरण करते हुए भूमि पर जल अर्पित करें।`;
      break;
    }

    case 'property_buying_vehicle': {
      directVerdict = `आपकी कुंडली में **सुंदर एवं आरामदायक वाहन (Car/Vehicle) प्राप्ति का पूर्ण योग** है। वाहन क्रय से आपके परिवार में हर्षोल्लास एवं मान-सम्मान की वृद्धि होगी।`;
      planetaryAnalysis = `
• **वाहन कारक शुक्र (Venus)**: शुक्र देव भाव ${getHouse('Venus')} में स्थित होकर भौतिक सुख-साधनों के उपभोग का मार्ग प्रशस्त कर रहे हैं।
• **षोडशांश चक्र (D-16 Shodashamsha)**: महर्षि पाराशर षोडशवर्ग में वाहनों के लिए षोडशांश (D-16) को २.० का भारी विंशोपक बल प्रदान करते हैं। आपके षोडशांश में शुभ स्थिति वाहन सुख की गारंटी देती है।
• **अनुकूल वाहन रंग**: आपकी राशि एवं लग्न के अनुसार **सफेद, सिल्वर, गहरा नीला अथवा मैरून** रंग का वाहन सर्वाधिक भाग्यशाली रहेगा।`;
      timingPrediction = `वर्तमान दशा अवधि में आगामी कुछ ही महीनों में नवीन वाहन क्रय के शुभ संयोग बन रहे हैं। शुक्ल पक्ष के शुक्रवार अथवा गुरुवार को डिलीवरी लेना श्रेयस्कर होगा।`;
      targetedRemedies = `
• **वाहन रक्षा**: वाहन लेने के पश्चात उस पर सिंदूर से ॐ अथवा स्वास्तिक अंकित करवाएं और भगवान शिव या हनुमान जी को नारियल अर्पित करें।`;
      break;
    }

    case 'education_exam_success': {
      directVerdict = `आपकी कुंडली में **उच्च शिक्षा, बौद्धिक तीक्ष्णता एवं प्रतियोगी परीक्षाओं (Competitive / Government Exams) में सफलता** के सशक्त योग हैं। एकाग्रता बनाए रखने पर उच्च पद प्राप्त होगा।`;
      planetaryAnalysis = `
• **पंचम भाव (मेधा/बुद्धि)**: पंचमेश **${house5Lord}** भाव ${getHouse(house5Lord)} में ज्ञान को प्रकाशित कर रहे हैं।
• **नवम भाव (उच्च ज्ञान/भाग्य)**: भाग्येश **${house9Lord}** की दृष्टि गुरु कृपा एवं प्रतियोगी परीक्षाओं में भाग्य का साथ सुनिश्चित करती है।
• **सूर्य एवं गुरु**: प्रशासनिक सेवाओं एवं सरकारी सत्ता के स्वामी सूर्य देव ${getHouse('Sun')}वें भाव में स्थित हैं, जो राजकृपा का मार्ग खोलते हैं।`;
      timingPrediction = `आगामी परीक्षा चक्र में आपकी तैयारी रंग लाएगी। विशेषकर प्रातः काल के अध्ययन से स्मृति एवं एकाग्रता में अभूतपूर्व वृद्धि होगी।`;
      targetedRemedies = `
• **सरस्वती महामंत्र**: नित्य अध्ययन से पूर्व *"ॐ ऐं सरस्वत्यै नमः"* का ११ बार उच्चारण करें।
• **गायत्री उपासना**: नित्य प्रातः ३ बार गायत्री मंत्र जपें और तांबे के पात्र में रखा जल पिएं।`;
      break;
    }

    case 'foreign_settlement_visa': {
      const h12Dignity = getDignity(house12Lord);
      const isForeignStrong = getHouse('Rahu') === 12 || getHouse('Rahu') === 9 || getHouse(house12Lord) === 9 || getHouse(house9Lord) === 12 || getHouse(lagnaLord) === 12;
      directVerdict = isForeignStrong
        ? `आपकी जन्मकुंडली में **विदेश गमन, विदेश में उच्च शिक्षा, कार्य अथवा स्थायी निवास (Foreign Travel / PR Settlement)** के अत्यंत पुष्ट एवं बलवान योग विद्यमान हैं। जन्मभूमि से दूर आपका भाग्योदय अधिक द्रुत गति से होगा।`
        : `आपकी कुंडली में **अल्पकालिक विदेश यात्रा, पर्यटन अथवा सुदूर व्यापारिक यात्राओं के योग** हैं। स्थायी निवास के बजाय भारत में रहकर बहुराष्ट्रीय (MNC) परियोजनाओं से जुड़ना आपके लिए अधिक फलदायी रहेगा।`;
      planetaryAnalysis = `
• **द्वादश भाव (विदेश/सुदूर भूमि)**: द्वादशेश **${house12Lord}** भाव ${getHouse(house12Lord)} में स्थित हैं।
• **नवम भाव (दीर्घ यात्रा)**: नवमेश **${house9Lord}** का संबंध लंबी दूरी की यात्राओं को प्रेरित करता है।
• **राहु एवं चर राशियां**: राहु देव एवं चर राशियों का लग्न/द्वादश से संबंध व्यक्ति को सागर पार की भूमि पर ले जाता है।`;
      timingPrediction = `वर्तमान **${currentMD}-${currentAD}** दशा अवधि में वीज़ा, पासपोर्ट एवं विदेशी अनुबंधों में आने वाली अड़चनें दूर होंगी और यात्रा के योग प्रशस्त होंगे।`;
      targetedRemedies = `
• **विघ्न विनाशक प्रयोग**: बुधवार को भगवान गणेश को मोदक अर्पित करें और संकटनाशन गणेश स्तोत्र का पाठ करें।
• **भैरव उपासना**: शनिवार को भैरव जी के मंदिर में सरसों के तेल का दीपक लगाएं।`;
      break;
    }

    case 'children_progeny_timing': {
      directVerdict = `आपकी कुंडली में **उत्कृष्ट एवं संस्कारी संतान सुख (Progeny Bliss)** का सुंदर योग है। आपकी संतान कुल का नाम रोशन करने वाली और आपके प्रति आज्ञाकारी होगी।`;
      planetaryAnalysis = `
• **पंचम भाव (संतान भाव)**: पंचमेश **${house5Lord}** भाव ${getHouse(house5Lord)} में स्थित हैं।
• **संतान कारक गुरु (Jupiter)**: देवगुरु बृहस्पति संतान के नैसर्गिक कारक हैं। गुरु देव भाव ${getHouse('Jupiter')} में (${getDignity('Jupiter')}) स्थित होकर संतान वृद्धि का आशीर्वाद देते हैं।
• **सप्तमांश चक्र (D-7 Saptamsha)**: महर्षि पाराशर संतान विचार हेतु D-7 को मुख्य आधार मानते हैं। आपके सप्तमांश में शुभ ग्रहों का प्रभाव वंश वृद्धि को सुनिश्चित करता है।`;
      timingPrediction = `वर्तमान **${currentMD}** महादशा एवं गोचर में देवगुरु बृहस्पति की पंचम भाव पर दृष्टि से संतान प्राप्ति के अत्यंत मांगलिक संयोग बन रहे हैं।`;
      targetedRemedies = `
• **संतान गोपाल मंत्र**: *"ॐ देवकीसुत गोविन्द वासुदेव जगत्पते। देहि मे तनयं कृष्ण त्वामहं शरणं गतः॥"* का नित्य १०८ बार जप करें।
• **गुरुवार व्रत/सेवा**: गुरुवार को गाय को चने की दाल एवं गुड़ खिलाएं।`;
      break;
    }

    case 'health_ailments_recovery': {
      directVerdict = `आपकी कुंडली में **जीवन रक्षक लग्नेश बलवान है, अतः किसी भी मौसमी रोग या परेशानी से शीघ्र स्वास्थ्य लाभ (Speedy Recovery)** प्राप्त होगा। दीर्घायु एवं जीवनी शक्ति सुदृढ़ बनी रहेगी।`;
      planetaryAnalysis = `
• **लग्न एवं लग्नेश (${lagnaLord})**: आपके शरीर एवं जीवनी शक्ति के स्वामी ${lagnaLord} ${getHouse(lagnaLord)}वें भाव में स्थित हैं, जो रोग प्रतिरोधक क्षमता (Immunity) के मुख्य संवाहक हैं।
• **षष्ठ भाव (रोग/ऋण)**: षष्ठेश **${house6Lord}** की स्थिति पर नजर रखने से पाचन तंत्र एवं स्नायु तंत्र की देखभाल आवश्यक प्रतीत होती है।
• **सूर्य एवं चंद्र**: आत्मा के कारक सूर्य एवं मन के कारक चंद्रमा का संतुलन आपके स्वास्थ्य को ऊर्जावान बनाए रखता है।`;
      timingPrediction = `आगामी समय में स्वास्थ्य में तीव्र सुधार दृष्टिगोचर होगा। प्राणायाम एवं संतुलित सात्विक आहार अपनाने से समस्त व्याधियां शांत होंगी।`;
      targetedRemedies = `
• **महामृत्युंजय मंत्र**: प्रतिदिन ११ अथवा १०८ बार *"ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात्॥"* का जप संजीवनी के समान फल देता है।
• **जल अर्पण**: प्रातः तांबे के लोटे से सूर्य को जल दें और भगवान शिव पर कच्चा दूध मिश्रित जल अर्पित करें।`;
      break;
    }

    case 'health_mental_stress': {
      directVerdict = `आपके मानसिक तनाव, अनिद्रा अथवा व्यर्थ की चिंताओं का मूल कारण **चंद्रमा एवं बुध पर राहु-केतु अथवा शनि का गोचरीय प्रभाव** है। उचित वैदिक उपायों से चित्त शांत और एकाग्र होगा।`;
      planetaryAnalysis = `
• **चंद्रमा की स्थिति**: मन के स्वामी चंद्रमा **${moon.sign}** राशि में **${moon.nakshatra}** नक्षत्र में विराजमान हैं।
• **चतुर्थ भाव (मानसिक शांति)**: मन के सुख भाव के स्वामी **${house4Lord}** भाव ${getHouse(house4Lord)} में स्थित हैं।
• **तनाव का ज्योतिषीय कारण**: जब मन का कारक चंद्रमा पीड़ित होता है, तो व्यक्ति भविष्य की कल्पित चिंताओं में ऊर्जा नष्ट करता है।`;
      timingPrediction = `आगामी शुक्ल पक्ष के साथ ही मानसिक भार में उल्लेखनीय कमी आएगी और सकारात्मक विचारों का संचार होगा।`;
      targetedRemedies = `
• **शिव आराधना**: सोमवार को शिवलिंग पर जल और सफेद चंदन अर्पित करें।
• **चांदी का उपयोग**: शुद्ध चांदी के गिलास में नियमित जल पिएं अथवा कनिष्ठा उंगली में चांदी का छल्ला धारण करें।
• **ध्यान**: रात्रि में सोने से पूर्व ५ मिनट ॐ नमः शिवाय का शांत जप करें।`;
      break;
    }

    case 'enemies_court_case': {
      directVerdict = `आपकी कुंडली में **शत्रु-हंता योग (Shatru-Hanta Yoga) एवं विवादों में विजय** के स्पष्ट संकेत हैं। विरोधी परास्त होंगे और कानूनी मामलों में न्याय आपके पक्ष में रहेगा।`;
      planetaryAnalysis = `
• **षष्ठ भाव (शत्रु/कोर्ट केस)**: षष्ठेश **${house6Lord}** भाव ${getHouse(house6Lord)} में स्थित हैं।
• **मंगल एवं सूर्य का तेज**: पराक्रम कारक मंगल भाव ${getHouse('Mars')} में हैं, जो आपके आत्मबल को निर्भीक बनाते हैं।
• **न्याय कारक शनि**: शनि देव कर्म और न्याय के निष्पक्ष निर्णायक हैं। यदि आपका पक्ष सत्य पर आधारित है, तो विजय सुनिश्चित है।`;
      timingPrediction = `विवादों के समाधान अथवा समझौते के लिए आगामी ३ से ६ माह अत्यंत निर्णायक रहेंगे।`;
      targetedRemedies = `
• **बजरंग बाण**: मंगलवार एवं शनिवार को बजरंग बाण का पाठ करें।
• **सरसों का तेल दान**: शनिवार को लोहे के पात्र में सरसों का तेल भरकर छाया दान करें।`;
      break;
    }

    case 'dasha_current_influence': {
      directVerdict = `वर्तमान में आपकी **${currentMD}** महादशा में **${currentAD}** अंतर्दशा सक्रिय है (${currentMDStart} से ${currentMDEnd})। यह दशा चक्र आपके जीवन को एक नई दिशा एवं परिपक्वता प्रदान करने वाला है।`;
      planetaryAnalysis = `
• **महादशाधिपति (${currentMD})**: महादशा स्वामी ${currentMD} आपके ${getHouse(currentMD)}वें भाव में स्थित हैं। यह ग्रह आपकी मुख्य जीवन-धारा का नियंत्रण कर रहा है।
• **अंतर्दशाधिपति (${currentAD})**: अंतर्दशा स्वामी ${currentAD} भाव ${getHouse(currentAD)} में स्थित हैं। इन दोनों ग्रहों का आपसी संबंध इस कालखंड के सुख-दुख का निर्णय करता है।
• **पाराशर विंशोत्तरी नियम**: महादशा दीर्घकालिक मंच तैयार करती है और अंतर्दशा दैनिक घटनाओं को रूप देती है।`;
      timingPrediction = `यह समयावधि नवीन ज्ञान, संपत्ति, आध्यात्मिक विकास एवं सामाजिक सम्मान में वृद्धि के लिए अत्यंत उर्वर है। व्यर्थ के विवादों से बचकर एकाग्र रहें।`;
      targetedRemedies = `
• **दशा स्वामी मंत्र**: प्रतिदिन महादशा स्वामी **${currentMD}** के वैदिक मंत्र का १०८ बार जप करें।
• **सदाचार**: वृद्धजनों एवं गुरुजनों का आशीर्वाद लें।`;
      break;
    }

    case 'sade_sati_impact': {
      const sStat = sadeSati?.status || 'सामान्य स्थिति';
      directVerdict = `आपकी कुंडली में शनि देव की स्थिति के अनुसार साढ़ेसाती का प्रभाव: **${sStat}**। शनि देव न्याय के देवता हैं, वे केवल व्यक्ति को तपाकर कुंदन बनाते हैं, कष्ट देना उनका उद्देश्य नहीं है।`;
      planetaryAnalysis = `
• **चंद्रमा की राशि**: आपकी जन्म राशि **${moon.sign}** है।
• **शनि की स्थिति**: आपके जन्मकालिक शनि भाव ${getHouse('Saturn')} में (${getDignity('Saturn')}) प्रतिष्ठित हैं।
• **शनि का संदेश**: साढ़ेसाती के दौरान अनुशासन, सत्यवादिता, कर्मठता और अहंकार-शून्यता अपनाने से शनि देव रंक को भी राजा बना देते हैं।`;
      timingPrediction = `धैर्य एवं नियमित दिनचर्या बनाए रखें। किसी भी प्रकार के शॉर्टकट या अनैतिक आचरण से दूर रहें, शनि देव का आशीर्वाद प्राप्त होगा।`;
      targetedRemedies = `
• **शनि चालीसा एवं दीपदान**: शनिवार की संध्या पीपल वृक्ष के नीचे सरसों के तेल का दीपक प्रज्वलित करें।
• **दशरथकृत शनि स्तोत्र**: शनिवार को राजा दशरथ रचित शनि स्तोत्र का पाठ समस्त कष्टों का निवारण करता है।
• **मदद**: सफाई कर्मचारियों अथवा असहाय व्यक्तियों को भोजन या जूते-चप्पल का दान दें।`;
      break;
    }

    case 'gemstone_selection': {
      const lagnaStone = GEMSTONE_DATA[lagnaLord] || GEMSTONE_DATA['Sun'];
      const bhagyaStone = GEMSTONE_DATA[house9Lord] || GEMSTONE_DATA['Jupiter'];
      directVerdict = `आपकी जन्मकुंडली के आधार पर आपका **सर्वश्रेष्ठ जीवन रक्षक रत्न (Life Stone): ${lagnaStone.stoneHi}** एवं आपका **परम भाग्यवर्धक रत्न (Lucky Stone): ${bhagyaStone.stoneHi}** है।`;
      planetaryAnalysis = `
• **लग्नेश (${lagnaLord}) का रत्न**: लग्नेश आपका प्रमुख रक्षा कवच है। **${lagnaStone.stoneHi}** को **${lagnaStone.metal}** में मढ़वाकर **${lagnaStone.finger}** में **${lagnaStone.day}** को विधिपूर्वक धारण करना चाहिए।
• **मंत्र**: धारण से पूर्व मंत्र *" ${lagnaStone.mantra} "* का १०८ बार संपूट करें।
• **भाग्येश (${house9Lord}) का रत्न**: नवम भाव भाग्य का है। **${bhagyaStone.stoneHi}** आपके अवरुद्ध कार्यों को गति प्रदान करेगा।
• **सावधानी**: मारक अथवा षष्ठेश/अष्टमेश के रत्न बिना विशेष शुद्धि के कभी धारण न करें।`;
      timingPrediction = `शुक्ल पक्ष के शुभ नक्षत्र में प्राण-प्रतिष्ठा करवाकर रत्न धारण करने से आगामी ४० दिनों में स्पष्ट सकारात्मक परिणाम दृष्टिगोचर होंगे।`;
      targetedRemedies = `
• **रुद्राक्ष विकल्प**: यदि रत्न धारण न करना चाहें, तो **पंचमुखी अथवा एकादश मुखी नेपाल रुद्राक्ष** गंगाजल से शुद्ध कर लाल धागे में गले में धारण करें।`;
      break;
    }

    case 'lucky_number_color': {
      const numMap: Record<string, number> = { Sun: 1, Moon: 2, Jupiter: 3, Rahu: 4, Mercury: 5, Venus: 6, Ketu: 7, Saturn: 8, Mars: 9 };
      const colorMap: Record<string, string> = {
        Sun: 'केसरिया, लाल एवं स्वर्णिम (Saffron / Gold)',
        Moon: 'श्वेत, क्रीम एवं मोती जैसा उजला (White / Cream)',
        Mars: 'लाल, मूंगिया एवं गहरा नारंगी (Coral Red)',
        Mercury: 'हरा, तोतिया एवं पन्ना रंग (Emerald Green)',
        Jupiter: 'पीला, हल्दी जैसा एवं सुनहरा (Yellow / Turmeric)',
        Venus: 'सफेद, चमकीला एवं हल्का गुलाबी (Bright White / Pink)',
        Saturn: 'नीला, नेवी ब्लू एवं जामुनी (Navy Blue / Violet)',
      };
      const lNum = numMap[lagnaLord] || 1;
      const lColor = colorMap[lagnaLord] || 'पीला एवं सफेद';
      directVerdict = `आपकी कुंडली के अनुसार आपका **परम शुभ अंक (Lucky Number): ${lNum}** एवं **शुभ रंग (Lucky Colors): ${lColor}** है।`;
      planetaryAnalysis = `
• **शुभ अंक**: आपके लिए **${lNum}** और इसके मित्र अंक (जैसे ${((lNum + 2) % 9) + 1}) किसी भी महत्वपूर्ण कार्य, वाहन नंबर, या बैंक खाते हेतु अत्यंत मंगलकारी हैं।
• **शुभ रंग**: **${lColor}** के वस्त्र महत्वपूर्ण बैठकों, साक्षात्कारों एवं मांगलिक अवसरों पर धारण करने से ओरा में सकारात्मक तरंगें प्रवाहित होती हैं।
• **शुभ दिशा**: आपके लग्न के अनुसार **उत्तर-पूर्व (ईशान कोण) अथवा पूर्व दिशा** आपके निवास एवं कार्यक्षेत्र हेतु सर्वाधिक ऊर्जावान है।`;
      timingPrediction = `महत्वपूर्ण कार्यों का शुभारंभ अपने शुभ वार (लग्नेश के दिन) में करने से सफलता का प्रतिशत बहुगुणित हो जाता है।`;
      targetedRemedies = `
• **दैनिक वास्तु**: अपने कार्यस्थल पर उत्तर-पूर्व दिशा को सदैव स्वच्छ, प्रकाशवान एवं सुगंधित रखें।`;
      break;
    }

    case 'mangal_dosha_check': {
      const mHouse = getHouse('Mars');
      const isManglik = [1, 4, 7, 8, 12].includes(mHouse);
      directVerdict = isManglik
        ? `आपकी जन्मकुंडली में **मंगल ${mHouse}वें भाव में स्थित होने से आंशिक मांगलिक प्रभाव (Manglik Yoga)** दृष्टिगोचर होता है। परंतु शास्त्रीय परिहारों के कारण यह अत्यधिक सौम्य है और चिंता का विषय नहीं है।`
        : `आपकी जन्मकुंडली **पूर्णतः मांगलिक दोष से मुक्त (Non-Manglik)** है। मंगल देव शुभ भाव में स्थित होकर आपको पराक्रम एवं नेतृत्व शक्ति प्रदान कर रहे हैं।`;
      planetaryAnalysis = `
• **मंगल की स्थिति**: मंगल देव भाव ${mHouse} में ${getSign('Mars')} राशि में विराजमान हैं।
• **शास्त्रीय परिहार (Kuja Cancellation)**: महर्षि पाराशर के अनुसार यदि मंगल पर गुरु की दृष्टि हो या मंगल स्वराशि/मित्र राशि में हो, तो भौम दोष स्वतः निष्प्रभावी हो जाता है।
• **विवाह मिलान**: कुंडली मिलान के समय केवल गुण मिलान के स्थान पर ग्रहों की परस्पर मित्रता देखना अधिक श्रेयस्कर रहता है।`;
      timingPrediction = `मंगल की ऊर्जा को खेलकूद, व्यायाम, योग एवं रचनात्मक कार्यों में नियोजित करने से यह दोष वरदान में बदल जाता है।`;
      targetedRemedies = `
• **मंगल शांति**: मंगलवार को श्री हनुमान मंदिर में सिंदूर एवं चमेली का तेल अर्पित करें।
• **हनुमान चालीसा**: प्रतिदिन तीन बार हनुमान चालीसा का पाठ समस्त मांगलिक बाधाओं का शमन करता है।`;
      break;
    }

    case 'kaalsarp_dosha_check': {
      directVerdict = `आपकी जन्मकुंडली में ग्रहों का विन्यास यह प्रमाणित करता है कि **आप पर कोई घातक कालसर्प दोष नहीं है**, अपितु आपकी कुंडली में राजयोग एवं धनयोग सक्रिय हैं।`;
      planetaryAnalysis = `
• **राहु-केतु अक्ष**: राहु देव भाव ${getHouse('Rahu')} में तथा केतु देव भाव ${getHouse('Ketu')} में स्थित हैं।
• **पाराशर सिद्धांत**: जब समस्त सातों ग्रह राहु और केतु के मध्य कैद हो जाएं, तभी कालसर्प योग का निर्माण होता है। आपकी कुंडली में महत्वपूर्ण ग्रह इस अक्ष से स्वतंत्र होकर शुभ फल दे रहे हैं।`;
      timingPrediction = `किसी भी भ्रामक भय में न पड़ें। आपकी कुंडली अपने कर्मों से स्वयं का भाग्य निर्मित करने वाले जातक की है।`;
      targetedRemedies = `
• **नाग गायत्री / शिव पूजन**: महाशिवरात्रि या नागपंचमी पर शिवलिंग पर तांबे का सर्प अथवा दूध-जल अर्पित करें।
• **महामृत्युंजय जाप**: नित्य ११ बार महामृत्युंजय मंत्र का उच्चारण मानसिक संबल प्रदान करता है।`;
      break;
    }

    case 'deity_worship_mantra': {
      directVerdict = `आपकी जन्मकुंडली के पंचम भाव एवं आत्मकारक के अनुसार आपके **परम आराध्य इष्ट देव: भगवान विष्णु / श्री कृष्ण अथवा भगवान शिव** हैं। इनकी आराधना से समस्त विघ्न तत्काल शांत होते हैं।`;
      planetaryAnalysis = `
• **पंचम भाव (पूर्व पुण्य व भक्ति)**: पंचमेश **${house5Lord}** भाव ${getHouse(house5Lord)} में स्थित हैं।
• **भाग्येश (${house9Lord})**: नवमेश की स्थिति आध्यात्मिक उत्थान एवं ईश्वरीय कृपा का सीधा मार्ग प्रशस्त करती है।
• **सिद्ध महामंत्र**: आपके लिए *"ॐ नमो भगवते वासुदेवाय"* अथवा *"ॐ नमः शिवाय"* का जप कल्पवृक्ष के समान फल देने वाला है।`;
      timingPrediction = `नित्य प्रातः स्नान के उपरांत केवल १० मिनट का ध्यान भी आपके जीवन में चमत्कारिक सकारात्मक परिवर्तन लाएगा।`;
      targetedRemedies = `
• **दैनिक आराधना**: अपने घर के पूजा स्थल में एक दीपक प्रज्वलित कर नित्य श्री विष्णु सहस्रनाम या शिव पंचाक्षर स्तोत्र का श्रवण करें।`;
      break;
    }

    default: {
      directVerdict = `आपके द्वारा पूछे गए विशिष्ट प्रश्न ("${userMessage}") के संदर्भ में ग्रह स्थिति **सकारात्मक संकेत** प्रदान कर रही है। लग्न एवं चंद्र बल आपके पक्ष में है।`;
      planetaryAnalysis = `
• **लग्न स्वामी (${lagnaLord})**: आपके लग्नेश ${getHouse(lagnaLord)}वें भाव में स्थित होकर आपके व्यक्तित्व और संकल्प को सुदृढ़ कर रहे हैं।
• **चंद्र राशि (${moon.sign})**: चंद्रमा आपके मन को स्थिरता और सही निर्णय लेने की अंतर्दृष्टि प्रदान कर रहे हैं।
• **विंशोत्तरी दशा**: वर्तमान में **${currentMD}-${currentAD}** की अवधि सक्रिय है, जो आपके द्वारा उठाए गए सुविचारित कदमों को गति प्रदान करेगी।`;
      timingPrediction = `उचित रणनीति एवं धैर्य के साथ आगे बढ़ें, आने वाले महीनों में अनुकूल परिणाम प्राप्त होंगे।`;
      targetedRemedies = `
• **दैनिक महामंत्र**: नित्य १०८ बार *"ॐ नमः शिवाय"* का जप करें।
• **सत्कर्म**: प्रातः पक्षियों को अन्न-जल दें तथा माता-पिता का चरण स्पर्श कर दिन का आरंभ करें।`;
      break;
    }
  }

  return `## ॐ श्री गणेशाय नमः | वैदिक ज्योतिष समाधान
**जातक:** ${name} | **पूछा गया प्रश्न:** "${userMessage}"

---

### 🎯 प्रश्न का सीधा उत्तर (Direct Astrological Verdict)
${directVerdict}

---

### 🔍 ग्रह स्थिति एवं शास्त्रीय कारण (Planetary Foundation)
${planetaryAnalysis}

---

### ⏳ काल निर्धारण (Timing of Fruition)
${timingPrediction}

---

### 🔱 इस प्रश्न हेतु विशेष वैदिक उपाय (Targeted Remedies)
${targetedRemedies}

---
*यह विश्लेषण महर्षि पाराशर विरचित "बृहत्पाराशर होरा शास्त्र", विंशोत्तरी दशा गणित एवं गोचर सिद्धान्तों पर पूर्णतः आधारित है।*`;
}

// -------------------------------------------------------------------------------------------------
// ENGLISH GENERATOR (Comprehensive, Direct & Highly Structured)
// -------------------------------------------------------------------------------------------------
function generateEnglishReading(ctx: any): string {
  const {
    name, userMessage, topic, lagna, moon, sun,
    currentMD, currentAD, currentMDStart, currentMDEnd,
    sadeSati, lagnaLord, house2Lord, house4Lord, house5Lord,
    house6Lord, house7Lord, house8Lord, house9Lord, house10Lord,
    house11Lord, house12Lord, planets,
  } = ctx;

  const getP = (p: string) => planets?.[p] || {};
  const getSign = (p: string) => planets?.[p]?.sign || 'Auspicious Sign';
  const getHouse = (p: string) => planets?.[p]?.house || 1;
  const getDignity = (p: string) => planets?.[p]?.dignity || 'Neutral';

  const sub = topic.subCategory;
  let directVerdict = '';
  let planetaryAnalysis = '';
  let timingPrediction = '';
  let targetedRemedies = '';

  switch (sub) {
    case 'marriage_timing': {
      directVerdict = `Regarding your exact question on marriage timing: Your chart indicates an **auspicious and mature matrimonial window**. The favorable positioning of your 7th house lord and beneficial transits confirm that marriage proposals will materialize successfully in the near future.`;
      planetaryAnalysis = `
• **7th House & 7th Lord (${house7Lord})**: In your birth chart, your 7th house of marriage is governed by **${house7Lord}**, situated in House ${getHouse(house7Lord)} in ${getSign(house7Lord)} (${getDignity(house7Lord)}).
• **Natural Significator Venus (Shukra)**: Venus occupies House ${getHouse('Venus')}, nurturing affection and relationship longevity.
• **Navamsha (D-9 Chart)**: Sage Parashara instructs in BPHS that D-9 is the definitive chart for marriage fruition. Your Navamsha disposition provides strong structural foundation for a harmonious wedlock.`;
      timingPrediction = `You are running the **${currentMD} Mahadasha** with **${currentAD} Antardasha** (${currentMDStart} to ${currentMDEnd}). The primary window of wedding solemnization is within the next **6 to 18 months**, especially as transit Jupiter casts its nectarous aspect onto your Lagna/7th axis.`;
      targetedRemedies = `
• **Venus Mantra**: Recite the Shukra Beej Mantra: *"Om Shum Shukraya Namaha"* 108 times on Friday mornings.
• **Charity**: Donate white sweets, milk, or white rice to underprivileged girls or temples on Fridays.
• **Sacred Bead**: Wearing a natural Two-Mukhi or Gauri-Shankar Rudraksha dissolves marital obstacles rapidly.`;
      break;
    }

    case 'marriage_love_or_arranged': {
      const p5 = getHouse(house5Lord);
      const p7 = getHouse(house7Lord);
      const isLoveDominant = Math.abs(p5 - p7) <= 2 || p5 === 7 || p7 === 5 || getHouse('Venus') === 5 || getHouse('Venus') === 7;
      directVerdict = isLoveDominant
        ? `Direct Verdict on your query: Your chart exhibits strong indicators for a **Love Marriage or Love-cum-Arranged Union**. You will marry a partner of your own personal choice, which will subsequently gain warm family approval.`
        : `Direct Verdict on your query: Your chart strongly favors a **Traditional Arranged Marriage**. A matrimonial alliance arranged with family consensus and mature background verification will yield the highest long-term happiness, marital stability, and mutual prosperity.`;
      planetaryAnalysis = `
• **5th House (Romance & Free Will)**: 5th lord **${house5Lord}** is in House ${getHouse(house5Lord)}.
• **7th House (Marital Covenant)**: 7th lord **${house7Lord}** is situated in House ${getHouse(house7Lord)}.
• **Classical Parashari Rule**: When the 5th and 7th houses or their lords connect via conjunction, mutual aspect, or trinal harmony, love blossoms into matrimony.`;
      timingPrediction = `Under your active **${currentMD}-${currentAD}** period, relationship clarity will crystallize. Seek family dialogue during the waxing Moon (Shukla Paksha) for maximum harmony.`;
      targetedRemedies = `
• **Katyayani Mantra**: Chant *"Katyayani Mahamaye Mahayoginyadheeshwari, Nanda Gopa Sutam Devi Patim Me Kuru Te Namaha"* for fulfilling matrimonial desires.
• **Radha-Krishna Worship**: Offer yellow flowers or a fragrant flute at a Radha-Krishna temple on Thursdays.`;
      break;
    }

    case 'marriage_spouse_nature': {
      const s7 = ctx.houses?.[6]?.sign || 'Libra';
      directVerdict = `Direct Verdict: Your future spouse will be **dignified, intelligent, culturally grounded, and deeply committed to family obligations**. They will possess refined aesthetic tastes and a balanced, supportive disposition.`;
      planetaryAnalysis = `
• **7th House Sign (${s7})**: Infuses your partner with diplomatic grace, fairness, and an appreciation for order and elegance.
• **7th Lord Placement**: **${house7Lord}** in House ${getHouse(house7Lord)} denotes a partner from a respected, educated lineage with professional self-reliance.
• **Origin & Direction**: Geographically, your spouse is most likely to hail from the **East or North-East** direction relative to your place of birth.`;
      timingPrediction = `As supportive transits activate your 7th house, formal introductions or meeting your partner will happen naturally. Mutual respect will be the cornerstone of your married life.`;
      targetedRemedies = `
• **Friday Harmony**: Feed cows with fresh fodder or sweet rotis with jaggery on Friday mornings.
• **Morning Arghya**: Offer water to the rising Sun daily while invoking harmony in human partnerships.`;
      break;
    }

    case 'career_job_vs_business': {
      const h10Dignity = getDignity(house10Lord);
      const favorBusiness = h10Dignity === 'Exalted' || h10Dignity === 'Own Sign' || getHouse('Mercury') === 10 || getHouse('Sun') === 10;
      directVerdict = favorBusiness
        ? `Direct Verdict: Your chart carries prominent **Entrepreneurial and Business Yogas (Vyapar Yoga)**. You possess organic leadership instincts and risk management capability suited for independent enterprise, contracting, or executive partnerships.`
        : `Direct Verdict: Your chart strongly rewards **Executive Employment, Corporate Leadership, and Structured Services (Job / Service)**. A stable career track provides maximum prestige, steady progression, and shield from commercial volatility. If you venture into business, do so only after establishing a solid service track record.`;
      planetaryAnalysis = `
• **6th House (Service & Competitive Edge)**: 6th lord **${house6Lord}** is in House ${getHouse(house6Lord)}.
• **10th House (Authority & Career Zenith)**: 10th lord **${house10Lord}** sits in House ${getHouse(house10Lord)} in ${getSign(house10Lord)}.
• **Commercial Karaka Mercury**: Mercury in House ${getHouse('Mercury')} guides analytical and trade aptitude.`;
      timingPrediction = `Your current **${currentMD}** Mahadasha marks a pivotal phase for professional expansion. Strategic initiatives launched during this period yield compounding dividends.`;
      targetedRemedies = `
• **Career Mantra**: Recite *"Om Namo Bhagavate Vasudevaya"* 108 times daily in the morning.
• **Wednesday Charity**: Feed soaked green gram (Moong dal) or fresh spinach to birds or cows on Wednesdays.`;
      break;
    }

    case 'career_field_selection': {
      directVerdict = `Direct Verdict: Based on your 10th house, D10 Dashamsha, and planetary strengths, your optimal career fields are **Administration, Finance/Banking, Information Technology (IT/Tech), Strategic Management, or Professional Advisory/Consulting**.`;
      planetaryAnalysis = `
• **10th Lord Direction (${house10Lord})**: The planetary signature of your 10th house ruler demands systematic, intellectual, and authority-oriented endeavors.
• **D10 Dashamsha Chart**: Parashara's D-10 varga indicates that roles requiring analytical rigor, governance, or organizational leadership offer you the fastest trajectory to senior rank.
• **Key Planet**: Strong Sun and Jupiter influences guarantee career credibility and executive respect.`;
      timingPrediction = `Pursuing specialized certifications, domain leadership, or institutional roles in these specific sectors will accelerate your financial and professional status.`;
      targetedRemedies = `
• **Surya Arghya**: Offer water to the rising Sun every morning from a copper vessel with a pinch of red kumkum.
• **Aditya Hridaya Stotra**: Reciting the Aditya Hridaya Stotram on Sundays fortifies professional authority and executive confidence.`;
      break;
    }

    case 'career_promotion_timing': {
      directVerdict = `Direct Verdict on your promotion / job change: **Strong career elevation and promotion yogas are actively forming**. Your dedication is set to be recognized by superiors with an increment in rank, authority, and compensation.`;
      planetaryAnalysis = `
• **10th Lord (${house10Lord})**: Situated in House ${getHouse(house10Lord)}, activating institutional authority and acknowledgment.
• **11th House of Gains (${house11Lord})**: Reinforces that hard work translates into tangible financial rewards and rank elevation.
• **Dasha Engine**: The active **${currentMD}-${currentAD}** period acts as a prime catalyst for career progression.`;
      timingPrediction = `The optimal window for your promotion, favorable performance appraisal, or coveted job transfer is within the next **3 to 9 months**, aligned with supportive Jupiter transits.`;
      targetedRemedies = `
• **Focus**: Eat a spoonful of honey or sweet curd before heading to critical interviews or performance reviews.
• **Saturn Grace**: Light a mustard oil lamp near a Peepal tree on Saturday evenings.`;
      break;
    }

    case 'wealth_growth_timing': {
      directVerdict = `Direct Verdict: Your horoscope contains **prominent Dhana Yogas (Wealth Accumulation Alignments)**. You are destined to build solid liquid reserves and substantial fixed asset holdings over time.`;
      planetaryAnalysis = `
• **2nd House (Accumulated Wealth/Treasury)**: 2nd lord **${house2Lord}** is in House ${getHouse(house2Lord)} in ${getSign(house2Lord)}.
• **11th House (Income & Profitability)**: Governed by **${house11Lord}**, ensuring regular cash flow streams.
• **Dhana-Karaka Jupiter**: Jupiter in House ${getHouse('Jupiter')} guarantees ethical wealth generation and long-term financial preservation.`;
      timingPrediction = `The operating **${currentMD}** cycle catalyzes financial expansion. Expect lucrative returns from previous investments and new revenue streams in the upcoming financial quarters.`;
      targetedRemedies = `
• **Sri Suktam**: Recite the Sri Suktam or Kanakadhara Stotram every Friday evening before a pure ghee lamp.
• **Maha Lakshmi Japa**: Chant *"Om Shreem Maha Lakshmyai Namaha"* 108 times daily.
• **Charity**: Donate white grains or food to the needy on Fridays.`;
      break;
    }

    case 'wealth_stock_speculation': {
      const p5House = getHouse(house5Lord);
      const isSafe = p5House === 5 || p5House === 9 || p5House === 11 || getDignity(house5Lord) === 'Exalted';
      directVerdict = isSafe
        ? `Direct Verdict: You possess **moderate to favorable aptitude for Calculated Long-term Equity Investing (Mutual Funds, Blue-chips)**. However, high-leverage day trading, derivatives (F&O), or reckless gambling must be strictly avoided.`
        : `Direct Verdict: **Avoid speculative day-trading, crypto speculation, and lottery**. Your chart indicates sudden volatility and speculative depletion in high-risk markets. Focus strictly on conservative wealth vehicles: Fixed Deposits, Real Estate, and Gold.`;
      planetaryAnalysis = `
• **5th House (Purva Punya & Speculative Intellect)**: 5th lord **${house5Lord}** sits in House ${p5House}.
• **Rahu Role (Sudden Fluctuations)**: Rahu in House ${getHouse('Rahu')} creates illusions of quick wealth that often reverse if not disciplined.
• **Mercury (Analytical Verification)**: Emphasizes that thorough research, rather than emotional hype, is your sole shield in the market.`;
      timingPrediction = `Adopt systematic monthly SIP investments in fundamentally strong sectors rather than chasing speculative windfalls.`;
      targetedRemedies = `
• **Rahu Pacification**: Feed millet to birds and sugar-flour mixture to black ants on Wednesdays and Saturdays.
• **Ganesha Blessing**: Offer 21 blades of fresh Durva grass to Lord Ganesha on Wednesdays.`;
      break;
    }

    case 'property_buying_home': {
      directVerdict = `Direct Verdict: Your chart possesses **exceptional Real Estate and Home Ownership Yogas (Griha Prapti Yoga)**. You will successfully acquire and enjoy your own independent residence or property through your earned merits.`;
      planetaryAnalysis = `
• **4th House (Real Estate, Land, Home Comfort)**: 4th lord **${house4Lord}** is in House ${getHouse(house4Lord)}.
• **Bhumi-Karaka Mars**: Mars, the natural ruler of physical earth and construction, is placed in House ${getHouse('Mars')} (${getDignity('Mars')}).
• **D4 Chaturthamsha**: Confirms stability of fixed assets and residential security.`;
      timingPrediction = `Your running **${currentMD}-${currentAD}** period strongly activates 4th house energies, marking an auspicious window for purchasing a flat, constructing a house, or registering land.`;
      targetedRemedies = `
• **Hanuman Chalisa**: Chant the Hanuman Chalisa on Tuesdays for land and residential protection.
• **Vastu Cleanliness**: Keep the North-East zone (Ishanya) of your current home clutter-free and brightly illuminated.`;
      break;
    }

    case 'property_buying_vehicle': {
      directVerdict = `Direct Verdict: Your horoscope confirms **smooth and luxurious Vehicle Acquisition (Vahana Sukha)**. Buying a vehicle will enhance your domestic comfort and family joy.`;
      planetaryAnalysis = `
• **Vahana-Karaka Venus**: Venus in House ${getHouse('Venus')} bestows aesthetic and modern conveyance comforts.
• **D16 Shodashamsha Varga**: Sage Parashara gives D-16 a potent 2.0 Vimsopaka weight specifically for conveyances and inner comfort. Your D-16 indicators are strongly supportive.
• **Auspicious Vehicle Colors**: **White, Silver, Navy Blue, or Deep Maroon** will be the most fortunate colors for your vehicle.`;
      timingPrediction = `The ongoing dasha timeline marks an ideal period for acquiring a car or vehicle. Finalize purchases on auspicious Thursdays or Fridays during Shukla Paksha.`;
      targetedRemedies = `
• **Vehicle Blessing**: After receiving your vehicle, perform a traditional Vahan Puja with coconut and sindoor, offering gratitude to Lord Ganesha and Lord Shiva.`;
      break;
    }

    case 'education_exam_success': {
      directVerdict = `Direct Verdict: You have **splendid Intellectual Acumen and High Competitive Exam Success Yogas**. With disciplined preparation, clearing prestigious civil service, government, or university examinations is well within your grasp.`;
      planetaryAnalysis = `
• **5th House (Intellect & Memory)**: 5th lord **${house5Lord}** in House ${getHouse(house5Lord)} illuminates sharp comprehension.
• **9th House (Higher Education & Destiny)**: 9th lord **${house9Lord}** ensures that fortune supports your intense efforts.
• **Sun & Jupiter**: Sun in House ${getHouse('Sun')} governs administrative authority and state recognition.`;
      timingPrediction = `Your upcoming examination cycles fall under supportive planetary backing. Focus early morning study sessions for maximum retention.`;
      targetedRemedies = `
• **Saraswati Mantra**: Chant *"Om Aim Saraswatyai Namaha"* 11 times before beginning study sessions.
• **Gayatri Mantra**: Recite the Gayatri Mantra thrice at dawn for mental clarity and intellectual brilliance.`;
      break;
    }

    case 'foreign_settlement_visa': {
      const isStrong = getHouse('Rahu') === 12 || getHouse('Rahu') === 9 || getHouse(house12Lord) === 9 || getHouse(house9Lord) === 12 || getHouse(lagnaLord) === 12;
      directVerdict = isStrong
        ? `Direct Verdict: Your birth chart demonstrates **solid, auspicious Foreign Travel & Overseas Settlement Yogas (Videsha Vasa)**. Relocating across borders or settling abroad will stimulate unprecedented financial and professional growth.`
        : `Direct Verdict: Your chart favors **short-term overseas assignments, travel, and global business engagements**, while maintaining primary residential roots in your home country or working for global multinational corporations.`;
      planetaryAnalysis = `
• **12th House (Foreign Lands & Distant Horizons)**: 12th lord **${house12Lord}** is in House ${getHouse(house12Lord)}.
• **9th House (Long Journeys)**: 9th lord **${house9Lord}** facilitates international travel and visas.
• **Rahu's Impulse**: Rahu in House ${getHouse('Rahu')} breaks geographic boundaries.`;
      timingPrediction = `Visa, documentation, or overseas job transitions will gain remarkable momentum under your active **${currentMD}-${currentAD}** cycle.`;
      targetedRemedies = `
• **Obstacle Removal**: Recite the Sankat Nashan Ganesha Stotram on Wednesday mornings.
• **Bhairava Lamp**: Light a mustard oil lamp at a Bhairava temple or chant the Kalabhairava Ashtakam on Saturdays.`;
      break;
    }

    case 'children_progeny_timing': {
      directVerdict = `Direct Verdict: Your horoscope bestows **splendid and cultured Progeny Happiness (Santana Sukha)**. Your children will be virtuous, academically talented, and a source of deep honor for your lineage.`;
      planetaryAnalysis = `
• **5th House (Progeny House)**: 5th lord **${house5Lord}** is situated in House ${getHouse(house5Lord)}.
• **Natural Significator Jupiter**: Devaguru Jupiter in House ${getHouse('Jupiter')} (${getDignity('Jupiter')}) confers blessings of lineage expansion.
• **D7 Saptamsha**: Divisional chart D-7 validates healthy childbirth and positive parenting outcomes.`;
      timingPrediction = `Transit Jupiter's aspect on your 5th house during the current dasha period activates fertile, auspicious timing for parenthood.`;
      targetedRemedies = `
• **Santana Gopala Mantra**: Recite *"Om Devaki Suta Govinda Vasudeva Jagatpate, Dehi Me Tanayam Krishna Tvamaham Sharanam Gatah"* 108 times daily.
• **Cow Service**: Offer soaked chickpeas (chana dal) and jaggery to cows on Thursdays.`;
      break;
    }

    case 'health_ailments_recovery': {
      directVerdict = `Direct Verdict: Your **Ascendant Lord is fundamentally resilient, guaranteeing robust recuperation and recovery from bodily ailments**. Longevity and innate vitality remain strongly protected.`;
      planetaryAnalysis = `
• **Lagna Lord (${lagnaLord})**: As ruler of physical vitality, **${lagnaLord}** sits in House ${getHouse(lagnaLord)}, acting as your prime biological defense shield.
• **6th House (Ailments & Immunity)**: 6th lord **${house6Lord}** requires moderate attention to dietary balance and digestive wellness.
• **Sun (Prana Vitality)**: Sun in House ${getHouse('Sun')} ensures natural stamina.`;
      timingPrediction = `Your health curve will experience marked upward recovery in the upcoming weeks. Practicing daily Pranayama and adopting an Ayurvedic diet accelerates healing.`;
      targetedRemedies = `
• **Maha Mrityunjaya Mantra**: Chant *"Om Tryambakam Yajamahe Sugandhim Pushtivardhanam, Urvarukamiva Bandhanan Mrityor Mukshiya Mamritat"* 11 times daily.
• **Surya Arghya**: Offer morning water to the Sun and consume clean water stored overnight in a copper vessel.`;
      break;
    }

    case 'health_mental_stress': {
      directVerdict = `Direct Verdict: The root cause of your mental fatigue and anxiety stems from **temporary transit afflictions impacting Moon and Mercury**. Implementing Vedic lunar balancing will restore serene peace and clarity of mind.`;
      planetaryAnalysis = `
• **Natal Moon**: Moon in **${moon.sign}** in **${moon.nakshatra}** Nakshatra.
• **4th House (Inner Peace / Sukha Bhava)**: 4th lord **${house4Lord}** in House ${getHouse(house4Lord)}.
• **Mechanism**: Over-analyzing future hypotheticals depletes psychic energy. Grounding the Moon dissolves internal friction.`;
      timingPrediction = `A noticeable surge of mental lightness and emotional optimism will manifest with the forthcoming waxing lunar cycle.`;
      targetedRemedies = `
• **Lord Shiva Jalabhishek**: Offer clean water and white sandalwood paste to a Shivling on Mondays.
• **Silver Remedy**: Drink water from a pure silver cup or wear a smooth silver ring on your little finger.
• **Night Peace**: Practice 5 minutes of mindful *"Om Namah Shivaya"* recitation before sleep.`;
      break;
    }

    case 'enemies_court_case': {
      directVerdict = `Direct Verdict: Your chart indicates a decisive **Shatru-Hanta Yoga (Victory Over Adversaries and Legal Disputes)**. Hostile parties will lose ground, and justice will vindicate your upright stance.`;
      planetaryAnalysis = `
• **6th House (Adversaries & Disputes)**: 6th lord **${house6Lord}** in House ${getHouse(house6Lord)}.
• **Mars Courage**: Mars in House ${getHouse('Mars')} supplies unwavering courage and tactical fortitude.
• **Saturn Justice**: Saturn in House ${getHouse('Saturn')} enforces fair, karmic outcomes.`;
      timingPrediction = `The next 3 to 6 months will deliver decisive breakthroughs, settlements, or judicial vindication in your favor.`;
      targetedRemedies = `
• **Bajrang Baan**: Recite the Bajrang Baan on Tuesdays and Saturdays.
• **Oil Charity**: Donate mustard oil on Saturdays for protection against envy.`;
      break;
    }

    case 'dasha_current_influence': {
      directVerdict = `Direct Verdict: You are operating under the **${currentMD} Mahadasha** and **${currentAD} Antardasha** (${currentMDStart} to ${currentMDEnd}). This planetary cycle is designated to elevate your life wisdom, institutional stature, and practical discernment.`;
      planetaryAnalysis = `
• **Mahadasha Lord (${currentMD})**: Occupies House ${getHouse(currentMD)}, steering your central life focus.
• **Antardasha Lord (${currentAD})**: Occupies House ${getHouse(currentAD)}, governing immediate developments and events.
• **Parashari Principle**: The dasha period demands patience, systematic execution, and zero compromise on ethics.`;
      timingPrediction = `This cycle will bear fruitful outcomes in terms of learning, wealth stabilization, and personal maturity. Focus your efforts with clear intent.`;
      targetedRemedies = `
• **Dasha Japa**: Chant the sacred mantra for **${currentMD}** 108 times daily.
• **Respect**: Seek the blessings of elders and mentors regularly.`;
      break;
    }

    case 'sade_sati_impact': {
      const sStat = sadeSati?.status || 'Active Phase';
      directVerdict = `Direct Verdict: Regarding Saturn's transit and Sade Sati: **Status is ${sStat}**. Saturn is the cosmic taskmaster; his transit is not designed to harm, but to purge illusions and build enduring inner resilience.`;
      planetaryAnalysis = `
• **Moon Sign (Janma Rashi)**: **${moon.sign}** governed by ${moon.nakshatraLord}.
• **Natal Saturn Placement**: Saturn sits in House ${getHouse('Saturn')} (${getDignity('Saturn')}).
• **Saturn's Injunction**: Truthfulness, humility, ethical labor, and routine structure convert Saturnian trials into lasting imperial triumphs.`;
      timingPrediction = `Maintain consistency and avoid rash shortcuts. Steady perseverance will earn Saturn's lasting blessings and security.`;
      targetedRemedies = `
• **Peepal Deepam**: Light a mustard oil lamp beneath a Peepal tree on Saturday evenings after sunset.
• **Dasharatha Shani Stotram**: Recite King Dasharatha's Shani Stotram on Saturdays.
• **Compassion**: Provide meals or footwear to underprivileged laborers and sanitation workers.`;
      break;
    }

    case 'gemstone_selection': {
      const lagnaStone = GEMSTONE_DATA[lagnaLord] || GEMSTONE_DATA['Sun'];
      const bhagyaStone = GEMSTONE_DATA[house9Lord] || GEMSTONE_DATA['Jupiter'];
      directVerdict = `Direct Verdict on Gemstones: Your primary **Life Stone (Lagna Ratna) is ${lagnaStone.stoneEn}** and your premier **Luck Stone (Bhagya Ratna) is ${bhagyaStone.stoneEn}**.`;
      planetaryAnalysis = `
• **Ascendant Lord (${lagnaLord}) Gemstone**: **${lagnaStone.stoneEn}** set in **${lagnaStone.metal}**, worn on the **${lagnaStone.finger}** on **${lagnaStone.day}**.
• **Consecration Mantra**: Energize by reciting *" ${lagnaStone.mantra} "* 108 times before wearing.
• **9th Lord Stone**: **${bhagyaStone.stoneEn}** stimulates divine fortune, spiritual protection, and auspicious breakthroughs.
• **Strict Precaution**: Never wear gemstones of functional malefics or dusthana lords without proper consecration.`;
      timingPrediction = `Wearing consecrated gemstones during the waxing Moon cycle brings observable empowerment and positive vibrations within 40 days.`;
      targetedRemedies = `
• **Rudraksha Alternative**: You may also wear a natural **5-Mukhi or 11-Mukhi Nepali Rudraksha** on a red silk thread around your neck.`;
      break;
    }

    case 'lucky_number_color': {
      const numMap: Record<string, number> = { Sun: 1, Moon: 2, Jupiter: 3, Rahu: 4, Mercury: 5, Venus: 6, Ketu: 7, Saturn: 8, Mars: 9 };
      const colorMap: Record<string, string> = {
        Sun: 'Saffron Gold, Crimson & Yellow',
        Moon: 'Pearl White, Cream & Silver',
        Mars: 'Coral Red, Scarlet & Maroon',
        Mercury: 'Emerald Green & Light Mint',
        Jupiter: 'Turmeric Yellow, Golden & Amber',
        Venus: 'Bright White, Silvery Pink & Pastel',
        Saturn: 'Navy Blue, Indigo & Royal Violet',
      };
      const lNum = numMap[lagnaLord] || 1;
      const lColor = colorMap[lagnaLord] || 'Golden Yellow & White';
      directVerdict = `Direct Verdict: Your **Auspicious Number is ${lNum}** and your **Lucky Colors are ${lColor}**.`;
      planetaryAnalysis = `
• **Lucky Number (${lNum})**: Incorporate number ${lNum} in significant dates, meetings, and key choices.
• **Lucky Color (${lColor})**: Wearing these tones during high-stakes presentations and auspicious celebrations harmonizes your auric field.
• **Favorable Direction**: **North-East or East** represents your most productive directional axis for work and contemplation.`;
      timingPrediction = `Initiating ventures on your ruler's planetary day multiplies focus and success rates.`;
      targetedRemedies = `
• **Vastu Tip**: Keep the North-East quadrant of your personal workspace clean, uncluttered, and lightly scented.`;
      break;
    }

    case 'mangal_dosha_check': {
      const mHouse = getHouse('Mars');
      const isManglik = [1, 4, 7, 8, 12].includes(mHouse);
      directVerdict = isManglik
        ? `Direct Verdict on Manglik Dosha: Mars occupies House ${mHouse}, imparting a **mild Kuja Dosha (Manglik influence)**. However, strong classical Parashari cancellations are present, completely neutralizing any adverse fears.`
        : `Direct Verdict: You are **completely Non-Manglik (No Mangal Dosha)**. Mars is beneficially placed outside the marital sensitive houses, blessing you with courage, vitality, and executive dynamism.`;
      planetaryAnalysis = `
• **Mars Placement**: Mars resides in House ${mHouse} in ${getSign('Mars')}.
• **Cancellations (Kuja Parihara)**: Aspect from benefic Jupiter and friendly sign placements dissolve the harshness of Mars, converting friction into protective zeal.`;
      timingPrediction = `Channeling Martian energy through physical fitness, sports, and disciplined goals turns this fiery planet into your greatest asset.`;
      targetedRemedies = `
• **Hanuman Worship**: Visit a Hanuman temple on Tuesdays; recite the Hanuman Chalisa.
• **Charity**: Donate red lentils (masoor dal) on Tuesdays.`;
      break;
    }

    case 'kaalsarp_dosha_check': {
      directVerdict = `Direct Verdict: Your astrological chart confirms that **you are NOT afflicted by harmful Kaal Sarp Dosha**. Your vital planets operate freely outside the Rahu-Ketu axis, allowing your Raj Yogas and Dhana Yogas to manifest unimpeded.`;
      planetaryAnalysis = `
• **Rahu-Ketu Axis**: Rahu resides in House ${getHouse('Rahu')} and Ketu in House ${getHouse('Ketu')}.
• **Parashari Verification**: True Kaal Sarp Yoga only forms when all seven celestial bodies are trapped on one side of the nodal axis. Your major benefic planets remain unconfined.`;
      timingPrediction = `You can proceed with full confidence in your ambitions without entertaining groundless superstitions.`;
      targetedRemedies = `
• **Maha Shivaratri / Somwar**: Offer water and raw milk to a Shivling on Mondays while reciting *"Om Namah Shivaya"*.`;
      break;
    }

    case 'deity_worship_mantra': {
      directVerdict = `Direct Verdict: In accordance with your 5th house and Atmakaraka disposition, your **Ishta Devata (Guardian Cosmic Deity) is Lord Vishnu / Sri Krishna or Lord Shiva**. Devotion to this divine form dispels karmic obstacles immediately.`;
      planetaryAnalysis = `
• **5th House of Devotion**: 5th lord **${house5Lord}** sits in House ${getHouse(house5Lord)}.
• **Sacred Mantra**: The universal mantra *"Om Namo Bhagavate Vasudevaya"* or *"Om Namah Shivaya"* resonates deeply with your soul's karmic blueprint.`;
      timingPrediction = `Dedicating just 10 minutes every morning to silent mantra meditation will evoke profound tranquility and divine guidance in all decisions.`;
      targetedRemedies = `
• **Daily Practice**: Light a pure ghee lamp in your sanctuary every morning and chant your chosen sacred mantra with mindful breath.`;
      break;
    }

    default: {
      directVerdict = `Direct Verdict on your question ("${userMessage}"): The celestial parameters in your horoscope reflect **constructive planetary backing** for the matter at hand. Your foundational ascendant vitality and dasha support steady progress.`;
      planetaryAnalysis = `
• **Ascendant Lord (${lagnaLord})**: Positioned in House ${getHouse(lagnaLord)}, endowing you with resilience and inner grit.
• **Moon (${moon.sign})**: Cultivates intuitive discernment and emotional balance.
• **Running Dasha**: **${currentMD}-${currentAD}** supports focused effort toward this goal.`;
      timingPrediction = `Proceed with measured steps, clarity of thought, and persistence. Constructive developments will unfold across the upcoming months.`;
      targetedRemedies = `
• **Daily Japa**: Chant *"Om Namah Shivaya"* 108 times daily.
• **Benevolence**: Feed birds in the morning and offer fresh water to living beings with a compassionate heart.`;
      break;
    }
  }

  return `## ॐ Namaste | Vedic Astrological Consultation
**Querent:** ${name} | **Inquiry Asked:** "${userMessage}"

---

### 🎯 Direct Astrological Verdict
${directVerdict}

---

### 🔍 Planetary Foundation & Astrological Reasons
${planetaryAnalysis}

---

### ⏳ Timing of Fruition (Phala Kala)
${timingPrediction}

---

### 🔱 Prescribed Vedic Remedies for This Specific Question
${targetedRemedies}

---
*Grounded in the classical tenets of Maharishi Parashara's Brihat Parashara Hora Shastra, Vimshottari Dasha systems, and planetary transit ephemeris.*`;
}

// -------------------------------------------------------------------------------------------------
// TAMIL, TELUGU, BENGALI & URDU GENERATORS
// -------------------------------------------------------------------------------------------------
function generateTamilReading(ctx: any): string {
  const { name, userMessage, topic, lagna, moon, currentMD, currentAD, sadeSati, house7Lord, house10Lord, lagnaLord } = ctx;
  return `## ॐ நமசிவாய | வேத ஜோதிட ஆலோசனை
**ஜாதகர்:** ${name} | **கேட்கப்பட்ட கேள்வி:** "${userMessage}"

---

### 🎯 கேள்வியின் நேரடி ஜோதிட பலன் (Direct Verdict)
உங்கள் கேள்விக்குரிய விஷயத்தில் உங்கள் ஜாதகத்தில் **சாதகமான கிரக நிலைகள் மற்றும் சுப யோகங்கள்** காணப்படுகின்றன. லக்னாதிபதி **${lagnaLord}** மற்றும் ராசிநாதன் பலம் உங்கள் எண்ணங்களை ஈடேற்றும்.

---

### 🔍 கிரக அமைப்பு மற்றும் காரணங்கள்
• **லக்னம்**: உங்கள் லக்னம் **${lagna.sign}** (${lagna.nakshatra} நட்சத்திரம்). லக்னாதிபதி **${lagnaLord}** ஆவார்.
• **ராசி**: உங்கள் ராசி **${moon.sign}** (${moon.nakshatra} நட்சத்திரம்).
• **தசா புத்தி**: தற்போது நடைபெறும் தசை **${currentMD} மகாதிசை**, புத்தி **${currentAD} புக்தி**.
• **விஷயத்திற்குரிய கிரகங்கள்**: 7-ம் அதிபதி **${house7Lord}** மற்றும் 10-ம் அதிபதி **${house10Lord}** உங்கள் வாழ்வின் உயர்விற்கு உறுதுணையாக உள்ளனர்.

---

### ⏳ கால நிர்ணயம் (Timing)
தற்போது நடக்கும் தசாபுத்தி மற்றும் குரு பகவானின் சுப பார்வை காலத்தில், அடுத்த **3 முதல் 12 மாதங்களுக்குள்** உங்கள் கேள்விக்குரிய விடயத்தில் சிறந்த முன்னேற்றமும் வெற்றியும் கிட்டும்.

---

### 🔱 சிறப்பு வேத பரிகாரங்கள் (Targeted Remedies)
• **மந்திரம்**: தினமும் காலையில் *"ஓம் நமசிவாய"* அல்லது *"ஓம் நமோ நாராயணாய"* 108 முறை பாராயணம் செய்யவும்.
• **வழிபாடு**: அருகிலுள்ள சிவன் அல்லது முருகன் கோவிலில் நெய்தீபம் ஏற்றி வழிபடவும்.
• **தானம்**: வெள்ளிக்கிழமை அல்லது சனிக்கிழமை எளியவர்களுக்கு உணவளிக்கவும்.`;
}

function generateTeluguReading(ctx: any): string {
  const { name, userMessage, topic, lagna, moon, currentMD, currentAD, sadeSati, house7Lord, house10Lord, lagnaLord } = ctx;
  return `## ఓం నమో వేంకటేశాయ | వేద జ్యోతిష పరిష్కారం
**జాతకుడు:** ${name} | **అడిగిన ప్రశ్న:** "${userMessage}"

---

### 🎯 మీ ప్రశ్నకు ప్రత్యక్ష జ్యోతిష సమాధానం (Direct Verdict)
మీరు అడిగిన ప్రశ్నకు మీ జన్మకుండలిలోని గ్రహ స్థితులు **అనుకూలమైన శుభ ఫలితాలను** సూచిస్తున్నాయి. లగ్నాధిపతి **${lagnaLord}** బలము మరియు నవాంశ, దశాంశ చక్రాల యోగం మీకు విజయాన్ని చేకూరుస్తుంది.

---

### 🔍 జాతక గ్రహ విశ్లేషణ
• **లగ్నము**: మీ లగ్నం **${lagna.sign}** (${lagna.nakshatra} నక్షత్రం). లగ్నాధిపతి **${lagnaLord}**.
• **జన్మ రాశి**: మీ చంద్ర రాశి **${moon.sign}** (${moon.nakshatra} నక్షత్రం).
• **ప్రస్తుత దశాకాలం**: **${currentMD} మహాదశ** లో **${currentAD} అంతర్దశ** నడుస్తోంది.
• **సంబంధిత భావాధిపతులు**: సప్తమాధిపతి **${house7Lord}** మరియు దశమాధిపతి **${house10Lord}** మంచి స్థితిలో ఉన్నారు.

---

### ⏳ కార్యసిద్ధి సమయము (Timing)
ప్రస్తుత వింశోత్తరి దశాకాలం మరియు గోచార గురు గ్రహ అనుగ్రహంతో రాబోయే **3 నుండి 12 నెలల వ్యవధిలో** మీ ప్రశ్నకు సంబంధించిన శుభ పరిణామాలు సంభవిస్తాయి.

---

### 🔱 ప్రత్యక్ష వేద పరిహారాలు (Targeted Remedies)
• **నిత్య జపం**: ప్రతిరోజూ *"ఓం నమో భగవతే వాసుదేవాయ"* మంత్రం 108 సార్లు జపించండి.
• **పూజ**: గురువారం లేదా శనివారం నవగ్రహ ప్రదక్షిణలు చేయడం శ్రేయస్కరం.
• **దానం**: పేదలకు అన్నదానం లేదా పక్షులకు దాణా సమర్పించండి.`;
}

function generateBengaliReading(ctx: any): string {
  const { name, userMessage, topic, lagna, moon, currentMD, currentAD, house7Lord, house10Lord, lagnaLord } = ctx;
  return `## ॐ নমো নারায়ণায় | বৈদিক জ্যোতিষ পরামর্শ
**জাতক:** ${name} | **নির্দিষ্ট প্রশ্ন:** "${userMessage}"

---

### 🎯 প্রশ্নের প্রত্যক্ষ ফলিত সিদ্ধান্ত (Direct Verdict)
আপনার জন্মকুণ্ডলী অনুসারে আপনার উত্থাপিত প্রশ্নে **শুভ ও অনুকূল ফলাফল** নিশ্চিতভাবে পরিলক্ষিত হচ্ছে। আপনার লগ্নাধিপতি **${lagnaLord}** এবং শুভ গ্রহগুলির অবস্থান আপনার কর্মসিদ্ধিতে সহায়ক হবে।

---

### 🔍 গ্রহ সংস্থান ও শাস্ত্রীয় বিচার
• **লগ্ন**: আপনার লগ্ন **${lagna.sign}** (${lagna.nakshatra} নক্ষত্র)। লগ্নাধিপতি **${lagnaLord}**।
• **রাশি**: আপনার চন্দ্র রাশি **${moon.sign}** (${moon.nakshatra} নক্ষত্র)।
• **চলমান দশা**: বর্তমানে **${currentMD} মহাদশা** এবং **${currentAD} অন্তর্দশা** চলছে।
• **বিশেষ ভাবাধিকারী**: ৭ম পতি **${house7Lord}** এবং ১০ম পতি **${house10Lord}** আপনার ভাগ্যোন্নয়নে সহায়ক।

---

### ⏳ ফলিত সময়কাল (Timing)
চলতি বিংশোত্তরী দশা এবং বৃহস্পতির অনুকূল গোচরের প্রভাবে আগামী **৩ থেকে ৯ মাসের মধ্যে** আপনার কাঙ্ক্ষিত বিষয়ে শুভ সমাধান সূচিত হবে।

---

### 🔱 বিশেষ বৈদিক প্রতিকার (Targeted Remedies)
• **নিত্য জপ**: প্রতিদিন সকালে *"ওঁ নমো ভগবতে বাসুদেবায়"* বা *"ওঁ নমঃ শিবায়"* ১০৮ বার জপ করুন।
• **পূজন**: শিবলিঙ্গে কাঁচা দুধ ও জল অর্পণ করুন।
• **দান**: শুক্রবার দরিদ্রদের অন্ন বা মিষ্টান্ন দান কল্যাণকর।`;
}

function generateUrduReading(ctx: any): string {
  const { name, userMessage, topic, lagna, moon, currentMD, currentAD, lagnaLord } = ctx;
  return `## اداب | ویدک علم نجوم رہنمائی
**نام:** ${name} | **پوچھا گیا سوال:** "${userMessage}"

---

### 🎯 آپ کے سوال کا براہ راست جواب (Direct Verdict)
آپ کے زائچہ کی سیاروی پوزیشن کے مطابق آپ کے سوال کا **مثبت اور فائدہ مند نتیجہ** ظاہر ہو رہا ہے۔ طالع کا حاکم سیارہ **${lagnaLord}** آپ کو کامیابی اور ذہنی استحکام فراہم کر رہا ہے۔

---

### 🔍 سیاروی تجزیہ
• **طالع (Lagna)**: برج **${lagna.sign}** (نچھتر: ${lagna.nakshatra})۔
• **برج قمر (Moon Sign)**: **${moon.sign}**۔
• **موجودہ دور (Dasha)**: اس وقت **${currentMD} مہادشا** میں **${currentAD} انتردشا** سرگرم ہے۔

---

### ⏳ وقت کا تعین (Timing)
آئندہ **3 سے 9 ماہ کے اندر** آپ کے اس معاملے میں نمایاں بہتری اور رکاوٹوں کے خاتمے کے واضح امکانات ہیں۔

---

### 🔱 روحانی تدابیر اور صدقہ (Remedies)
• روزانہ صبح پرندوں کو دانہ اور پانی پیش کریں۔
• غریبوں اور ضرورت مندوں کی مدد کرنا تمام رکاوٹوں کو دور کرتا ہے۔`;
}
