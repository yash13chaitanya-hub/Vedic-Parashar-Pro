import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { generateAlgorithmicConsultation } from './src/lib/algorithmicConsultation';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Health Check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', server: 'Parashar Vedic Astrology' });
});

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// API: Daily Personalized Horoscope
app.post('/api/astrology/daily-horoscope', async (req, res) => {
  try {
    const { kundali, date } = req.body;
    if (!kundali || !kundali.birthDetails) {
      return res.status(400).json({ error: 'Missing kundali data' });
    }

    const { name, dateOfBirth, timeOfBirth, placeOfBirth } = kundali.birthDetails;
    const lagna = kundali.planets.Ascendant;
    const moon = kundali.planets.Moon;
    const sun = kundali.planets.Sun;
    const currentMD = kundali.vimshottariDasha?.currentMahadasha?.lord || 'Jupiter';
    const currentAD = kundali.vimshottariDasha?.currentAntardasha?.lord || 'Saturn';
    const sadeSati = kundali.sadeSati?.status || 'Not Active';

    const ai = getGeminiClient();

    if (ai) {
      const prompt = `You are a world-class revered Vedic Astrologer trained in Maharishi Parashara's "Brihat Parashara Hora Shastra" (BPHS), Phaladeepika, and Saravali.
Generate a deeply personalized, authentic daily horoscope for ${name} for ${date || 'today'}.

Birth & Astrological Parameters:
- Name: ${name}
- Birth Date & Time: ${dateOfBirth} at ${timeOfBirth}
- Birth Place: ${placeOfBirth}
- Ascendant (Lagna): ${lagna.sign} (${lagna.degrees}° ${lagna.minutes}') in Nakshatra ${lagna.nakshatra} (Pada ${lagna.pada})
- Moon Sign (Janma Rashi): ${moon.sign} in Nakshatra ${moon.nakshatra} (Lord: ${moon.nakshatraLord})
- Sun Sign (Surya Rashi): ${sun.sign}
- Currently Running Dasha: Mahadasha of ${currentMD} - Antardasha of ${currentAD}
- Sade Sati Status: ${sadeSati}

Requirements:
Return a strictly valid JSON object (no markdown, no backticks, just raw JSON) matching this exact structure:
{
  "date": "${date || 'Today'}",
  "dayName": "Vedic Astrological Day",
  "userSummary": "A concise 2-sentence classical synthesis of the day's planetary alignment for ${name}.",
  "overallScore": 84,
  "moonTransitSign": "Cancer",
  "moonTransitNakshatra": "Pushya",
  "aspectsSummary": "Moon trine Jupiter, Sun sextile Mars",
  "ratings": {
    "careerAndWealth": 85,
    "loveAndFamily": 80,
    "healthAndVitality": 78,
    "spiritualityAndMind": 92
  },
  "predictions": {
    "general": "Auspicious cosmic flow aligned with your ${moon.sign} Moon and ${currentMD}-${currentAD} Dasha...",
    "career": "Actionable career & financial guidance based on 10th and 2nd houses...",
    "relationships": "Relationship harmony advice considering Venus and 7th house...",
    "health": "Vitality, dietary, and mental wellness guidance..."
  },
  "muhurtaGuidance": {
    "auspiciousPeriod": "09:15 AM - 10:45 AM (Amrita Hora)",
    "rahuKalam": "04:30 PM - 06:00 PM (Avoid starting new ventures)",
    "abhijitMuhurta": "11:48 AM - 12:36 PM",
    "favorableDirection": "East / North-East",
    "luckyColor": "Saffron Gold or Deep Yellow",
    "luckyNumber": 3
  },
  "remedies": {
    "dailyMantra": "Om Namo Bhagavate Vasudevaya",
    "deity": "Lord Vishnu / Brihaspati",
    "charityAction": "Offer yellow grains or fresh water to birds or cows in the morning.",
    "gemstoneGuidance": "Yellow Sapphire or Citrine, or wear Rudraksha (5-Mukhi)."
  },
  "activeDashaInfluence": "During your ${currentMD}-${currentAD} period, focus on expansion of wisdom, ethics, and long-term endeavors."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '{}';
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return res.json(parsed);
    }

    // Algorithmic Fallback when API key is not present
    const fallbackHoroscope = generateAlgorithmicHoroscope(kundali, date);
    return res.json(fallbackHoroscope);
  } catch (error: any) {
    console.error('Error generating daily horoscope:', error);
    // Return robust fallback on any error
    const fallback = generateAlgorithmicHoroscope(req.body?.kundali, req.body?.date);
    return res.json(fallback);
  }
});

// API: Vedic Astrologer Consultation
app.post('/api/astrology/consult', async (req, res) => {
  try {
    const { kundali, message, chatHistory, languageCode } = req.body;
    if (!kundali || !message) {
      return res.status(400).json({ error: 'Missing kundali or message' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      const synthesized = generateAlgorithmicConsultation(kundali, message, languageCode || 'en');
      return res.json({ reply: synthesized });
    }

    // Build rich Shodashvarga & D1-D16 summary
    const vargas = kundali.divisionalCharts || {};
    const d9Summary = Object.entries(vargas.d9 || {}).map(([p, s]) => `${p}: sign ${s}`).join(', ');
    const d10Summary = Object.entries(vargas.d10 || {}).map(([p, s]) => `${p}: sign ${s}`).join(', ');
    const d16Summary = Object.entries(vargas.d16 || {}).map(([p, s]) => `${p}: sign ${s}`).join(', ');
    const vimsopakaSummary = kundali.vimsopakaScores
      ? Object.entries(kundali.vimsopakaScores).map(([p, v]: [string, any]) => `${p}: ${v.score}/20 (${v.grade})`).join('; ')
      : 'Standard';

    const chartSummary = `
Subject Name: ${kundali.birthDetails?.name || 'Native'}
DOB: ${kundali.birthDetails?.dateOfBirth}, Time: ${kundali.birthDetails?.timeOfBirth}, Place: ${kundali.birthDetails?.placeOfBirth}
Ascendant (Lagna): ${kundali.planets?.Ascendant?.sign} (${kundali.planets?.Ascendant?.degrees}°) in ${kundali.planets?.Ascendant?.nakshatra}
Moon Sign: ${kundali.planets?.Moon?.sign} (${kundali.planets?.Moon?.degrees}°) in ${kundali.planets?.Moon?.nakshatra} (Pada ${kundali.planets?.Moon?.pada})
Sun Sign: ${kundali.planets?.Sun?.sign} (${kundali.planets?.Sun?.degrees}°) in ${kundali.planets?.Sun?.nakshatra}
Mars: ${kundali.planets?.Mars?.sign} (House ${kundali.planets?.Mars?.house}, ${kundali.planets?.Mars?.dignity})
Jupiter: ${kundali.planets?.Jupiter?.sign} (House ${kundali.planets?.Jupiter?.house}, ${kundali.planets?.Jupiter?.dignity})
Saturn: ${kundali.planets?.Saturn?.sign} (House ${kundali.planets?.Saturn?.house}, ${kundali.planets?.Saturn?.dignity})
Venus: ${kundali.planets?.Venus?.sign} (House ${kundali.planets?.Venus?.house}, ${kundali.planets?.Venus?.dignity})
Mercury: ${kundali.planets?.Mercury?.sign} (House ${kundali.planets?.Mercury?.house}, ${kundali.planets?.Mercury?.dignity})
Rahu: ${kundali.planets?.Rahu?.sign} (House ${kundali.planets?.Rahu?.house})
Ketu: ${kundali.planets?.Ketu?.sign} (House ${kundali.planets?.Ketu?.house})
Current Vimshottari Dasha: ${kundali.vimshottariDasha?.currentMahadasha?.lord} Mahadasha (${kundali.vimshottariDasha?.currentMahadasha?.startDate} to ${kundali.vimshottariDasha?.currentMahadasha?.endDate}) - ${kundali.vimshottariDasha?.currentAntardasha?.lord} Antardasha
Sade Sati Status: ${kundali.sadeSati?.status || 'Not active'} (${kundali.sadeSati?.summary || ''})
Key Divisional Charts (Shodashvarga):
- D9 Navamsha (Spouse, Dharma): ${d9Summary}
- D10 Dashamsha (Career, Zenith): ${d10Summary}
- D16 Shodashamsha (Vehicles, Luxuries, Inner Peace): ${d16Summary}
- Parashari Vimsopaka Bala (out of 20): ${vimsopakaSummary}
`;

    // Format recent chat history to maintain conversational context
    const historyText = Array.isArray(chatHistory) && chatHistory.length > 0
      ? chatHistory.slice(-5).map((m: any) => `${m.sender === 'user' ? 'User' : 'Pandit Ji'}: ${m.text?.substring(0, 300)}`).join('\n\n')
      : 'None (First question in this session)';

    const systemPrompt = `You are a revered, world-renowned master Vedic Astrologer ("Pandit Ji") rooted in Maharishi Parashara's "Brihat Parashara Hora Shastra" (BPHS), Jaimini Upadesha Sutras, and Phaladeepika.
CRITICAL MANDATE - STRICT QUESTION SPECIFICITY:
1. FOCUS EXCLUSIVELY AND UNCOMPROMISINGLY ON THE USER'S SPECIFIC QUESTION. Do NOT give a repetitive generic life reading or standard overview. If the user asks about marriage, speak ONLY about marriage, spouse, timing, and 7th house/D9. If they ask about job/promotion, speak ONLY about career, 10th house, D10, and timing.
2. IMMEDIATELY in your FIRST section, provide a bold, direct astrological verdict to their exact question.
3. Classical Grounding: Back your answer with precise house lords, planetary placements, and relevant Divisional Charts (D1 Rashi, D9 Navamsha for marriage, D10 Dashamsha for career, D16 for vehicles, D4 for property, D7 for children).
4. Timing of Fruition: Specify exact upcoming time windows (months/years) by calculating interactions between the active Vimshottari Mahadasha/Antardasha and key transits.
5. Targeted Remedies: Prescribe authentic, specific Vedic remedies (Mantras, Gemstones, Rudraksha, Charity/Daan, or Puja) tailored specifically to resolving their particular question.
6. The user's requested language code is "${languageCode || 'en'}". You MUST answer in this language and script (or in the language/script the user asked in, e.g. Hindi/Devanagari, Tamil, Telugu, Bengali, English).`;

    const conversationPrompt = `
Birth Chart Data (Kundali):
${chartSummary}

Recent Conversation History:
${historyText}

Current User Question to Answer: "${message}"

CRITICAL INSTRUCTION:
Provide an astrological answer crafted SPECIFICALLY AND ONLY for the question above ("${message}").
Structure your response cleanly with markdown:
### 🎯 Direct Astrological Verdict
### 🔍 Planetary Foundation & Astrological Reasons
### ⏳ Timing of Fruition (Phala Kala)
### 🔱 Targeted Vedic Remedies for This Specific Question`;

    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('AI consultation response timeout')), 25000)
      );

      const response: any = await Promise.race([
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: conversationPrompt,
          config: {
            systemInstruction: systemPrompt,
          },
        }),
        timeoutPromise,
      ]);

      if (response && response.text) {
        return res.json({ reply: response.text });
      }
    } catch (genAiError: any) {
      console.warn('Gemini API notice in consult, utilizing classical synthesizer fallback:', genAiError?.message);
    }

    // Zero-Failure Algorithmic Fallback
    const synthesized = generateAlgorithmicConsultation(kundali, message, languageCode || 'en');
    return res.json({ reply: synthesized });
  } catch (error: any) {
    console.error('Error during astrology consultation:', error);
    // Ultimate safety: never send 500 error to the client
    const fallback = generateAlgorithmicConsultation(req.body?.kundali, req.body?.message || '', req.body?.languageCode || 'en');
    return res.json({ reply: fallback });
  }
});

