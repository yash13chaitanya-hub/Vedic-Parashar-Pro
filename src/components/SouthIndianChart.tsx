import React from 'react';
import { PlanetName, PlanetPosition, OuterPlanetInfo } from '../types';

interface SouthIndianChartProps {
  chartTitle: string;
  lagnaSignIndex: number;
  planets: Record<PlanetName, PlanetPosition>;
  outerPlanets?: OuterPlanetInfo[];
  planetPlacements?: Record<PlanetName, number>;
}

interface SouthChartPlanetItem {
  name: string;
  abbr: string;
  isRetrograde?: boolean;
  degrees?: number;
  colorClass?: string;
  dignity?: string;
}

// South Indian Grid Layout:
// Row 0: Pisces (11), Aries (0), Taurus (1), Gemini (2)
// Row 1: Aquarius (10), [Central], [Central], Cancer (3)
// Row 2: Capricorn (9), [Central], [Central], Leo (4)
// Row 3: Sagittarius (8), Scorpio (7), Libra (6), Virgo (5)

const SOUTH_GRID: (number | null)[][] = [
  [11, 0, 1, 2],
  [10, null, null, 3],
  [9, null, null, 4],
  [8, 7, 6, 5],
];

export const SouthIndianChart: React.FC<SouthIndianChartProps> = ({
  chartTitle,
  lagnaSignIndex,
  planets,
  outerPlanets,
  planetPlacements,
}) => {
  // Sign to planets mapping
  const signPlanets: Record<number, SouthChartPlanetItem[]> = {};
  for (let i = 0; i < 12; i++) {
    signPlanets[i] = [];
  }

  const getPlanetAbbr = (name: PlanetName) => {
    switch (name) {
      case 'Sun': return 'Su';
      case 'Moon': return 'Mo';
      case 'Mars': return 'Ma';
      case 'Mercury': return 'Me';
      case 'Jupiter': return 'Ju';
      case 'Venus': return 'Ve';
      case 'Saturn': return 'Sa';
      case 'Rahu': return 'Ra';
      case 'Ketu': return 'Ke';
      default: return name.slice(0, 2);
    }
  };

  const getPlanetColor = (name: PlanetName | string) => {
    switch (name) {
      case 'Sun': return 'text-amber-800';
      case 'Moon': return 'text-blue-800';
      case 'Mars': return 'text-rose-800';
      case 'Mercury': return 'text-emerald-800';
      case 'Jupiter': return 'text-amber-700';
      case 'Venus': return 'text-pink-800';
      case 'Saturn': return 'text-indigo-900';
      case 'Rahu': return 'text-purple-900';
      case 'Ketu': return 'text-orange-900';
      case 'Uranus': return 'text-cyan-800';
      case 'Neptune': return 'text-teal-800';
      case 'Pluto': return 'text-fuchsia-900';
      default: return 'text-slate-850';
    }
  };

  // Vedic planets
  Object.keys(planets).forEach((key) => {
    const pName = key as PlanetName;
    if (pName === 'Ascendant') return;
    const p = planets[pName];
    const signIdx = planetPlacements ? planetPlacements[pName] : p.signIndex;
    if (signPlanets[signIdx]) {
      signPlanets[signIdx].push({
        name: pName,
        abbr: getPlanetAbbr(pName),
        isRetrograde: p.isRetrograde,
        degrees: Math.floor(p.degrees),
        colorClass: getPlanetColor(pName),
        dignity: p.dignity === 'Exalted' ? '†' : p.dignity === 'Debilitated' ? '↓' : undefined,
      });
    }
  });

  // Modern Outer Planets
  if (outerPlanets && !planetPlacements) {
    outerPlanets.forEach((op) => {
      if (signPlanets[op.signIndex]) {
        signPlanets[op.signIndex].push({
          name: op.name,
          abbr: op.symbol,
          isRetrograde: op.isRetrograde,
          degrees: Math.floor(op.degrees),
          colorClass: getPlanetColor(op.name),
        });
      }
    });
  }

  const signNames = ['Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya', 'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'];

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-3">
        <h3 className="font-serif font-bold text-amber-950 text-lg tracking-wide">{chartTitle}</h3>
        <p className="text-xs text-slate-500">Classical South Indian Kundali (Fixed Grid Format)</p>
      </div>

      <div className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-[#fffefb] border-2 border-amber-600/70 rounded-xl shadow-md p-1 grid grid-cols-4 grid-rows-4 relative">
        {/* Center label */}
        <div className="col-start-2 col-span-2 row-start-2 row-span-2 border border-amber-300 bg-amber-50/70 flex flex-col items-center justify-center p-2 text-center rounded">
          <span className="text-xs font-serif font-bold text-amber-950">{chartTitle}</span>
          <span className="text-[10px] text-amber-900 font-semibold mt-1">Lagna: {signNames[lagnaSignIndex]}</span>
          <span className="text-[9px] text-slate-500 mt-0.5">Parashar Vedic Engine</span>
        </div>

        {SOUTH_GRID.map((row, rIdx) =>
          row.map((signIdx, cIdx) => {
            if (signIdx === null) return null;
            const isLagna = signIdx === lagnaSignIndex;
            return (
              <div
                key={`${rIdx}-${cIdx}`}
                className={`border border-amber-300/80 p-1 flex flex-col justify-between text-xs relative ${
                  isLagna ? 'bg-amber-100/70 border-amber-500 font-bold' : 'bg-white hover:bg-amber-50/40'
                }`}
                style={{ gridRow: rIdx + 1, gridColumn: cIdx + 1 }}
              >
                {/* Diagonal mark for Lagna in South Indian format */}
                {isLagna && (
                  <div className="absolute top-0.5 right-0.5 px-1 bg-amber-500 text-slate-950 text-[9px] font-extrabold rounded">
                    ASC {planets.Ascendant ? `${Math.floor(planets.Ascendant.degrees)}°` : ''}
                  </div>
                )}
                <div className="text-[10px] font-bold text-slate-700">
                  {signNames[signIdx]}
                </div>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {signPlanets[signIdx]?.map((p, i) => (
                    <span
                      key={i}
                      className={`inline-flex items-center text-[10px] sm:text-xs font-bold ${p.colorClass || 'text-slate-800'} leading-tight`}
                      title={`${p.name}${p.degrees !== undefined ? ` ${p.degrees}°` : ''}${p.isRetrograde ? ' (Retrograde)' : ''}`}
                    >
                      <span>{p.abbr}</span>
                      {p.isRetrograde && <span className="text-amber-700 font-extrabold">*</span>}
                      {p.dignity && <span className="text-[9px] ml-0.5 opacity-90">{p.dignity}</span>}
                      {p.degrees !== undefined && (
                        <span className="text-[9px] text-slate-500 font-mono ml-0.5 font-normal">{String(p.degrees).padStart(2, '0')}</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
