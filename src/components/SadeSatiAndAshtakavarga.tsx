import React from 'react';
import { KundaliData } from '../types';
import { Shield, Sparkles, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface SadeSatiAndAshtakavargaProps {
  kundali: KundaliData;
}

export const SadeSatiAndAshtakavarga: React.FC<SadeSatiAndAshtakavargaProps> = ({ kundali }) => {
  const { sadeSati, ashtakavargaScores, houses } = kundali;

  const getScoreColor = (score: number) => {
    if (score >= 30) return 'text-emerald-900 bg-emerald-100 border-emerald-300';
    if (score >= 26) return 'text-amber-900 bg-amber-100 border-amber-300';
    return 'text-rose-900 bg-rose-100 border-rose-300';
  };

  const getHouseSignificance = (h: number) => {
    switch (h) {
      case 1: return 'Self, Health, Vitality, Personality';
      case 2: return 'Wealth, Speech, Family Assets, Values';
      case 3: return 'Courage, Siblings, Communication, Effort';
      case 4: return 'Mother, Home, Conveyances, Peace of Mind';
      case 5: return 'Intelligence, Children, Creativity, Purva Punya';
      case 6: return 'Service, Overcoming Enemies, Debts, Health Care';
      case 7: return 'Spouse, Partnerships, Trade, Public Relations';
      case 8: return 'Longevity, Transformation, Occult, Sudden Gains';
      case 9: return 'Dharma, Fortune, Higher Wisdom, Guru, Father';
      case 10: return 'Profession, Karma, Fame, Leadership, Status';
      case 11: return 'Gains, Aspirations, Elder Siblings, Community';
      case 12: return 'Moksha, Foreign Lands, Expenses, Spiritual Solitude';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Sade Sati Analysis Card */}
      <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-amber-100">
          <div className="flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-amber-700" />
            <div>
              <h3 className="font-serif font-bold text-amber-950 text-lg">
                Shani Sade Sati Analysis (7.5-Year Saturn Transit)
              </h3>
              <p className="text-xs text-slate-500">
                Calculated against Natal Moon in {sadeSati.moonSign} and current Saturn in {sadeSati.saturnSign}
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 text-xs font-bold rounded-full border flex items-center gap-1.5 ${
              sadeSati.isActive
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-emerald-100 text-emerald-900 border-emerald-300'
            }`}
          >
            {sadeSati.isActive ? <AlertTriangle className="w-3.5 h-3.5 text-amber-700" /> : <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />}
            {sadeSati.status}
          </span>
        </div>

        <div className="space-y-3 text-sm text-slate-800">
          <p className="leading-relaxed bg-amber-50/50 p-4 rounded-xl border border-amber-100">
            {sadeSati.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-white rounded-lg border border-amber-100 shadow-2xs text-xs">
              <span className="text-amber-950 block font-bold mb-1">1st Phase (Rising - 12th)</span>
              <span className="text-slate-600">Affects finances, sleep, and unexpected expenditures. Focus on disciplined budgets and spiritual introspection.</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-amber-100 shadow-2xs text-xs">
              <span className="text-amber-950 block font-bold mb-1">2nd Phase (Peak - 1st Janma)</span>
              <span className="text-slate-600">Affects physical stamina and personal identity. High patience, humility, and steadfast duty (Karma Yoga) conquer all pressure.</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-amber-100 shadow-2xs text-xs">
              <span className="text-amber-950 block font-bold mb-1">3rd Phase (Setting - 2nd)</span>
              <span className="text-slate-600">Affects domestic stability and financial consolidation. Gradual relief, maturity, and long-term wisdom manifest.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sarvashtakavarga (SAV) House Strengths */}
      <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-amber-100">
          <div>
            <h3 className="font-serif font-bold text-amber-950 text-lg">
              Sarvashtakavarga (SAV) - House Strength Points
            </h3>
            <p className="text-xs text-slate-500">
              Parashara&apos;s 8-fold benefic point system (Benchmark: 28 points is balanced, &gt;30 is highly fortified)
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span className="text-slate-700">&ge;30 Fortified</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
              <span className="text-slate-700">26-29 Balanced</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
              <span className="text-slate-700">&lt;26 Needs Upaya</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {houses.map((h) => {
            const score = ashtakavargaScores[h.houseNumber] || 28;
            return (
              <div
                key={h.houseNumber}
                className="bg-amber-50/40 border border-amber-200/80 hover:border-amber-400 rounded-xl p-3.5 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-serif font-bold text-amber-950">
                      House {h.houseNumber}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {h.sign.slice(0, 3)}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 line-clamp-2 mb-2">
                    {getHouseSignificance(h.houseNumber)}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-amber-200/60">
                  <span className="text-[10px] text-slate-500 font-sans uppercase font-bold">SAV Score</span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold font-mono border ${getScoreColor(
                      score
                    )}`}
                  >
                    {score} pts
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-slate-700 flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            Houses with scores above 30 effortlessly manifest positive outcomes during transits, whereas houses below 28 benefit significantly from planetary charity (Dana) and dedicated Japa.
          </span>
        </div>
      </div>
    </div>
  );
};
