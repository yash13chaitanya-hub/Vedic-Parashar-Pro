import React from 'react';
import { PlanetName, PlanetPosition, OuterPlanetInfo } from '../types';

interface NorthIndianChartProps {
  chartTitle: string;
  lagnaSignIndex: number; // 0 to 11 (0=Aries)
  planets: Record<PlanetName, PlanetPosition>;
  outerPlanets?: OuterPlanetInfo[];
  planetPlacements?: Record<PlanetName, number>; // if divisional chart, signIndex per planet
  customHousePlacements?: Partial<Record<PlanetName, number>>; // for KP Bhava Chalit (1 to 12)
  cuspSignNumbers?: Record<number, number>; // for KP Cuspal sign numbers (1-12)
}

interface ChartPlanetItem {
  name: string;
  abbr: string;
  isRetrograde?: boolean;
  degrees?: number;
  colorClass?: string;
  dignity?: string;
}

export const NorthIndianChart: React.FC<NorthIndianChartProps> = ({
  chartTitle,
  lagnaSignIndex,
  planets,
  outerPlanets,
  planetPlacements,
  customHousePlacements,
  cuspSignNumbers,
}) => {
  // Compute which planets fall into each house (1 to 12)
  // House 1 has sign = lagnaSignIndex
  // House h has sign = (lagnaSignIndex + h - 1) % 12
  const housePlanets: Record<number, ChartPlanetItem[]> = {};
  const houseSignNumbers: Record<number, number> = {};

  for (let h = 1; h <= 12; h++) {
    housePlanets[h] = [];
    // 1-based sign number (1=Aries, 12=Pisces)
    if (cuspSignNumbers && cuspSignNumbers[h] !== undefined) {
      houseSignNumbers[h] = cuspSignNumbers[h];
    } else {
      const signIndex = (lagnaSignIndex + h - 1) % 12;
      houseSignNumbers[h] = signIndex + 1;
    }
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
      case 'Lagna': return 'text-amber-950 font-bold';
      default: return 'text-slate-800';
    }
  };

  // Place Lagna in House 1
  if (planets.Ascendant) {
    housePlanets[1].push({
      name: 'Lagna',
      abbr: 'La',
      degrees: Math.floor(planets.Ascendant.degrees),
      colorClass: 'text-amber-950 font-extrabold',
    });
  }

  // Place Vedic planets into houses
  Object.keys(planets).forEach((key) => {
    const pName = key as PlanetName;
    if (pName === 'Ascendant') return;
    const p = planets[pName];
    let house: number;
    if (customHousePlacements && customHousePlacements[pName] !== undefined) {
      house = customHousePlacements[pName]!;
    } else {
      const signIdx = planetPlacements ? planetPlacements[pName] : p.signIndex;
      house = ((signIdx - lagnaSignIndex + 12) % 12) + 1;
    }
    if (housePlanets[house]) {
      housePlanets[house].push({
        name: pName,
        abbr: getPlanetAbbr(pName),
        isRetrograde: p.isRetrograde,
        degrees: Math.floor(p.degrees),
        colorClass: getPlanetColor(pName),
        dignity: p.dignity === 'Exalted' ? '†' : p.dignity === 'Debilitated' ? '↓' : undefined,
      });
    }
  });

  // Place Modern Outer Planets (Uranus, Neptune, Pluto) matching AstroSage
  if (outerPlanets && !planetPlacements) {
    outerPlanets.forEach((op) => {
      const house = ((op.signIndex - lagnaSignIndex + 12) % 12) + 1;
      if (housePlanets[house]) {
        housePlanets[house].push({
          name: op.name,
          abbr: op.symbol,
          isRetrograde: op.isRetrograde,
          degrees: Math.floor(op.degrees),
          colorClass: getPlanetColor(op.name),
        });
      }
    });
  }

  const renderPlanetItem = (p: ChartPlanetItem, i: number) => (
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
  );

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-3">
        <h3 className="font-serif font-bold text-amber-950 text-lg tracking-wide">{chartTitle}</h3>
        <p className="text-xs text-slate-500">Classical North Indian Kundali (Diamond Format)</p>
      </div>

      <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-[#fffefb] border-2 border-amber-600/70 rounded-xl shadow-md p-2 select-none overflow-hidden">
        {/* Subtle background sacred mandala pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#b45309_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

        {/* SVG geometric lines of the North Indian Chart */}
        <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full pointer-events-none stroke-amber-700/80 stroke-[1.8]">
          {/* Outer square border */}
          <rect x="0" y="0" width="400" height="400" fill="none" />
          {/* Main X diagonals */}
          <line x1="0" y1="0" x2="400" y2="400" />
          <line x1="0" y1="400" x2="400" y2="0" />
          {/* Diamond in the center */}
          <polygon points="200,0 400,200 200,400 0,200" fill="none" />
        </svg>

        {/* Houses Placements (Absolute Positioning inside 400x400 normalized space) */}
        
        {/* House 1: Top Center Diamond */}
        <div className="absolute top-[8%] left-[28%] w-[44%] h-[40%] flex flex-col items-center justify-start pointer-events-auto">
          <span className="text-[11px] font-bold text-amber-800 mt-1">{houseSignNumbers[1]}</span>
          <span className="text-[9px] font-bold text-amber-900 uppercase">Lagna</span>
          <div className="flex flex-wrap gap-1 justify-center mt-1 px-1">
            {housePlanets[1]?.map(renderPlanetItem)}
          </div>
        </div>

        {/* House 2: Top Left Triangle */}
        <div className="absolute top-[4%] left-[6%] w-[38%] h-[20%] flex flex-col items-start justify-start pl-3 pt-1 pointer-events-auto">
          <span className="text-[11px] font-bold text-amber-800">{houseSignNumbers[2]}</span>
          <div className="flex flex-wrap gap-1">
            {housePlanets[2]?.map(renderPlanetItem)}
          </div>
        </div>

        {/* House 12: Top Right Triangle */}
        <div className="absolute top-[4%] right-[6%] w-[38%] h-[20%] flex flex-col items-end justify-start pr-3 pt-1 pointer-events-auto">
          <span className="text-[11px] font-bold text-amber-800">{houseSignNumbers[12]}</span>
          <div className="flex flex-wrap gap-1 justify-end">
            {housePlanets[12]?.map(renderPlanetItem)}
          </div>
        </div>

        {/* House 3: Upper Left Edge */}
        <div className="absolute top-[28%] left-[2%] w-[22%] h-[38%] flex flex-col items-start justify-center pl-2 pointer-events-auto">
          <span className="text-[11px] font-bold text-amber-800">{houseSignNumbers[3]}</span>
          <div className="flex flex-col gap-0.5 mt-0.5">
            {housePlanets[3]?.map(renderPlanetItem)}
          </div>
        </div>

        {/* House 4: Left Center Diamond */}
        <div className="absolute top-[28%] left-[8%] w-[40%] h-[44%] flex flex-col items-center justify-center pointer-events-auto">
          <span className="text-[11px] font-bold text-amber-800">{houseSignNumbers[4]}</span>
          <div className="flex flex-wrap gap-1 justify-center mt-1 px-1">
            {housePlanets[4]?.map(renderPlanetItem)}
          </div>
        </div>

        {/* House 5: Lower Left Edge */}
        <div className="absolute bottom-[26%] left-[2%] w-[22%] h-[38%] flex flex-col items-start justify-center pl-2 pointer-events-auto">
          <span className="text-[11px] font-bold text-amber-800">{houseSignNumbers[5]}</span>
          <div className="flex flex-col gap-0.5 mt-0.5">
            {housePlanets[5]?.map(renderPlanetItem)}
          </div>
        </div>

        {/* House 6: Bottom Left Triangle */}
        <div className="absolute bottom-[4%] left-[6%] w-[38%] h-[20%] flex flex-col items-start justify-end pl-3 pb-1 pointer-events-auto">
          <div className="flex flex-wrap gap-1">
            {housePlanets[6]?.map(renderPlanetItem)}
          </div>
          <span className="text-[11px] font-bold text-amber-800">{houseSignNumbers[6]}</span>
        </div>

        {/* House 7: Bottom Center Diamond */}
        <div className="absolute bottom-[8%] left-[28%] w-[44%] h-[40%] flex flex-col items-center justify-end pb-2 pointer-events-auto">
          <div className="flex flex-wrap gap-1 justify-center mb-1 px-1">
            {housePlanets[7]?.map(renderPlanetItem)}
          </div>
          <span className="text-[11px] font-bold text-amber-800">{houseSignNumbers[7]}</span>
        </div>

        {/* House 8: Bottom Right Triangle */}
        <div className="absolute bottom-[4%] right-[6%] w-[38%] h-[20%] flex flex-col items-end justify-end pr-3 pb-1 pointer-events-auto">
          <div className="flex flex-wrap gap-1 justify-end">
            {housePlanets[8]?.map(renderPlanetItem)}
          </div>
          <span className="text-[11px] font-bold text-amber-800">{houseSignNumbers[8]}</span>
        </div>

        {/* House 9: Lower Right Edge */}
        <div className="absolute bottom-[26%] right-[2%] w-[22%] h-[38%] flex flex-col items-end justify-center pr-2 pointer-events-auto">
          <span className="text-[11px] font-bold text-amber-800">{houseSignNumbers[9]}</span>
          <div className="flex flex-col gap-0.5 mt-0.5 items-end">
            {housePlanets[9]?.map(renderPlanetItem)}
          </div>
        </div>

        {/* House 10: Right Center Diamond */}
        <div className="absolute top-[28%] right-[8%] w-[40%] h-[44%] flex flex-col items-center justify-center pointer-events-auto">
          <span className="text-[11px] font-bold text-amber-800">{houseSignNumbers[10]}</span>
          <div className="flex flex-wrap gap-1 justify-center mt-1 px-1">
            {housePlanets[10]?.map(renderPlanetItem)}
          </div>
        </div>

        {/* House 11: Upper Right Edge */}
        <div className="absolute top-[28%] right-[2%] w-[22%] h-[38%] flex flex-col items-end justify-center pr-2 pointer-events-auto">
          <span className="text-[11px] font-bold text-amber-800">{houseSignNumbers[11]}</span>
          <div className="flex flex-col gap-0.5 mt-0.5 items-end">
            {housePlanets[11]?.map(renderPlanetItem)}
          </div>
        </div>
      </div>
    </div>
  );
};
