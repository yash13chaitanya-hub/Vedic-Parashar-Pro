import React, { useState, useEffect, useMemo } from 'react';
import {
  BirthDetails,
  HoraryCategory,
  HoraryQueryParams,
  HoraryChartData,
  HoraryAiResponse,
  PlanetName,
} from '../types';
import {
  HORARY_CATEGORIES_CONFIG,
  generateHoraryKundali,
  KP_249_TABLE,
  KpSubEntry,
} from '../lib/horaryCalculations';
import { SANSKRIT_PLANETS } from '../lib/vedicCalculations';
import { POPULAR_CITIES, CityLocation } from '../lib/cityData';
import { NorthIndianChart } from './NorthIndianChart';
import { SouthIndianChart } from './SouthIndianChart';
import { PlanetaryTable } from './PlanetaryTable';
import {
  Sparkles,
  HelpCircle,
  Clock,
  MapPin,
  Compass,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Sliders,
  Calendar,
  Send,
  BookOpen,
  Info,
  Layers,
  ChevronDown,
  ChevronUp,
  UserCheck,
  ShieldCheck,
  Sun,
  Moon,
  Star,
} from 'lucide-react';

interface HoraryViewProps {
  currentProfile: BirthDetails;
}

const UNKNOWN_BIRTH_SAMPLE_QUESTIONS = [
  'What does my current Vimshottari Dasha indicate for my career, wealth, and life path?',
  'When will marriage, partnership, or relationship fulfillment manifest for me?',
  'Will my current job search, business contract, or investment succeed?',
  'What are my active planetary obstacles and prescribed Vedic remedies?',
  'What does the upcoming Antardasha cycle hold for my health and family?',
];

const DASHA_PLANET_THEMES: Record<string, { bg: string; text: string; border: string; bar: string; badge: string; meaning: string }> = {
  Sun: {
    bg: 'bg-amber-50',
    text: 'text-amber-900',
    border: 'border-amber-300',
    bar: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-950 border-amber-300',
    meaning: 'Vitality, authority, career status, soul purpose, leadership',
  },
  Moon: {
    bg: 'bg-sky-50',
    text: 'text-sky-900',
    border: 'border-sky-300',
    bar: 'bg-sky-500',
    badge: 'bg-sky-100 text-sky-950 border-sky-300',
    meaning: 'Mind, emotional equilibrium, public recognition, travels, motherly care',
  },
  Mars: {
    bg: 'bg-rose-50',
    text: 'text-rose-900',
    border: 'border-rose-300',
    bar: 'bg-rose-500',
    badge: 'bg-rose-100 text-rose-950 border-rose-300',
    meaning: 'Courage, real estate, sibling dynamics, decisive initiative, energy',
  },
  Mercury: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-900',
    border: 'border-emerald-300',
    bar: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-950 border-emerald-300',
    meaning: 'Commerce, intellect, communication, business contracts, analytical skills',
  },
  Jupiter: {
    bg: 'bg-amber-50',
    text: 'text-amber-900',
    border: 'border-amber-300',
    bar: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-950 border-amber-300',
    meaning: 'Wisdom, financial prosperity, divine blessings, marriage, children',
  },
  Venus: {
    bg: 'bg-pink-50',
    text: 'text-pink-900',
    border: 'border-pink-300',
    bar: 'bg-pink-500',
    badge: 'bg-pink-100 text-pink-950 border-pink-300',
    meaning: 'Relationships, material luxuries, artistic pursuits, vehicle purchase, harmony',
  },
  Saturn: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-900',
    border: 'border-indigo-300',
    bar: 'bg-indigo-500',
    badge: 'bg-indigo-100 text-indigo-950 border-indigo-300',
    meaning: 'Discipline, perseverance, karmic recompense, enduring foundations, longevity',
  },
  Rahu: {
    bg: 'bg-purple-50',
    text: 'text-purple-900',
    border: 'border-purple-300',
    bar: 'bg-purple-500',
    badge: 'bg-purple-100 text-purple-950 border-purple-300',
    meaning: 'Sudden worldly ambition, unconventional growth, foreign ties, deep transformation',
  },
  Ketu: {
    bg: 'bg-orange-50',
    text: 'text-orange-900',
    border: 'border-orange-300',
    bar: 'bg-orange-500',
    badge: 'bg-orange-100 text-orange-950 border-orange-300',
    meaning: 'Spiritual detachment, intuitive insights, karmic completions, liberation',
  },
};

