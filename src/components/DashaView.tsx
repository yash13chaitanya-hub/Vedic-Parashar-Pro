import React, { useState } from 'react';
import { KundaliData, PlanetName, DashaPeriod } from '../types';
import { Clock, Calendar, ChevronDown, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface DashaViewProps {
  kundali: KundaliData;
}

export const DashaView: React.FC<DashaViewProps> = ({ kundali }) => {
  const { vimshottariDasha } = kundali;
  const [expandedMD, setExpandedMD] = useState<string | null>(
    vimshottariDasha.currentMahadasha.lord
  );

  const getPlanetColor = (name: PlanetName) => {
    switch (name) {
      case 'Sun': return 'text-amber-900 bg-amber-100 border-amber-300';
      case 'Moon': return 'text-blue-900 bg-blue-100 border-blue-300';
      case 'Mars': return 'text-rose-900 bg-rose-100 border-rose-300';
      case 'Mercury': return 'text-emerald-900 bg-emerald-100 border-emerald-300';
      case 'Jupiter': return 'text-amber-900 bg-amber-100 border-amber-300';
      case 'Venus': return 'text-pink-900 bg-pink-100 border-pink-300';
      case 'Saturn': return 'text-indigo-900 bg-indigo-100 border-indigo-300';
      case 'Rahu': return 'text-purple-900 bg-purple-100 border-purple-300';
      case 'Ketu': return 'text-orange-900 bg-orange-100 border-orange-300';
      default: return 'text-slate-800 bg-slate-100 border-slate-300';
    }
  };

  const getDashaSignificance = (lord: PlanetName) => {
    switch (lord) {
      case 'Sun':
        return 'Solar vitality, government recognition, father, soul purpose, leadership, and administrative status.';
      case 'Moon':
        return 'Emotional tranquility, public popularity, mother, fluid wealth, creative mind, and journeys.';
      case 'Mars':
        return 'Courage, physical vitality, property acquisition, technical pursuits, brothers, and assertive action.';
      case 'Mercury':
        return 'Intellect, commerce, trade, analytical mastery, speech, communications, mathematics, and learning.';
      case 'Jupiter':
        return 'Guru blessings, wisdom, spiritual elevation, progeny, wealth expansion, higher ethics, and honor.';
      case 'Venus':
        return 'Material prosperity, arts, luxury, marital romance, diplomacy, aesthetic comforts, and vehicles.';
      case 'Saturn':
        return 'Discipline, karmic restitution, endurance, structural consolidation, long-term mastery, and perseverance.';
      case 'Rahu':
        return 'Unconventional expansion, worldly ambitions, sudden breakthroughs, technological growth, and foreign connections.';
      case 'Ketu':
        return 'Spiritual detachment, esoteric wisdom, moksha inclinations, intuitive leaps, and inner contemplation.';
      default:
        return 'Planetary dasha period activating natal karmic influences.';
    }
  };

  const now = new Date();
  const currentMD = vimshottariDasha.currentMahadasha;
  const currentAD = vimshottariDasha.currentAntardasha;

  // Calculate percentage elapsed in current Mahadasha
  const mdStart = new Date(currentMD.startDate).getTime();
  const mdEnd = new Date(currentMD.endDate).getTime();
  const nowTime = now.getTime();
  const mdProgress = Math.min(
    100,
    Math.max(0, Math.round(((nowTime - mdStart) / (mdEnd - mdStart)) * 100))
  );

  return (
    <div className="space-y-6">
      {/* Current Active Dasha Banner */}
      <div className="bg-white border border-amber-300 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                120-Year Vimshottari Cycle
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Birth Balance: {vimshottariDasha.balanceAtBirthYears.toFixed(2)} years of {vimshottariDasha.birthBalanceLord}
              </span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-amber-950">
              Active Vimshottari Dasha Period
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-4 py-2 bg-amber-50 rounded-xl border border-amber-200 text-center">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Mahadasha</span>
              <strong className="text-amber-950 text-base font-serif font-bold">{currentMD.lord}</strong>
            </div>
            <span className="text-amber-600 font-bold text-lg">/</span>
            <div className="px-4 py-2 bg-amber-50 rounded-xl border border-amber-200 text-center">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Antardasha (Bhukti)</span>
              <strong className="text-amber-950 text-base font-serif font-bold">{currentAD.lord}</strong>
            </div>
          </div>
        </div>

        {/* Progress Bar of Current Mahadasha */}
        <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-2">
          <div className="flex justify-between text-xs text-slate-700">
            <span>Started: <strong className="text-slate-900 font-bold">{currentMD.startDate}</strong></span>
            <span className="text-amber-800 font-bold">{mdProgress}% Elapsed</span>
            <span>Ends: <strong className="text-slate-900 font-bold">{currentMD.endDate}</strong></span>
          </div>
          <div className="w-full bg-amber-100 rounded-full h-2.5 overflow-hidden border border-amber-200">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-600 h-2.5 rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${mdProgress}%` }}
            />
          </div>
          <p className="text-xs text-slate-600 pt-1">
            <strong className="text-amber-950 font-bold">Karmic Theme:</strong> {getDashaSignificance(currentMD.lord)}
          </p>
        </div>
      </div>

      {/* Complete Mahadashas & Antardashas Accordion */}
      <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-sm">
        <div className="mb-4 pb-3 border-b border-amber-100">
          <h3 className="font-serif font-bold text-amber-950 text-lg">
            Complete Vimshottari Dasha Hierarchy
          </h3>
          <p className="text-xs text-slate-500">
            Click any Mahadasha to view its Antardasha (sub-period) transitions
          </p>
        </div>

        <div className="space-y-3">
          {vimshottariDasha.allMahadashas.map((md) => {
            const isExpanded = expandedMD === md.lord;
            const isCurrentMD = md.lord === currentMD.lord;

            return (
              <div
                key={md.lord}
                className={`border rounded-xl transition-all overflow-hidden ${
                  isCurrentMD
                    ? 'border-amber-400 bg-amber-50/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-amber-200'
                }`}
              >
                <div
                  onClick={() => setExpandedMD(isExpanded ? null : md.lord)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-amber-50/50 transition-colors select-none"
                >
                  <div className="flex items-center gap-3">
                    <button type="button" className="text-amber-700">
                      {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </button>
                    <span
                      className={`px-2.5 py-1 rounded-lg border text-xs font-bold font-serif ${getPlanetColor(
                        md.lord
                      )}`}
                    >
                      {md.lord} ({md.sanskritLord})
                    </span>
                    {isCurrentMD && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Running Period
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-slate-700">
                    <span className="font-bold">
                      {md.startDate} → {md.endDate}
                    </span>
                    <span className="text-amber-800 font-sans font-semibold hidden sm:inline">
                      ({md.durationYears.toFixed(1)} yrs)
                    </span>
                  </div>
                </div>

                {/* Sub-dashas (Antardashas) when expanded */}
                {isExpanded && md.subDashas && (
                  <div className="px-6 pb-4 pt-3 border-t border-amber-100 bg-amber-50/30">
                    <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2.5">
                      Antardashas (Bhukti Periods)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {md.subDashas.map((ad, idx) => {
                        const isThisAdRunning = isCurrentMD && ad.lord === currentAD.lord;
                        return (
                          <div
                            key={idx}
                            className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                              isThisAdRunning
                                ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold shadow-2xs'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-amber-200'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-amber-900">{ad.lord}</span>
                              {isThisAdRunning && (
                                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" title="Active Bhukti" />
                              )}
                            </div>
                            <div className="font-mono text-[11px] text-slate-500">
                              {ad.startDate} → {ad.endDate}
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
    </div>
  );
};
