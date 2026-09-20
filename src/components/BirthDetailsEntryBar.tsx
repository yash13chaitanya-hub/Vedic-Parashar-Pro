import React, { useState, useEffect } from 'react';
import { BirthDetails, KundaliData } from '../types';
import { POPULAR_CITIES, CityLocation } from '../lib/cityData';
import { ActiveTab } from './Navbar';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Check,
  Compass,
  Sliders,
  PlusCircle
} from 'lucide-react';

interface BirthDetailsEntryBarProps {
  activeCategory: ActiveTab;
  currentProfile: BirthDetails;
  onSaveProfile: (profile: BirthDetails) => void;
  profiles: BirthDetails[];
  onSelectProfile: (profile: BirthDetails) => void;
  kundali: KundaliData;
  onOpenNewProfileModal?: () => void;
}

const CATEGORY_LABELS: Record<ActiveTab, { title: string; hint: string }> = {
  'daily-horoscope': {
    title: 'Daily Horoscope Personalization',
    hint: 'Real-time Gochara transits calculated from your exact birth Moon sign, Nakshatra, and running Mahadasha.'
  },
  'astrosage-reports': {
    title: '100+ Free Reports & AstroSage Vedic Tools',
    hint: 'Mangal Dosh, Kaal Sarp Dosha, Lal Kitab (Teva, 9 Debts & Totke), Tajik Varshphal, Gemstones, and Life Predictions.'
  },
  'kundali-charts': {
    title: 'Kundali & Divisional Charts Engine',
    hint: 'Chitrapaksha Lahiri Ayanamsha sidereal placements for D-1 Lagna, D-9 Navamsha, and D-10 Dashamsha.'
  },
  'kp-astrology': {
    title: 'Krishnamurti Paddhati (KP Astrology) Engine',
    hint: 'Placidus cusps, sub-lord divisions, 4-fold house significators, Ruling Planets (RP), and BTR.'
  },
  'vimshottari-dasha': {
    title: '120-Year Vimshottari Dasha Engine',
    hint: 'Calculates exact Mahadasha, Antardasha, and Pratyantardasha balance down to the exact day of birth.'
  },
  'sade-sati-sav': {
    title: 'Shani Sade Sati & Ashtakavarga Engine',
    hint: 'Transit of Saturn over your natal Moon sign and Samudaya Ashtakavarga (SAV) points per house.'
  },
  'guna-milan': {
    title: 'Ashtakoot Guna Milan (36 Points)',
    hint: 'Partner 1 Vedic chart foundation for relationship compatibility, Nadi, and Mangal Dosha check.'
  },
  'horary-chart': {
    title: 'Horary (Prashna Shastra) & KP 249 Engine',
    hint: 'Real-time query moment snapshot, Tajika Ithasala/Nakta Yogas, and AI Prashna divination.'
  },
  'indian-languages': {
    title: 'Pan-Indian Astrological Languages & Traditions',
    hint: 'Explore Vedic astrology across 22 official Indian languages with easy and complex classical queries.'
  },
  'ai-pandit': {
    title: 'Vedic AI Pandit Jyotish Consultation',
    hint: 'Grounded in Maharishi ParasharaHora Shastra with your exact planetary degrees and yogas.'
  }
};