const calculateDashaProgress = (startDate: string, endDate: string) => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const now = new Date().getTime();
  if (now <= start) return 0;
  if (now >= end) return 100;
  return Math.min(100, Math.max(0, Math.round(((now - start) / (end - start)) * 100)));
};

const getDurationMonths = (startDate: string, endDate: string): string => {
  try {
    const s = new Date(startDate).getTime();
    const e = new Date(endDate).getTime();
    if (isNaN(s) || isNaN(e)) return '—';
    const months = (e - s) / (1000 * 60 * 60 * 24 * 30.4375);
    return months.toFixed(1);
  } catch {
    return '—';
  }
};

export const HoraryView: React.FC<HoraryViewProps> = ({ currentProfile }) => {
  // Query Form State
  const [question, setQuestion] = useState<string>('Will I get the job offer I recently interviewed for?');
  const [category, setCategory] = useState<HoraryCategory>('career_job');
  const [mode, setMode] = useState<'time_based' | 'kp_seed'>('time_based');
  const [kpSeedNumber, setKpSeedNumber] = useState<number>(108);
  const [isUnknownBirthDetails, setIsUnknownBirthDetails] = useState<boolean>(
    currentProfile.isUnknownBirthDetails || false
  );

  const [date, setDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });

  const [place, setPlace] = useState<string>(currentProfile.placeOfBirth);
  const [latitude, setLatitude] = useState<number>(currentProfile.latitude);
  const [longitude, setLongitude] = useState<number>(currentProfile.longitude);
  const [timezone, setTimezone] = useState<number>(currentProfile.timezone);

  const [citySearch, setCitySearch] = useState('');
  const [citySuggestions, setCitySuggestions] = useState<CityLocation[]>([]);
  const [chartFormat, setChartFormat] = useState<'north' | 'south'>('north');

  // Horary Chart Result
  const [horaryChart, setHoraryChart] = useState<HoraryChartData | null>(null);
  const [isCasting, setIsCasting] = useState<boolean>(false);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [showAdvancedCoords, setShowAdvancedCoords] = useState<boolean>(false);
  const [expandedMahadasha, setExpandedMahadasha] = useState<string | null>(null);

  // Sync with currentProfile when changed
  useEffect(() => {
    if (currentProfile) {
      setPlace(currentProfile.placeOfBirth);
      setLatitude(currentProfile.latitude);
      setLongitude(currentProfile.longitude);
      setTimezone(currentProfile.timezone);
      if (currentProfile.isUnknownBirthDetails) {
        setIsUnknownBirthDetails(true);
      }
    }
  }, [currentProfile]);

  const activeCategoryConfig = HORARY_CATEGORIES_CONFIG[category];

  // Set current moment
  const handleSetCurrentTime = () => {
    const now = new Date();
    setDate(now.toISOString().split('T')[0]);
    setTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
  };

  // Toggle Unknown Birth Mode
  const handleToggleUnknownBirth = () => {
    const nextVal = !isUnknownBirthDetails;
    setIsUnknownBirthDetails(nextVal);
    if (nextVal) {
      handleSetCurrentTime();
      setQuestion('What does my operative chart, career, health, and current Vimshottari Dasha period hold?');
    }
  };

  // City Search
  const handleCitySearch = (query: string) => {
    setCitySearch(query);
    if (!query.trim()) {
      setCitySuggestions([]);
      return;
    }
    const filtered = POPULAR_CITIES.filter((c) =>
      c.city.toLowerCase().includes(query.toLowerCase()) ||
      c.country.toLowerCase().includes(query.toLowerCase())
    );
    setCitySuggestions(filtered.slice(0, 6));
  };

  const handleSelectCity = (c: CityLocation) => {
    setPlace(`${c.city}, ${c.country}`);
    setLatitude(c.latitude);
    setLongitude(c.longitude);
    setTimezone(c.timezone);
    setCitySearch('');
    setCitySuggestions([]);
  };

  // KP Sub Info for current seed number
  const selectedKpSub: KpSubEntry | undefined = useMemo(() => {
    if (mode === 'kp_seed' && kpSeedNumber >= 1 && kpSeedNumber <= 249) {
      return KP_249_TABLE[kpSeedNumber - 1];
    }
    return undefined;
  }, [mode, kpSeedNumber]);

  // Compute Horary Chart & Call AI
  const handleCastHorary = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!question.trim()) return;

    setIsCasting(true);
    setAiLoading(true);

    const params: HoraryQueryParams = {
      question: question.trim(),
      category,
      date,
      time,
      place,
      latitude,
      longitude,
      timezone,
      kpSeedNumber: mode === 'kp_seed' ? kpSeedNumber : undefined,
      mode,
      isUnknownBirthDetails,
    };

    // 1. Compute Astronomical & Tajika Prashna Chart
    const chart = generateHoraryKundali(params);
    setHoraryChart(chart);
    if (chart.kundali.vimshottariDasha.currentMahadasha) {
      setExpandedMahadasha(chart.kundali.vimshottariDasha.currentMahadasha.lord);
    }
    setIsCasting(false);

    // 2. Call AI Astrologer (Gemini) endpoint for deep reading
    try {
      const res = await fetch('/api/astrology/horary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ horaryData: chart }),
      });

      if (res.ok) {
        const data = await res.json();
        setHoraryChart((prev) => (prev ? { ...prev, aiInterpretation: data } : null));
      }
    } catch (err) {
      console.warn('AI Horary API failed, keeping algorithmic chart analysis:', err);
    } finally {
      setAiLoading(false);
    }
  };

  // Auto-cast on first mount
  useEffect(() => {
    handleCastHorary();
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Category Banner */}
      <div className="bg-gradient-to-br from-amber-100/60 via-white to-amber-100/60 border border-amber-200 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-950 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Prashna Shastra & KP Horary 249 Engine</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-amber-950 tracking-wide">
              Horary Astrology (प्रश्न कुण्डली)
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Formulate any burning question. The Horary engine erects an exact sidereal chart for the precise moment of inquiry, combining classical <em>Prashna Tantra</em>, Tajika Ithasala Yogas, and Krishnamurti Paddhati (KP) sub-divisions for unambiguous answers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button
              type="button"
              onClick={handleSetCurrentTime}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-amber-50 text-slate-750 border border-slate-300 text-xs font-bold flex items-center justify-center gap-2 transition-all hover:border-amber-400 shadow-2xs"
            >
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>Set to Exact Current Moment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Prashna Form */}
      <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-sm space-y-6">
        {/* Unknown Birth Details (Nashta Jataka Mode) Hero Card */}
        <div className={`p-4 rounded-xl border transition-all ${
          isUnknownBirthDetails
            ? 'bg-amber-50/80 border-amber-300 shadow-xs'
            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border ${
                  isUnknownBirthDetails
                    ? 'bg-amber-200/80 text-amber-950 border-amber-400'
                    : 'bg-slate-200 text-slate-700 border-slate-300'
                }`}>
                  {isUnknownBirthDetails ? 'Active: Nashta Jataka Mode' : 'Nashta Jataka / नष्ट जातक'}
                </span>
                <span className="text-xs font-bold text-slate-900">
                  Unknown Birth Date or Time?
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                In classical Vedic Jyotish, when the year, date, or exact time of birth is unknown, this horary chart cast at the query moment becomes your operative <strong>Janma Kundali</strong>. It calculates your <strong>Vimshottari Dasha</strong> timeline from the Moon&apos;s active nakshatra.
              </p>
            </div>
            <button
              type="button"
              onClick={handleToggleUnknownBirth}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                isUnknownBirthDetails
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs font-bold'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-amber-400'
              }`}
            >
              {isUnknownBirthDetails ? '✓ Unknown Birth Mode Active' : 'Enable Unknown Birth Mode'}
            </button>
          </div>
        </div>

        <form onSubmit={handleCastHorary} className="space-y-5">
          {/* Question Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-serif font-bold text-amber-950 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-700" />
                <span>Your Specific Question (Prashna)</span>
              </label>
              <span className="text-xs text-slate-500 font-medium">Be clear, sincere & focused on one matter</span>
            </div>
            <div className="relative">
              <input
                type="text"
                required
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your question (e.g. Will I get the new employment contract this month?)..."
                className="w-full bg-white border-2 border-slate-300 focus:border-amber-500 rounded-xl px-4 py-3.5 text-slate-900 placeholder-slate-400 text-sm sm:text-base transition-all shadow-xs"
              />
            </div>

            {/* Quick Sample Questions - Dynamic based on unknown birth mode */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-bold">
                  {isUnknownBirthDetails ? 'Recommended Questions for Unknown Birth & Life Guidance:' : 'Quick Category Suggestions:'}
                </span>
                {isUnknownBirthDetails && (
                  <span className="text-[11px] text-amber-800 font-bold">
                    Focused on Life Timeline & Dashas
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {(isUnknownBirthDetails ? UNKNOWN_BIRTH_SAMPLE_QUESTIONS : activeCategoryConfig.sampleQuestions).map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setQuestion(q)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-amber-50/60 hover:bg-amber-100/80 text-slate-700 hover:text-amber-950 border border-amber-200 hover:border-amber-400 transition-colors text-left font-medium"
                  >
                    &ldquo;{q}&rdquo;
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category & Calculation Mode Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {/* 1. Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-700" />
                <span>Query Domain (Karya Bhava)</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as HoraryCategory)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-none shadow-2xs"
              >
                {Object.entries(HORARY_CATEGORIES_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>
                    {cfg.title} (House {cfg.karyaHouse})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Horary Mode Toggle */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-700" />
                <span>Ascendant System</span>
              </label>
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 border border-slate-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => setMode('time_based')}
                  className={`py-1.5 text-xs font-medium rounded-md transition-all ${
                    mode === 'time_based'
                      ? 'bg-amber-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Time-Based
                </button>
                <button
                  type="button"
                  onClick={() => setMode('kp_seed')}
                  className={`py-1.5 text-xs font-medium rounded-md transition-all ${
                    mode === 'kp_seed'
                      ? 'bg-amber-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  KP Seed (1-249)
                </button>
              </div>
            </div>

            {/* 3. KP Number or Query Date */}
            {mode === 'kp_seed' ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    KP Horary Number (1 - 249)
                  </label>
                  <button
                    type="button"
                    onClick={() => setKpSeedNumber(Math.floor(Math.random() * 249) + 1)}
                    className="text-[11px] text-amber-700 hover:text-amber-800 underline font-medium"
                  >
                    Random Seed
                  </button>
                </div>
                <input
                  type="number"
                  min={1}
                  max={249}
                  value={kpSeedNumber}
                  onChange={(e) => setKpSeedNumber(Math.min(249, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-amber-900 font-bold focus:border-amber-500 focus:outline-none shadow-2xs"
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-700" />
                  <span>Query Date</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:border-amber-500 focus:outline-none cursor-pointer shadow-2xs"
                />
              </div>
            )}

            {/* 4. Query Time */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>Query Time (HH:MM)</span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:border-amber-500 focus:outline-none cursor-pointer shadow-2xs"
              />
            </div>
          </div>

          {/* Place & Coordinates Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5 relative">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-700" />
                  <span>Place of Query (Location)</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowAdvancedCoords(!showAdvancedCoords)}
                  className="text-[11px] text-amber-700 hover:text-amber-800 flex items-center gap-1 font-medium"
                >
                  <Sliders className="w-3 h-3" />
                  <span>{showAdvancedCoords ? 'Hide Lat/Lon' : 'Coordinates'}</span>
                </button>
              </div>
              <input
                type="text"
                value={citySearch || place}
                onChange={(e) => {
                  handleCitySearch(e.target.value);
                  setPlace(e.target.value);
                }}
                placeholder="Search city (e.g. New Delhi, Mumbai, London)..."
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:border-amber-500 focus:outline-none shadow-2xs"
              />

              {citySuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-amber-300 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto">
                  {citySuggestions.map((c, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectCity(c)}
                      className="w-full text-left px-3 py-2 hover:bg-amber-50 border-b border-slate-100 last:border-0 text-xs flex items-center justify-between text-slate-700"
                    >
                      <span className="font-semibold text-amber-900">{c.city}, {c.country}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {c.latitude.toFixed(2)}°, {c.longitude.toFixed(2)}°
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* KP Sub details preview badge */}
            <div className="flex items-center bg-amber-50/50 p-3 rounded-lg border border-amber-200 text-xs">
              {mode === 'kp_seed' && selectedKpSub ? (
                <div className="space-y-0.5 text-slate-700 w-full">
                  <div className="flex justify-between items-center text-amber-900 font-semibold text-[11px]">
                    <span>KP Seed #{selectedKpSub.seedNumber}: {selectedKpSub.sign}</span>
                    <span>{selectedKpSub.startDegStr}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 flex gap-2">
                    <span>Sign Lord: <strong>{selectedKpSub.signLord}</strong></span>
                    <span>•</span>
                    <span>Star Lord: <strong>{selectedKpSub.starLord}</strong></span>
                    <span>•</span>
                    <span className="text-amber-800">Sub Lord: <strong>{selectedKpSub.subLord}</strong></span>
                  </div>
                </div>
              ) : (
                <div className="space-y-0.5 text-slate-600 text-xs">
                  <div className="text-slate-800 font-medium">Standard Classical Prashna Lagna</div>
                  <div>Calculated for exact local sidereal time at query coordinates.</div>
                </div>
              )}
            </div>
          </div>

          {/* Optional Coordinates Drawer */}
          {showAdvancedCoords && (
            <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <label className="text-[10px] text-slate-600 uppercase font-bold block mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={latitude}
                  onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-600 uppercase font-bold block mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={longitude}
                  onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-600 uppercase font-bold block mb-1">Timezone (Offset)</label>
                <input
                  type="number"
                  step="0.25"
                  value={timezone}
                  onChange={(e) => setTimezone(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-mono"
                />
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200">
            <div className="text-xs text-slate-500">
              Rule of Prashna: <em>Ask with deep faith and single-minded focus for accurate celestial reflection.</em>
            </div>
            <button
              type="submit"
              disabled={isCasting || aiLoading}
              className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md shadow-amber-600/20 flex items-center gap-2.5 transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {aiLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Consulting Horary AI Pandit...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Cast Horary Chart & Consult AI</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Horary Chart & AI Interpretation Output */}
      {horaryChart && (
        <div className="space-y-8 animate-fadeIn">
          {/* Hero Verdict Card */}
          <div className="bg-white border-2 border-amber-300 rounded-2xl p-6 sm:p-8 shadow-md space-y-6 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Prashna Tantra Verdict
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
                  {horaryChart.aiInterpretation?.verdictTitle || horaryChart.analysis.verdict}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Inquiry: &ldquo;{horaryChart.queryParams.question}&rdquo;
                </p>
              </div>

              {/* Verdict Badge */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-slate-500 font-medium">Confidence Score</div>
                  <div className="text-2xl font-bold font-mono text-amber-900">
                    {horaryChart.analysis.confidenceScore}%
                  </div>
                </div>
                <div
                  className={`px-4 py-2.5 rounded-xl font-bold text-sm uppercase tracking-wide border shadow-xs ${
                    horaryChart.analysis.confidenceScore >= 60
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                      : horaryChart.analysis.confidenceScore >= 45
                      ? 'bg-amber-50 text-amber-900 border-amber-300'
                      : 'bg-rose-50 text-rose-900 border-rose-300'
                  }`}
                >
                  {horaryChart.aiInterpretation?.verdictBadge || horaryChart.analysis.verdict.split('(')[0]}
                </div>
              </div>
            </div>

            {/* Direct Answer & Astrological Synthesis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>Direct Astrological Resolution</span>
                  </h3>
                  <p className="text-sm text-slate-800 leading-relaxed font-sans">
                    {horaryChart.aiInterpretation?.directAnswer || (
                      `The Horary chart indicates a ${horaryChart.analysis.verdict.toLowerCase()} outcome for your query. Lagna Lord ${horaryChart.analysis.lagnaLord} and House ${horaryChart.analysis.karyaHouse} Lord ${horaryChart.analysis.karyaSignificatorPlanet} demonstrate ${horaryChart.analysis.confidenceScore >= 60 ? 'strong constructive affinity' : 'moderate friction requiring conscious intervention'}.`
                    )}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                    <span>Astrological Basis & Tajika Planetary Yogas</span>
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans">
                    {horaryChart.aiInterpretation?.astrologicalBasis || horaryChart.analysis.astrologicalSummary}
                  </p>

                  {/* Formed Yogas Pills */}
                  {horaryChart.analysis.tajikaYogas.length > 0 && (
                    <div className="pt-2 space-y-2">
                      <span className="text-[11px] font-bold text-amber-900 block">Active Prashna Yogas:</span>
                      <div className="flex flex-wrap gap-2">
                        {horaryChart.analysis.tajikaYogas.map((yoga, yIdx) => (
                          <div
                            key={yIdx}
                            className={`p-2.5 rounded-lg border text-xs space-y-1 ${
                              yoga.type === 'benefic'
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                                : yoga.type === 'malefic'
                                ? 'bg-rose-50 border-rose-300 text-rose-950'
                                : 'bg-white border-slate-200 text-slate-800'
                            }`}
                          >
                            <div className="font-bold text-amber-950 flex items-center gap-1.5">
                              <span>✦</span>
                              <span>{yoga.name}</span>
                            </div>
                            <div className="text-[11px] text-slate-600 leading-normal">
                              {yoga.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar: Timing & Significators */}
              <div className="space-y-4">
                {/* Timing (Phala Kala) */}
                <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl space-y-1.5">
                  <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>Estimated Timing of Event (Phala Kala)</span>
                  </span>
                  <p className="text-xs text-slate-800 font-medium">
                    {horaryChart.aiInterpretation?.timingEstimate || horaryChart.analysis.phalaKalaTiming}
                  </p>
                </div>

                {/* Key Astrological Coordinates */}
                <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-2.5 text-xs shadow-2xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                    Horary Coordinates
                  </span>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Prashna Lagna</span>
                    <strong className="text-amber-950 font-mono">
                      {horaryChart.kundali.planets.Ascendant.sign} ({horaryChart.kundali.planets.Ascendant.degrees.toFixed(1)}°)
                    </strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Lagnesha (Querent)</span>
                    <strong className="text-slate-800 font-mono">
                      {horaryChart.analysis.lagnaLord} (H{horaryChart.kundali.planets[horaryChart.analysis.lagnaLord]?.house})
                    </strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Karya House (Matter)</span>
                    <strong className="text-amber-950 font-mono">
                      House {horaryChart.analysis.karyaHouse} ({horaryChart.analysis.karyaSignificatorPlanet})
                    </strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Chandra (Moon)</span>
                    <strong className="text-slate-800 font-mono">
                      {horaryChart.kundali.planets.Moon.sign} / {horaryChart.analysis.moonNakshatra}
                    </strong>
                  </div>
                  {horaryChart.kpDetails && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">KP Sub-Lord</span>
                      <strong className="text-amber-950 font-mono">
                        {horaryChart.kpDetails.subLord} (Seed #{horaryChart.kpDetails.seedNumber})
                      </strong>
                    </div>
                  )}
                </div>

                {/* Remedial Measure */}
                <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl space-y-1.5 text-xs">
                  <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>Prescribed Vedic Remedy</span>
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    {horaryChart.aiInterpretation?.remedies || horaryChart.analysis.remedy}
                  </p>
                </div>
              </div>
            </div>

            {/* Actionable Advice */}
            {horaryChart.aiInterpretation?.actionableAdvice && (
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-950 block">
                  Actionable Astrological Recommendations
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {horaryChart.aiInterpretation.actionableAdvice.map((adv, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{adv}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Prashna Vimshottari Dasha (विंशोत्तरी दशा) - Complete Cycle & Analysis */}
          {horaryChart.kundali.vimshottariDasha && (
            <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-sm space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-100 border border-amber-300 text-amber-950">
                      Vimshottari Dasha Engine
                    </span>
                    {isUnknownBirthDetails && (
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-100 border border-emerald-300 text-emerald-950 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Nashta Jataka Operative</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-serif font-bold text-amber-950 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-700" />
                    <span>Prashna Vimshottari Dasha (विंशोत्तरी दशा)</span>
                  </h3>
                  <p className="text-xs text-slate-600">
                    120-Year Parashari planetary timeline calculated from Chandra in{' '}
                    <strong className="text-amber-900">{horaryChart.kundali.planets.Moon.nakshatra}</strong>{' '}
                    (Pada {horaryChart.kundali.planets.Moon.pada}, Lord:{' '}
                    <strong className="text-slate-800">{horaryChart.kundali.planets.Moon.nakshatraLord}</strong>) at query time.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 font-medium">Balance at Query:</span>
                  <span className="px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 font-mono text-xs font-bold">
                    {horaryChart.kundali.vimshottariDasha.balanceAtBirthYears.toFixed(2)} Yrs of {horaryChart.kundali.vimshottariDasha.birthBalanceLord}
                  </span>
                </div>
              </div>

              {/* Active Dasha Hero Card */}
              {horaryChart.kundali.vimshottariDasha.currentMahadasha && (
                (() => {
                  const md = horaryChart.kundali.vimshottariDasha.currentMahadasha;
                  const ad = horaryChart.kundali.vimshottariDasha.currentAntardasha;
                  const mdTheme = DASHA_PLANET_THEMES[md.lord] || DASHA_PLANET_THEMES.Jupiter;
                  const adTheme = ad ? DASHA_PLANET_THEMES[ad.lord] || DASHA_PLANET_THEMES.Saturn : mdTheme;
                  const progress = calculateDashaProgress(md.startDate, md.endDate);

                  return (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Running Mahadasha (Major Period) */}
                        <div className={`p-5 rounded-xl border ${mdTheme.bg} ${mdTheme.border} relative overflow-hidden space-y-3 shadow-2xs`}>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                              <Star className="w-3.5 h-3.5 text-amber-700" />
                              <span>Active Mahadasha (Major Lord)</span>
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${mdTheme.badge}`}>
                              {md.durationYears} Years
                            </span>
                          </div>

                          <div className="flex items-baseline gap-2">
                            <span className={`text-2xl font-serif font-bold ${mdTheme.text}`}>
                              {md.lord}
                            </span>
                            <span className="text-sm font-medium text-slate-600">
                              ({SANSKRIT_PLANETS[md.lord as PlanetName] || md.lord})
                            </span>
                          </div>

                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between text-slate-700">
                              <span>Period Span:</span>
                              <strong className="font-mono text-slate-900">
                                {md.startDate} &rarr; {md.endDate}
                              </strong>
                            </div>
                            <div className="text-[11px] text-slate-600 leading-relaxed pt-1">
                              <strong>Significations:</strong> {mdTheme.meaning}
                            </div>
                          </div>
                        </div>

                        {/* Running Antardasha (Sub-Period / Bhukti) */}
                        {ad && (
                          <div className={`p-5 rounded-xl border ${adTheme.bg} ${adTheme.border} relative overflow-hidden space-y-3 shadow-2xs`}>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                                <span>Active Antardasha (Bhukti / Sub-Period)</span>
                              </span>
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${adTheme.badge}`}>
                                {getDurationMonths(ad.startDate, ad.endDate)} Months
                              </span>
                            </div>

                            <div className="flex items-baseline gap-2">
                              <span className={`text-2xl font-serif font-bold ${adTheme.text}`}>
                                {ad.lord}
                              </span>
                              <span className="text-sm font-medium text-slate-600">
                                ({SANSKRIT_PLANETS[ad.lord as PlanetName] || ad.lord})
                              </span>
                            </div>

                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between text-slate-700">
                                <span>Sub-Period Span:</span>
                                <strong className="font-mono text-slate-900">
                                  {ad.startDate} &rarr; {ad.endDate}
                                </strong>
                              </div>
                              <div className="text-[11px] text-slate-600 leading-relaxed pt-1">
                                <strong>Significations:</strong> {adTheme.meaning}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Mahadasha Progress Bar */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-700 font-medium flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-700" />
                            <span>Current Mahadasha Elapsed Time</span>
                          </span>
                          <span className="text-amber-900 font-mono font-bold">{progress}% Complete</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${mdTheme.bar} transition-all duration-500 rounded-full`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                          <span>Start: {md.startDate}</span>
                          <span>End: {md.endDate}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()
              )}

              {/* AI Astrologer Dasha Synthesis (if generated) */}
              {horaryChart.aiInterpretation?.dashaAnalysis && (
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                  <div className="flex items-center gap-2 text-amber-950 font-serif font-bold text-sm">
                    <Sparkles className="w-4 h-4 text-amber-700" />
                    <span>AI Astrologer Dasha Analysis & Timing Synthesis</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans">
                    {horaryChart.aiInterpretation.dashaAnalysis}
                  </p>
                </div>
              )}

              {/* Complete 120-Year 9-Mahadasha & Antardasha Timeline Explorer */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-700" />
                    <span>Complete 120-Year Vimshottari Cycle (Click to Inspect Antardashas)</span>
                  </span>
                  <span className="text-[11px] text-slate-500">
                    9 Mahadashas &bull; 81 Sub-Periods
                  </span>
                </div>

                <div className="space-y-2">
                  {horaryChart.kundali.vimshottariDasha.allMahadashas.map((md, idx) => {
                    const theme = DASHA_PLANET_THEMES[md.lord] || DASHA_PLANET_THEMES.Jupiter;
                    const isExpanded = expandedMahadasha === md.lord;
                    const isCurrent = md.isCurrent || (horaryChart.kundali.vimshottariDasha.currentMahadasha?.lord === md.lord);

                    return (
                      <div
                        key={idx}
                        className={`rounded-xl border transition-all ${
                          isCurrent
                            ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                            : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {/* Mahadasha Row Button */}
                        <button
                          type="button"
                          onClick={() => setExpandedMahadasha(isExpanded ? null : md.lord)}
                          className="w-full p-3.5 flex flex-wrap items-center justify-between gap-3 text-left transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border ${theme.badge}`}>
                              {md.lord.slice(0, 2)}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`font-serif font-bold text-sm ${theme.text}`}>
                                  {md.lord} Mahadasha
                                </span>
                                <span className="text-xs text-slate-500">
                                  ({SANSKRIT_PLANETS[md.lord as PlanetName] || md.lord})
                                </span>
                                {isCurrent && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-600 text-white">
                                    Running Now
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-slate-500">
                                Duration: {md.durationYears} Years
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right text-xs">
                              <div className="font-mono text-slate-800 font-medium">
                                {md.startDate} &rarr; {md.endDate}
                              </div>
                              <span className="text-[11px] text-slate-500">
                                {md.subDashas ? `${md.subDashas.length} Sub-Periods` : 'Antardashas'}
                              </span>
                            </div>
                            <div className="text-slate-500">
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-amber-700" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </div>
                          </div>
                        </button>

                        {/* Expanded Antardashas (Sub-Periods) */}
                        {isExpanded && md.subDashas && md.subDashas.length > 0 && (
                          <div className="p-3.5 pt-0 border-t border-slate-200 mt-1">
                            <div className="text-[11px] font-bold text-amber-950 mb-2 flex items-center justify-between">
                              <span>{md.lord} Mahadasha &mdash; All 9 Antardashas (Bhuktis):</span>
                              <span className="text-slate-500 font-normal">Calculated in Parashari order</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              {md.subDashas.map((ad, adIdx) => {
                                const adTheme = DASHA_PLANET_THEMES[ad.lord] || DASHA_PLANET_THEMES.Saturn;
                                const isSubCurrent = ad.isCurrent;

                                return (
                                  <div
                                    key={adIdx}
                                    className={`p-2.5 rounded-lg border text-xs transition-all ${
                                      isSubCurrent
                                        ? 'bg-amber-100/70 border-amber-400 shadow-xs'
                                        : 'bg-white border-slate-200 hover:border-slate-300'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between mb-1">
                                      <span className={`font-serif font-bold ${adTheme.text}`}>
                                        {md.lord} - {ad.lord}
                                      </span>
                                      {isSubCurrent && (
                                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-600 text-white">
                                          Active Sub
                                        </span>
                                      )}
                                    </div>
                                    <div className="font-mono text-[11px] text-slate-800">
                                      {ad.startDate} &rarr; {ad.endDate}
                                    </div>
                                    <div className="text-[10px] text-slate-500 mt-0.5">
                                      {getDurationMonths(ad.startDate, ad.endDate)} Months &bull; {SANSKRIT_PLANETS[ad.lord as PlanetName] || ad.lord}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Classical Reference / Nashta Jataka Callout */}
              <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1.5 text-xs">
                <span className="text-amber-950 font-bold flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                  <span>Classical Vedic Authority on Prashna Vimshottari Dasha (Nashta Jataka)</span>
                </span>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  According to ancient authorities including <em>Prashna Marga (Ch. 14)</em> and <em>Daivajna Vallabha</em>, when a querent does not possess their birth certificate or exact time of birth, the cosmic alignment at the moment of genuine divine inquiry becomes their operative <strong>Janma Kundali</strong>. The Moon&apos;s Nakshatra at that instant accurately activates the 120-year <strong>Vimshottari Dasha</strong> sequence, guiding life milestones, career peaks, relationships, and health remedies.
                </p>
              </div>
            </div>
          )}

          {/* Horary Graphic Kundali Chart */}
          <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-serif font-bold text-amber-950 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-700" />
                  <span>Prashna Kundali (Celestial Chart of Query Moment)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time sidereal snapshot calculated with Chitrapaksha Lahiri Ayanamsha.
                </p>
              </div>

              {/* North / South Style Toggle */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => setChartFormat('north')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                    chartFormat === 'north'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  North Indian
                </button>
                <button
                  type="button"
                  onClick={() => setChartFormat('south')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                    chartFormat === 'south'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  South Indian
                </button>
              </div>
            </div>

            <div className="flex justify-center py-2">
              {chartFormat === 'north' ? (
                <NorthIndianChart
                  chartTitle="Prashna Kundali (D-1)"
                  lagnaSignIndex={horaryChart.kundali.planets.Ascendant.signIndex}
                  planets={horaryChart.kundali.planets}
                  outerPlanets={horaryChart.kundali.outerPlanets}
                />
              ) : (
                <SouthIndianChart
                  chartTitle="Prashna Kundali (D-1)"
                  lagnaSignIndex={horaryChart.kundali.planets.Ascendant.signIndex}
                  planets={horaryChart.kundali.planets}
                  outerPlanets={horaryChart.kundali.outerPlanets}
                />
              )}
            </div>
          </div>

          {/* Horary Graha Spashta Planetary Positions */}
          <PlanetaryTable
            planets={horaryChart.kundali.planets}
            outerPlanets={horaryChart.kundali.outerPlanets}
          />
        </div>
      )}
    </div>
  );
};