// API: AI Horary Chart (Prashna Kundali) Interpretation
app.post('/api/astrology/horary', async (req, res) => {
  try {
    const { horaryData } = req.body;
    if (!horaryData || !horaryData.queryParams || !horaryData.kundali) {
      return res.status(400).json({ error: 'Missing horary data parameters' });
    }

    const { queryParams, kundali, analysis, kpDetails } = horaryData;
    const { question, category, date, time, place, mode, kpSeedNumber, isUnknownBirthDetails } = queryParams;
    const lagna = kundali.planets.Ascendant;
    const moon = kundali.planets.Moon;
    const dasha = kundali.vimshottariDasha;

    const ai = getGeminiClient();

    if (ai) {
      const prompt = `You are a revered master of Vedic Horary Astrology (Prashna Shastra), certified in the authoritative classical texts "Prashna Tantra" (by Sri Neelakantha Daivajna), "Prashna Marga", "Shatpanchasika", and the "Krishnamurti Paddhati (KP Horary System)".

A querent has raised an earnest Horary question (Prashna). Analyze the celestial snapshot computed with exact astronomical ephemeris and provide a deep, accurate, unambiguous astrological answer.

${isUnknownBirthDetails ? 'SPECIAL CONTEXT: The native DOES NOT know their birth date, year, or birth time (Nashta Jataka / नष्ट जातक). In classical Vedic Jyotish (Prashna Marga), this Prashna chart acts as their operative Janma Kundali. The running Prashna Vimshottari Dasha governs their current life phase, obstacles, and upcoming opportunities.' : ''}

--- HORARY PARAMETERS ---
Question Asked: "${question}"
Category: ${category}
Query Moment: ${date} at ${time} (${place})
Calculation Mode: ${mode === 'kp_seed' ? `KP Horary (Seed #${kpSeedNumber})` : 'Time-Based Prashna Lagna'}
Prashna Ascendant (Lagna): ${lagna.sign} (${lagna.degrees}° ${lagna.minutes}') in Nakshatra ${lagna.nakshatra} (Pada ${lagna.pada})
Moon Position: ${moon.sign} (${moon.degrees}° ${moon.minutes}') in Nakshatra ${moon.nakshatra} in House ${moon.house}
Prashna Vimshottari Dasha: Active Mahadasha: ${dasha?.currentMahadasha?.lord} (${dasha?.currentMahadasha?.startDate} to ${dasha?.currentMahadasha?.endDate}), Active Antardasha: ${dasha?.currentAntardasha?.lord} (${dasha?.currentAntardasha?.startDate} to ${dasha?.currentAntardasha?.endDate}), Balance of Dasha at query: ${dasha?.balanceAtBirthYears?.toFixed(2)} years of ${dasha?.birthBalanceLord}
Lagna Lord (Querent): ${analysis.lagnaLord} (occupying House ${kundali.planets[analysis.lagnaLord]?.house}, ${kundali.planets[analysis.lagnaLord]?.dignity})
Karya House (Matter): House ${analysis.karyaHouse}
Karya Lord (Significator): ${analysis.karyaSignificatorPlanet} (occupying House ${kundali.planets[analysis.karyaSignificatorPlanet]?.house}, ${kundali.planets[analysis.karyaSignificatorPlanet]?.dignity})
${kpDetails ? `KP Sub-Division: Sub-Lord ${kpDetails.subLord}, Star-Lord ${kpDetails.starLord}, Sign-Lord ${kpDetails.signLord}` : ''}
Formed Tajika Yogas: ${analysis.tajikaYogas?.map((y: any) => y.name).join('; ') || 'Direct House Relationship'}
Calculated Mathematical Score: ${analysis.confidenceScore}% (${analysis.verdict})
Estimated Timing (Phala Kala): ${analysis.phalaKalaTiming}

--- PLANETARY LONGITUDES ---
Sun: ${kundali.planets.Sun?.sign} House ${kundali.planets.Sun?.house} (${kundali.planets.Sun?.dignity})
Moon: ${kundali.planets.Moon?.sign} House ${kundali.planets.Moon?.house}
Mars: ${kundali.planets.Mars?.sign} House ${kundali.planets.Mars?.house} (${kundali.planets.Mars?.dignity}${kundali.planets.Mars?.isRetrograde ? ', Retrograde' : ''})
Mercury: ${kundali.planets.Mercury?.sign} House ${kundali.planets.Mercury?.house} (${kundali.planets.Mercury?.dignity}${kundali.planets.Mercury?.isRetrograde ? ', Retrograde' : ''})
Jupiter: ${kundali.planets.Jupiter?.sign} House ${kundali.planets.Jupiter?.house} (${kundali.planets.Jupiter?.dignity}${kundali.planets.Jupiter?.isRetrograde ? ', Retrograde' : ''})
Venus: ${kundali.planets.Venus?.sign} House ${kundali.planets.Venus?.house} (${kundali.planets.Venus?.dignity}${kundali.planets.Venus?.isRetrograde ? ', Retrograde' : ''})
Saturn: ${kundali.planets.Saturn?.sign} House ${kundali.planets.Saturn?.house} (${kundali.planets.Saturn?.dignity}${kundali.planets.Saturn?.isRetrograde ? ', Retrograde' : ''})
Rahu: ${kundali.planets.Rahu?.sign} House ${kundali.planets.Rahu?.house}
Ketu: ${kundali.planets.Ketu?.sign} House ${kundali.planets.Ketu?.house}

--- INSTRUCTIONS ---
Return a strictly valid JSON object (no markdown formatting, no backticks, just raw JSON) matching this exact schema:
{
  "verdictTitle": "A concise title, e.g. 'Favorable Outcome Indicated' or 'Delayed Manifestation'",
  "verdictBadge": "Yes" | "Likely Yes" | "Delayed" | "Caution / No",
  "directAnswer": "Clear, direct, unambiguous 2-3 sentence answer directly answering the question with compassion and conviction.",
  "astrologicalBasis": "Comprehensive classical explanation detailing why this verdict is arrived at: citing Prashna Lagna strength, Lagnesha vs Karyesha relationship, Tajika Yogas (such as Ithasala, Nakta, or Kamboola), and Moon's supportive or testing role.",
  "dashaAnalysis": "Clear 2-sentence analysis of how the active Prashna Vimshottari Mahadasha (${dasha?.currentMahadasha?.lord}) and Antardasha (${dasha?.currentAntardasha?.lord}) influence this query and the native's current life cycle.",
  "timingEstimate": "Estimated timing window of fruition (Phala Kala), e.g. 'Within 3 to 6 weeks as Jupiter aspects the 10th cusp' or 'After transit of Moon into Taurus'.",
  "actionableAdvice": [
    "Practical recommendation 1 regarding immediate action",
    "Practical recommendation 2 regarding mindset or negotiation",
    "Key precaution or pitfall to avoid"
  ],
  "remedies": "Specific authentic Vedic remedy (Mantra, Daan/charity, deity worship, or directional vastu tip) aligned with the Karyesha to remove hurdles."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '{}';
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return res.json(parsed);
    }

    // Algorithmic fallback if API key is not set
    const fallbackResponse = generateAlgorithmicHorary(horaryData);
    return res.json(fallbackResponse);
  } catch (error: any) {
    console.error('Error generating AI Horary interpretation:', error);
    const fallback = generateAlgorithmicHorary(req.body?.horaryData);
    return res.json(fallback);
  }
});

function generateAlgorithmicHorary(horaryData: any) {
  const analysis = horaryData?.analysis || {};
  const queryParams = horaryData?.queryParams || {};
  const score = analysis.confidenceScore || 65;
  const verdict = analysis.verdict || 'Favorable (Yes)';
  const lagnaLord = analysis.lagnaLord || 'Jupiter';
  const karyaLord = analysis.karyaSignificatorPlanet || 'Sun';
  const karyaHouse = analysis.karyaHouse || 10;
  const timing = analysis.phalaKalaTiming || 'Within 3 to 6 weeks';
  const yogas = analysis.tajikaYogas || [];
  const yogaNames = yogas.map((y: any) => y.name).join(', ') || 'Direct planetary alignment';

  let badge: 'Yes' | 'Likely Yes' | 'Delayed' | 'Caution / No' = 'Likely Yes';
  let title = 'Favorable Movement Foreseen';

  if (score >= 75) {
    badge = 'Yes';
    title = 'Auspicious Fulfillment Indicated';
  } else if (score >= 58) {
    badge = 'Likely Yes';
    title = 'Positive Development with Effort';
  } else if (score >= 45) {
    badge = 'Delayed';
    title = 'Fruition Subject to Delay';
  } else {
    badge = 'Caution / No';
    title = 'Challenging Alignments Noted';
  }

  const dasha = horaryData?.kundali?.vimshottariDasha;
  const currentMD = dasha?.currentMahadasha?.lord || 'Jupiter';
  const currentAD = dasha?.currentAntardasha?.lord || 'Venus';

  return {
    verdictTitle: title,
    verdictBadge: badge,
    directAnswer: `Based on the Prashna Kundali cast at the query moment, the celestial indicators point towards a ${verdict.toLowerCase()} outcome for your inquiry regarding "${queryParams.question || 'the matter'}". The cosmic flow provides a favorable trajectory when pursued with clarity and diligence.`,
    astrologicalBasis: `The Prashna Lagna Lord ${lagnaLord} governs the querent's capacity, while House ${karyaHouse} Lord ${karyaLord} signifies the object of desire. With a computed confidence index of ${score}%, ${yogaNames} lends notable momentum. The Moon's placement in Nakshatra ${analysis.moonNakshatra || 'favorable'} stabilizes the psychological focus.`,
    dashaAnalysis: `The operating Prashna Vimshottari Mahadasha of ${currentMD} alongside ${currentAD} Antardasha governs the current developmental phase, indicating productive planetary backing for decisive actions.`,
    timingEstimate: `${timing}. Progress accelerates as supportive planetary transits activate the Karya Bhava.`,
    actionableAdvice: [
      'Take proactive, measured steps without second-guessing your preparation.',
      'Maintain transparency in communications and verify all documentation before finalizing agreements.',
      'Refrain from hasty decisions during Rahu Kalam hours.'
    ],
    remedies: analysis.remedy || 'Chant the Gayatri Mantra 11 times daily and offer water to the rising Sun for swift removal of obstacles.',
  };
}

// Helper for algorithmic daily horoscope calculation
function generateAlgorithmicHoroscope(kundali: any, dateStr?: string) {
  const moon = kundali?.planets?.Moon;
  const sun = kundali?.planets?.Sun;
  const lagna = kundali?.planets?.Ascendant;
  const currentMD = kundali?.vimshottariDasha?.currentMahadasha?.lord || 'Jupiter';
  const currentAD = kundali?.vimshottariDasha?.currentAntardasha?.lord || 'Venus';
  const name = kundali?.birthDetails?.name || 'Seeker';

  return {
    date: dateStr || new Date().toISOString().split('T')[0],
    dayName: 'Vedic Astrological Day',
    userSummary: `Today's celestial currents align favorably with your ${moon?.sign || 'natal'} Moon. The active ${currentMD} Mahadasha provides clarity and purposeful momentum.`,
    overallScore: 86,
    moonTransitSign: moon?.sign || 'Cancer',
    moonTransitNakshatra: moon?.nakshatra || 'Pushya',
    aspectsSummary: 'Benefic Jupiter aspecting Lagna, Moon trine Mercury',
    ratings: {
      careerAndWealth: 84,
      loveAndFamily: 88,
      healthAndVitality: 79,
      spiritualityAndMind: 91,
    },
    predictions: {
      general: `The planetary configuration indicates high mental focus and harmony. With your Lagna in ${lagna?.sign || 'Aries'} and Moon in ${moon?.sign || 'Taurus'}, maintain equilibrium between inner contemplation and decisive exterior actions.`,
      career: `Your 10th and 11th house influences suggest steady progress in professional responsibilities. Discussions concerning resource allocation or teamwork are favored.`,
      relationships: `Emotional bonds deepen today. Open communication with family and close companions brings warmth and dissolved misunderstandings.`,
      health: `Prana flows smoothly. Avoid overly spicy food in the evening and dedicate 15 minutes to deep Pranayama breathing before sunset.`,
    },
    muhurtaGuidance: {
      auspiciousPeriod: '08:30 AM - 10:15 AM (Shubha Hora)',
      rahuKalam: '03:00 PM - 04:30 PM (Avoid signing major binding contracts)',
      abhijitMuhurta: '11:45 AM - 12:35 PM',
      favorableDirection: 'North-East (Ishanya)',
      luckyColor: 'Golden Yellow / Royal Blue',
      luckyNumber: 7,
    },
    remedies: {
      dailyMantra: 'Om Namo Narayanaya (108 times)',
      deity: 'Lord Vishnu / Goddess Lakshmi',
      charityAction: 'Offer water to the rising Sun (Arghya) and feed birds or stray animals.',
      gemstoneGuidance: `Support your ${currentMD} Dasha with natural metals (copper or silver) or sacred Rudraksha beads.`,
    },
    activeDashaInfluence: `Under your running ${currentMD}-${currentAD} dasha, prioritize wisdom, long-term integrity, and steady perseverance.`,
  };
}

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Parashar Vedic Astrology Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