export const BirthDetailsEntryBar: React.FC<BirthDetailsEntryBarProps> = ({
  activeCategory,
  currentProfile,
  onSaveProfile,
  profiles,
  onSelectProfile,
  kundali,
  onOpenNewProfileModal
}) => {
  // Local form state initialized to currentProfile
  const [name, setName] = useState(currentProfile.name);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(currentProfile.gender);
  const [dateOfBirth, setDateOfBirth] = useState(currentProfile.dateOfBirth);
  const [timeOfBirth, setTimeOfBirth] = useState(currentProfile.timeOfBirth);
  const [placeOfBirth, setPlaceOfBirth] = useState(currentProfile.placeOfBirth);
  const [latitude, setLatitude] = useState<number>(currentProfile.latitude);
  const [longitude, setLongitude] = useState<number>(currentProfile.longitude);
  const [timezone, setTimezone] = useState<number>(currentProfile.timezone);
  const [isUnknownBirthDetails, setIsUnknownBirthDetails] = useState<boolean>(currentProfile.isUnknownBirthDetails || false);

  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [showCoords, setShowCoords] = useState<boolean>(false);
  const [searchCity, setSearchCity] = useState('');
  const [citySuggestions, setCitySuggestions] = useState<CityLocation[]>([]);
  const [savedFeedback, setSavedFeedback] = useState<boolean>(false);

  // Sync state when currentProfile changes externally
  useEffect(() => {
    setName(currentProfile.name);
    setGender(currentProfile.gender);
    setDateOfBirth(currentProfile.dateOfBirth);
    setTimeOfBirth(currentProfile.timeOfBirth);
    setPlaceOfBirth(currentProfile.placeOfBirth);
    setLatitude(currentProfile.latitude);
    setLongitude(currentProfile.longitude);
    setTimezone(currentProfile.timezone);
    setIsUnknownBirthDetails(currentProfile.isUnknownBirthDetails || false);
  }, [currentProfile.id, currentProfile.name, currentProfile.dateOfBirth, currentProfile.timeOfBirth, currentProfile.placeOfBirth, currentProfile.isUnknownBirthDetails]);

  const handleCitySearch = (query: string) => {
    setSearchCity(query);
    if (!query.trim()) {
      setCitySuggestions([]);
      return;
    }
    const filtered = POPULAR_CITIES.filter((c) =>
      c.city.toLowerCase().includes(query.toLowerCase()) ||
      c.country.toLowerCase().includes(query.toLowerCase())
    );
    setCitySuggestions(filtered.slice(0, 8));
  };

  const handleSelectCity = (c: CityLocation) => {
    const formatted = `${c.city}, ${c.country}`;
    setPlaceOfBirth(formatted);
    setLatitude(c.latitude);
    setLongitude(c.longitude);
    setTimezone(c.timezone);
    setSearchCity('');
    setCitySuggestions([]);
  };

  const handleToggleUnknownBirth = () => {
    const nextVal = !isUnknownBirthDetails;
    setIsUnknownBirthDetails(nextVal);
    if (nextVal) {
      const now = new Date();
      setDateOfBirth(now.toISOString().split('T')[0]);
      setTimeOfBirth(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
      if (!name.includes('(Prashna)')) {
        setName(name ? `${name} (Prashna)` : 'Seeker (Prashna)');
      }
    }
  };

  const handleApplyChanges = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) return;

    const updated: BirthDetails = {
      ...currentProfile,
      name: name.trim(),
      gender,
      dateOfBirth,
      timeOfBirth,
      placeOfBirth,
      latitude: Number(latitude),
      longitude: Number(longitude),
      timezone: Number(timezone),
      isUnknownBirthDetails,
    };

    onSaveProfile(updated);
    setSavedFeedback(true);
    setTimeout(() => {
      setSavedFeedback(false);
    }, 2500);
  };

  // Formatted date string helper
  const formattedBirthDate = (() => {
    try {
      const parts = dateOfBirth.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return d.toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
    } catch {
      // fallback
    }
    return dateOfBirth;
  })();

  const categoryMeta = CATEGORY_LABELS[activeCategory] || {
    title: 'Birth Details Entering Section',
    hint: 'Enter your birth date, time, and place of birth to calculate precision Vedic astrology.'
  };

  return (
    <section
      aria-label="Birth Date, Time and Place of Birth Entry Section"
      className="bg-white border border-amber-200/90 rounded-2xl shadow-sm p-4 sm:p-5 transition-all duration-300 relative overflow-hidden"
    >
      {/* Subtle Vedic Astrological background accent */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-orange-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-amber-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-100 border border-amber-300 text-amber-900">
            <Sparkles className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-serif font-bold text-amber-950 text-base sm:text-lg flex items-center gap-2">
                Birth Details & Astrological Basis
              </h2>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300 font-medium">
                {categoryMeta.title}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {categoryMeta.hint}
            </p>
          </div>
        </div>

        {/* Profile Switching Quick Pills & Collapse Toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Saved Profiles Pill Dropdown / List */}
          <div className="flex items-center gap-1.5 bg-amber-50/70 border border-amber-200 rounded-lg p-1">
            <span className="text-[11px] text-slate-600 px-1 font-semibold hidden sm:inline">Profile:</span>
            {profiles.slice(0, 3).map((p) => {
              const isSelected = p.id === currentProfile.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onSelectProfile(p)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-xs font-bold'
                      : 'text-slate-700 hover:text-amber-950 hover:bg-white'
                  }`}
                >
                  {p.name.split(' ')[0]}
                </button>
              );
            })}
            {onOpenNewProfileModal && (
              <button
                type="button"
                onClick={onOpenNewProfileModal}
                title="Create New Kundali Chart Profile"
                className="px-2 py-1 text-xs text-amber-800 hover:text-amber-950 hover:bg-amber-200/60 rounded-md transition-colors flex items-center gap-1 font-semibold"
              >
                <PlusCircle className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden md:inline">New</span>
              </button>
            )}
          </div>

          {/* Expand / Collapse Button */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-slate-700 hover:text-amber-950 text-xs font-medium transition-colors border border-amber-200"
            title={isExpanded ? 'Collapse Birth Details Form' : 'Expand Birth Details Form'}
          >
            <span>{isExpanded ? 'Collapse' : 'Edit Birth Details'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Collapsed State Quick Summary Bar */}
      {!isExpanded && (
        <div className="pt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-slate-700">
            <span className="font-serif font-bold text-amber-900 text-sm flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-700" />
              {currentProfile.name}
            </span>
            <span className="flex items-center gap-1 text-slate-800">
              <Calendar className="w-3.5 h-3.5 text-amber-700" />
              <strong className="text-slate-600">Birth Date:</strong> {formattedBirthDate}
            </span>
            <span className="flex items-center gap-1 text-slate-800">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <strong className="text-slate-600">Time:</strong> {currentProfile.timeOfBirth}
            </span>
            <span className="flex items-center gap-1 text-slate-800">
              <MapPin className="w-3.5 h-3.5 text-amber-700" />
              <strong className="text-slate-600">Place:</strong> {currentProfile.placeOfBirth}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-950 text-[11px] font-mono font-semibold">
              Lagna: {kundali.planets.Ascendant.sign} ({kundali.planets.Ascendant.degrees.toFixed(1)}°)
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-100 border border-amber-300 text-amber-950 text-[11px] font-mono font-semibold">
              Moon: {kundali.planets.Moon.sign} / {kundali.planets.Moon.nakshatra}
            </span>
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="text-xs text-amber-800 hover:text-amber-950 underline font-bold ml-1"
            >
              Change Details
            </button>
          </div>
        </div>
      )}

      {/* Expanded Interactive Entry Section */}
      {isExpanded && (
        <form onSubmit={handleApplyChanges} className="pt-4 space-y-4">
          {/* Unknown Birth Details Banner (Nashta Jataka Mode) */}
          <div className="p-3 bg-amber-50/90 border border-amber-300 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-amber-950 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Unknown Birth Year, Date, or Time? (Nashta Jataka Mode / नष्ट जातक)</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-normal">
                If the birth date or time is unknown, Vedic astrology erects your operative chart from the query moment. The Moon&apos;s nakshatra calculates your active <strong className="text-amber-950 font-semibold">Vimshottari Dasha</strong> timeline.
              </p>
            </div>
            <button
              type="button"
              onClick={handleToggleUnknownBirth}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs shrink-0 transition-all border ${
                isUnknownBirthDetails
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                  : 'bg-white text-slate-700 border-amber-300 hover:bg-amber-100/60'
              }`}
            >
              {isUnknownBirthDetails ? '✓ Unknown Birth Mode Active' : 'Set to Current Moment (Prashna)'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* 1. Name & Gender */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-amber-700" />
                  Full Name
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="text-[11px] bg-white text-slate-800 border border-slate-300 rounded px-1.5 py-0.5 focus:outline-none focus:border-amber-500 font-medium"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Full Name"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-400 transition-colors shadow-2xs"
              />
            </div>

            {/* 2. Birth Date */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-700" />
                  {isUnknownBirthDetails ? 'Chart / Query Date' : 'Birth Date'}
                </label>
                <span className="text-[11px] text-amber-900 font-mono font-semibold">
                  {formattedBirthDate}
                </span>
              </div>
              <input
                type="date"
                required
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-400 transition-colors cursor-pointer shadow-2xs"
              />
            </div>

            {/* 3. Birth Time */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  {isUnknownBirthDetails ? 'Chart / Query Time' : 'Birth Time (HH:MM)'}
                </label>
                <span className="text-[11px] text-slate-500">24-Hr Sidereal</span>
              </div>
              <input
                type="time"
                required
                value={timeOfBirth}
                onChange={(e) => setTimeOfBirth(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-400 transition-colors cursor-pointer shadow-2xs"
              />
            </div>

            {/* 4. Place of Birth */}
            <div className="space-y-1 relative">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-700" />
                  Place of Birth
                </label>
                <button
                  type="button"
                  onClick={() => setShowCoords(!showCoords)}
                  className="text-[11px] text-amber-800 hover:text-amber-950 font-semibold flex items-center gap-0.5 transition-colors"
                >
                  <Sliders className="w-3 h-3" />
                  <span>{showCoords ? 'Hide Lat/Lon' : 'Coordinates'}</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search city (e.g. Delhi, Mumbai, Varanasi)..."
                  value={searchCity || placeOfBirth}
                  onChange={(e) => {
                    handleCitySearch(e.target.value);
                    setPlaceOfBirth(e.target.value);
                  }}
                  onFocus={() => {
                    if (!searchCity) handleCitySearch(placeOfBirth.split(',')[0]);
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-400 transition-colors shadow-2xs"
                />

                {citySuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-amber-300 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto">
                    {citySuggestions.map((c, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectCity(c)}
                        className="w-full text-left px-3 py-2 hover:bg-amber-50 border-b border-amber-100 last:border-0 text-xs flex items-center justify-between text-slate-800 transition-colors"
                      >
                        <span className="font-bold text-amber-950">{c.city}, {c.country}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {c.latitude.toFixed(2)}°, {c.longitude.toFixed(2)}° (UTC{c.timezone >= 0 ? `+${c.timezone}` : c.timezone})
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Optional Advanced Coordinates & Timezone Drawer */}
          {showCoords && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-amber-50/70 p-3 rounded-xl border border-amber-200 text-xs animate-fadeIn">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1">
                  Latitude (° North / South)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={latitude}
                  onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono text-amber-950 font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1">
                  Longitude (° East / West)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={longitude}
                  onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono text-amber-950 font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1">
                  Timezone (Hours offset from UTC)
                </label>
                <input
                  type="number"
                  step="0.25"
                  value={timezone}
                  onChange={(e) => setTimezone(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono text-amber-950 font-semibold"
                />
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-amber-100">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Compass className="w-3.5 h-3.5 text-amber-700" />
              <span>Current Chart:</span>
              <strong className="text-amber-950 font-mono font-bold">
                {kundali.planets.Ascendant.sign} Lagna ({kundali.planets.Ascendant.degrees.toFixed(2)}°)
              </strong>
              <span>•</span>
              <strong className="text-amber-950 font-mono font-bold">
                {kundali.planets.Moon.sign} Moon ({kundali.planets.Moon.nakshatra} Pada {kundali.planets.Moon.pada})
              </strong>
            </div>

            <div className="flex items-center gap-3">
              {savedFeedback && (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 animate-pulse">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Kundali & Horoscopes Recalculated!
                </span>
              )}
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${savedFeedback ? 'animate-spin' : ''}`} />
                <span>Apply & Recalculate Chart</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </section>
  );
};
