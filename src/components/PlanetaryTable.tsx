import React from 'react';
import { PlanetName, PlanetPosition, OuterPlanetInfo } from '../types';

interface PlanetaryTableProps {
  planets: Record<PlanetName, PlanetPosition>;
  outerPlanets?: OuterPlanetInfo[];
}

export const PlanetaryTable: React.FC<PlanetaryTableProps> = ({ planets, outerPlanets }) => {
  const getDignityBadge = (dignity: PlanetPosition['dignity']) => {
    switch (dignity) {
      case 'Exalted':
        return <span className="px-2 py-0.5 text-xs font-bold rounded bg-emerald-100 text-emerald-900 border border-emerald-300">Uchcha (Exalted)</span>;
      case 'Debilitated':
        return <span className="px-2 py-0.5 text-xs font-bold rounded bg-rose-100 text-rose-900 border border-rose-300">Neecha (Debilitated)</span>;
      case 'Moolatrikona':
        return <span className="px-2 py-0.5 text-xs font-bold rounded bg-amber-100 text-amber-950 border border-amber-300">Moolatrikona</span>;
      case 'Own Sign':
        return <span className="px-2 py-0.5 text-xs font-bold rounded bg-blue-100 text-blue-900 border border-blue-300">Swakshetra (Own)</span>;
      case 'Friendly':
        return <span className="px-2 py-0.5 text-xs font-bold rounded bg-teal-100 text-teal-900 border border-teal-300">Mitra (Friendly)</span>;
      case 'Enemy':
        return <span className="px-2 py-0.5 text-xs font-bold rounded bg-orange-100 text-orange-900 border border-orange-300">Shatru (Enemy)</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-slate-100 text-slate-700 border border-slate-300">Sama (Neutral)</span>;
    }
  };

  const getPlanetGlyph = (name: PlanetName) => {
    switch (name) {
      case 'Sun': return '☉';
      case 'Moon': return '☽';
      case 'Mars': return '♂';
      case 'Mercury': return '☿';
      case 'Jupiter': return '♃';
      case 'Venus': return '♀';
      case 'Saturn': return '♄';
      case 'Rahu': return '☊';
      case 'Ketu': return '☋';
      case 'Ascendant': return '⊛';
      default: return '✦';
    }
  };

  const planetList: PlanetName[] = [
    'Ascendant',
    'Sun',
    'Moon',
    'Mars',
    'Mercury',
    'Jupiter',
    'Venus',
    'Saturn',
    'Rahu',
    'Ketu',
  ];

  return (
    <div className="bg-white border border-amber-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-amber-100 bg-amber-50/50 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-serif font-bold text-amber-950 text-lg">Graha Spashta (Planetary Positions)</h3>
          <p className="text-xs text-slate-500">Nirayana Lahiri Sidereal Longitudes & Parashari Dignities</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-600"></span>
          <span>(R) = Vakri (Retrograde)</span>
          <span className="inline-block w-2 h-2 rounded-full bg-rose-600 ml-2"></span>
          <span>(C) = Asta (Combust)</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-amber-100/50 text-amber-950 text-xs font-bold uppercase tracking-wider border-b border-amber-200">
            <tr>
              <th className="px-4 py-3">Graha (Planet)</th>
              <th className="px-4 py-3">Rashi (Sign)</th>
              <th className="px-4 py-3">Longitude</th>
              <th className="px-4 py-3">Bhava (House)</th>
              <th className="px-4 py-3">Nakshatra & Pada</th>
              <th className="px-4 py-3">Nakshatra Lord</th>
              <th className="px-4 py-3">Avastha / Dignity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-100 font-mono text-xs">
            {planetList.map((name) => {
              const p = planets[name];
              if (!p) return null;
              const isAsc = name === 'Ascendant';

              return (
                <tr
                  key={name}
                  className={`hover:bg-amber-50/60 transition-colors ${
                    isAsc ? 'bg-amber-50/90 font-semibold' : ''
                  }`}
                >
                  <td className="px-4 py-3 flex items-center gap-2 font-sans font-bold text-slate-900">
                    <span className="text-base text-amber-700 font-serif">{getPlanetGlyph(name)}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span>{p.name}</span>
                        {p.isRetrograde && (
                          <span className="text-[10px] px-1 bg-amber-100 text-amber-900 border border-amber-300 rounded font-bold">
                            Vakri (R)
                          </span>
                        )}
                        {p.isCombust && (
                          <span className="text-[10px] px-1 bg-rose-100 text-rose-900 border border-rose-300 rounded font-bold">
                            Asta (C)
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-amber-800 font-serif font-medium">
                        {p.sanskritName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-sans">
                    <span className="text-slate-900 font-bold">{p.sign}</span>
                    <span className="text-xs text-slate-500 block font-serif">({p.sanskritSign})</span>
                  </td>
                  <td className="px-4 py-3 text-amber-950 font-bold font-mono">
                    {p.degrees}° {String(p.minutes).padStart(2, '0')}&apos; {String(p.seconds).padStart(2, '0')}&quot;
                  </td>
                  <td className="px-4 py-3 font-sans">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-950 font-bold text-xs border border-amber-300">
                      {p.house}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-sans">
                    <span className="text-slate-900 font-bold">{p.nakshatra}</span>
                    <span className="ml-1.5 text-xs text-amber-800 font-mono font-semibold">Pada {p.pada}</span>
                  </td>
                  <td className="px-4 py-3 font-sans text-slate-700 font-medium">
                    {p.nakshatraLord}
                  </td>
                  <td className="px-4 py-3 font-sans">
                    {isAsc ? (
                      <span className="text-xs text-amber-900 font-bold">Lagna Centroid</span>
                    ) : (
                      getDignityBadge(p.dignity)
                    )}
                  </td>
                </tr>
              );
            })}

            {/* Modern Outer Planets (Uranus, Neptune, Pluto) */}
            {outerPlanets && outerPlanets.length > 0 && (
              <>
                <tr className="bg-amber-50/50 border-t-2 border-amber-200">
                  <td colSpan={7} className="px-4 py-2 text-[11px] font-sans font-bold text-teal-800">
                    Modern Outer Planets (AstroSage Ephemeris Reference)
                  </td>
                </tr>
                {outerPlanets.map((op) => (
                  <tr key={op.name} className="hover:bg-teal-50/40 transition-colors">
                    <td className="px-4 py-2.5 flex items-center gap-2 font-sans font-bold text-slate-900">
                      <span className="text-base text-teal-700 font-serif">✦</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span>{op.name}</span>
                          {op.isRetrograde && (
                            <span className="text-[10px] px-1 bg-amber-100 text-amber-900 border border-amber-300 rounded font-bold">
                              Vakri (R)
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-teal-800 font-mono font-medium">
                          {op.symbol}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 font-sans">
                      <span className="text-slate-900 font-bold">{op.sign}</span>
                    </td>
                    <td className="px-4 py-2.5 text-teal-900 font-bold font-mono">
                      {op.degrees}° {String(op.minutes).padStart(2, '0')}&apos; {String(op.seconds).padStart(2, '0')}&quot;
                    </td>
                    <td className="px-4 py-2.5 font-sans">
                      <span className="text-xs text-slate-600 font-mono">Sign {op.signIndex + 1}</span>
                    </td>
                    <td className="px-4 py-2.5 font-sans">
                      <span className="text-slate-800 text-xs font-semibold">{op.nakshatra}</span>
                    </td>
                    <td className="px-4 py-2.5 font-sans text-slate-500 text-xs">
                      —
                    </td>
                    <td className="px-4 py-2.5 font-sans">
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 text-slate-700 border border-slate-300">
                        Outer Planet
                      </span>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
