import React, { useState } from 'react';
import { BirthDetails, KundaliData, KundaliMilanResult } from '../types';
import { calculateGunaMilan, generateKundali } from '../lib/vedicCalculations';
import { POPULAR_CITIES, CityLocation } from '../lib/cityData';
import { Heart, Sparkles, ShieldAlert, CheckCircle2, Award, User, Calendar, Clock, MapPin } from 'lucide-react';

interface MatchmakingViewProps {
  currentKundali: KundaliData;
  allProfiles: BirthDetails[];
}

export const MatchmakingView: React.FC<MatchmakingViewProps> = ({ currentKundali, allProfiles }) => {
  const [partnerDetails, setPartnerDetails] = useState<BirthDetails>({
    id: 'partner-temp',
    name: 'Priya Sharma',
    gender: 'female',
    dateOfBirth: '1994-11-20',
    timeOfBirth: '14:15',
    placeOfBirth: 'New Delhi, India',
    latitude: 28.6139,
    longitude: 77.2090,
    timezone: 5.5,
  });

  const [partnerCitySearch, setPartnerCitySearch] = useState('');
  const [citySuggestions, setCitySuggestions] = useState<CityLocation[]>([]);

  const handlePartnerCitySearch = (query: string) => {
    setPartnerCitySearch(query);
    if (!query.trim()) {
      setCitySuggestions([]);
      return;
    }
    const matches = POPULAR_CITIES.filter((c) =>
      c.city.toLowerCase().includes(query.toLowerCase()) ||
      c.country.toLowerCase().includes(query.toLowerCase())
    );
    setCitySuggestions(matches.slice(0, 6));
  };

  const handleSelectPartnerCity = (c: CityLocation) => {
    setPartnerDetails((prev) => ({
      ...prev,
      placeOfBirth: `${c.city}, ${c.country}`,
      latitude: c.latitude,
      longitude: c.longitude,
      timezone: c.timezone,
    }));
    setPartnerCitySearch('');
    setCitySuggestions([]);
  };

  const partnerKundali = generateKundali(partnerDetails);
  const result: KundaliMilanResult = calculateGunaMilan(currentKundali, partnerKundali);

  const getVerdictBadge = (verdict: KundaliMilanResult['verdict']) => {
    switch (verdict) {
      case 'Excellent':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold';
      case 'Good':
        return 'bg-teal-100 text-teal-900 border-teal-300 font-bold';
      case 'Average':
        return 'bg-amber-100 text-amber-950 border-amber-300 font-bold';
      default:
        return 'bg-rose-100 text-rose-900 border-rose-300 font-bold';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Heart className="w-5 h-5 text-rose-600" />
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            Ashtakoot Guna Milan
          </span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-amber-950">
          Vedic Relationship & Marriage Compatibility (36 Gunas)
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
          Based on Sage Parashara&apos;s classical 8 Kootas comparing Moon Nakshatras and Lagna placements. 18+ points is acceptable, 28+ is exceptionally auspicious.
        </p>
      </div>

      {/* Two Profiles Comparison Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Profile 1 (Current User) */}
        <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-amber-100">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-amber-700" />
                <span className="font-serif font-bold text-amber-950">Partner 1 (Current Chart)</span>
              </div>
              <span className="text-xs text-amber-800 font-bold">{currentKundali.birthDetails.name}</span>
            </div>

            <div className="space-y-2 text-xs mb-3">
              <div className="flex items-center justify-between text-slate-700">
                <span className="text-slate-500 flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-amber-700" /> Birth Date:
                </span>
                <strong className="text-slate-900">{currentKundali.birthDetails.dateOfBirth}</strong>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="text-slate-500 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-700" /> Birth Time:
                </span>
                <strong className="text-slate-900">{currentKundali.birthDetails.timeOfBirth}</strong>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="text-slate-500 flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-amber-700" /> Place:
                </span>
                <strong className="text-slate-900">{currentKundali.birthDetails.placeOfBirth}</strong>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-amber-100 bg-amber-50/50 p-3 rounded-xl">
            <div>
              <span className="text-slate-500 block text-[11px] font-medium">Moon Sign:</span>
              <strong className="text-amber-950 font-bold">{currentKundali.planets.Moon.sign}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] font-medium">Nakshatra:</span>
              <strong className="text-amber-950 font-bold">{currentKundali.planets.Moon.nakshatra} (Pada {currentKundali.planets.Moon.pada})</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] font-medium">Ascendant:</span>
              <strong className="text-slate-800 font-bold">{currentKundali.planets.Ascendant.sign}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] font-medium">Mangal (Mars):</span>
              <strong className="text-amber-800 font-bold">House {currentKundali.planets.Mars.house}</strong>
            </div>
          </div>
        </div>

        {/* Profile 2 (Partner with full Birth Date, Time & Place Entering Section) */}
        <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-rose-600" />
              <span className="font-serif font-bold text-amber-950">Partner 2 Birth Details</span>
            </div>
            <span className="text-xs text-amber-800 font-bold">Enter Details</span>
          </div>

          <div className="space-y-2.5 mb-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-600 block mb-0.5 font-bold">Full Name</label>
                <input
                  type="text"
                  value={partnerDetails.name}
                  onChange={(e) => setPartnerDetails({ ...partnerDetails, name: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-slate-600 block mb-0.5 font-bold">Gender</label>
                <select
                  value={partnerDetails.gender}
                  onChange={(e) => setPartnerDetails({ ...partnerDetails, gender: e.target.value as any })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-600 block mb-0.5 font-bold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-700" /> Birth Date
                </label>
                <input
                  type="date"
                  value={partnerDetails.dateOfBirth}
                  onChange={(e) => setPartnerDetails({ ...partnerDetails, dateOfBirth: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-slate-600 block mb-0.5 font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-700" /> Birth Time
                </label>
                <input
                  type="time"
                  value={partnerDetails.timeOfBirth}
                  onChange={(e) => setPartnerDetails({ ...partnerDetails, timeOfBirth: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-slate-600 block mb-0.5 font-bold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-700" /> Place of Birth
              </label>
              <input
                type="text"
                placeholder="Search or enter city..."
                value={partnerCitySearch || partnerDetails.placeOfBirth}
                onChange={(e) => {
                  handlePartnerCitySearch(e.target.value);
                  setPartnerDetails({ ...partnerDetails, placeOfBirth: e.target.value });
                }}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
              />
              {citySuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-amber-300 rounded-xl shadow-lg z-50 max-h-40 overflow-y-auto">
                  {citySuggestions.map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectPartnerCity(c)}
                      className="w-full text-left px-3 py-2 hover:bg-amber-50 border-b border-slate-100 last:border-0 text-xs flex justify-between text-slate-800"
                    >
                      <span className="text-amber-950 font-bold">{c.city}, {c.country}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{c.latitude.toFixed(1)}°, {c.longitude.toFixed(1)}°</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-amber-100 bg-amber-50/50 p-3 rounded-xl">
            <div>
              <span className="text-slate-500 block text-[11px] font-medium">Moon Sign:</span>
              <strong className="text-rose-900 font-bold">{partnerKundali.planets.Moon.sign}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] font-medium">Nakshatra:</span>
              <strong className="text-rose-900 font-bold">{partnerKundali.planets.Moon.nakshatra} (Pada {partnerKundali.planets.Moon.pada})</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] font-medium">Ascendant:</span>
              <strong className="text-slate-800 font-bold">{partnerKundali.planets.Ascendant.sign}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] font-medium">Mangal (Mars):</span>
              <strong className="text-amber-800 font-bold">House {partnerKundali.planets.Mars.house}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Score Badge */}
      <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-amber-50 border-2 border-amber-400 flex flex-col items-center justify-center text-center shadow-xs">
            <span className="text-2xl font-bold font-serif text-amber-950">{result.totalScore}</span>
            <span className="text-[10px] text-amber-900 font-bold uppercase tracking-wider">/ 36 Gunas</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-3 py-0.5 text-xs font-bold rounded-full border ${getVerdictBadge(result.verdict)}`}>
                {result.verdict} Match
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {result.totalScore >= 18 ? 'Favorable for long-term union' : 'Astrological remedies advised'}
              </span>
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-900">
              {result.maleName} & {result.femaleName}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              {result.totalScore >= 28
                ? 'Exceptionally harmonious match with high spiritual, physical, and intellectual synchronization.'
                : result.totalScore >= 18
                ? 'Good overall balance. Communication and mutual respect will easily overcome minor planetary differences.'
                : 'Planetary adjustments (Upayas) and deeper chart scrutiny are advised.'}
            </p>
          </div>
        </div>

        {/* Manglik Analysis Card */}
        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs max-w-sm">
          <div className="flex items-center gap-1.5 text-amber-950 font-bold mb-1">
            <ShieldAlert className="w-4 h-4 text-amber-700" />
            <span>Manglik / Kuja Dosha Check</span>
          </div>
          <p className="text-slate-700 text-xs leading-relaxed">
            {result.manglikAnalysis.explanation}
          </p>
        </div>
      </div>

      {/* Detailed Ashtakoot Table */}
      <div className="bg-white border border-amber-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-amber-100 bg-amber-50/50">
          <h3 className="font-serif font-bold text-amber-950 text-base">
            Detailed 8 Kootas (Ashtakoot Breakdown)
          </h3>
        </div>

        <div className="divide-y divide-amber-100 text-xs">
          {[
            { name: '1. Varna Koota', data: result.varna },
            { name: '2. Vashya Koota', data: result.vashya },
            { name: '3. Tara Koota', data: result.tara },
            { name: '4. Yoni Koota', data: result.yoni },
            { name: '5. Graha Maitri', data: result.grahaMaitri },
            { name: '6. Gana Koota', data: result.gana },
            { name: '7. Bhakoot Koota', data: result.bhakoot },
            { name: '8. Nadi Koota', data: result.nadi },
          ].map((item, idx) => (
            <div key={idx} className="p-4 flex flex-wrap items-center justify-between gap-3 hover:bg-amber-50/60 transition-colors">
              <div>
                <strong className="text-sm font-serif text-slate-900 block">{item.name}</strong>
                <span className="text-slate-600 text-xs">{item.data.description}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono font-bold text-amber-900">
                  {item.data.score} / {item.data.max} pts
                </span>
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    item.data.score === item.data.max
                      ? 'bg-emerald-600'
                      : item.data.score > 0
                      ? 'bg-amber-600'
                      : 'bg-rose-600'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
