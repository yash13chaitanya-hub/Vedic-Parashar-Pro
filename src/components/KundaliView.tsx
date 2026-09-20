import React, { useState } from 'react';
import { KundaliData, VargaCode } from '../types';
import { NorthIndianChart } from './NorthIndianChart';
import { SouthIndianChart } from './SouthIndianChart';
import { PlanetaryTable } from './PlanetaryTable';
import { Compass, Sparkles, Moon, Sun, Shield, Info, Layers, Award, ChevronDown, Check } from 'lucide-react';
import { SHODASHVARGA_DEFINITIONS } from '../lib/vedicCalculations';

interface KundaliViewProps {
  kundali: KundaliData;
  onEditBirthDetails?: () => void;
}

export const KundaliView: React.FC<KundaliViewProps> = ({ kundali, onEditBirthDetails }) => {
  const [chartFormat, setChartFormat] = useState<'north' | 'south'>('north');
  const [selectedVarga, setSelectedVarga] = useState<VargaCode>('d1');
  const [vargaGroup, setVargaGroup] = useState<'core' | 'shodashvarga' | 'higher' | 'all'>('core');
  const [showVimsopakaModal, setShowVimsopakaModal] = useState(false);

  const { birthDetails, planets, divisionalCharts, panchanga, vimsopakaScores } = kundali;
  const lagnaSignIndex = planets.Ascendant.signIndex;

  const currentVargaDef = SHODASHVARGA_DEFINITIONS.find((v) => v.code === selectedVarga);

  let activeChartTitle = 'Lagna Kundali (D-1 Rasi)';
  let activePlacements: any = undefined;
  let activeLagnaIdx = lagnaSignIndex;

  if (selectedVarga === 'chandraKundali') {
    activeChartTitle = 'Chandra Kundali (Moon as Lagna)';
    activePlacements = divisionalCharts.chandraKundali;
    activeLagnaIdx = planets.Moon.signIndex;
  } else if (selectedVarga === 'd1') {
    activeChartTitle = 'Lagna Kundali (D-1 Rasi)';
    activePlacements = undefined;
    activeLagnaIdx = lagnaSignIndex;
  } else {
    activePlacements = (divisionalCharts as any)[selectedVarga];
    activeLagnaIdx = activePlacements?.Ascendant ?? lagnaSignIndex;
    if (currentVargaDef) {
      activeChartTitle = `${currentVargaDef.name} (${currentVargaDef.sanskritName})`;
    }
  }

  // Filtered vargas for quick tabs
  const coreVargas: VargaCode[] = ['d1', 'd9', 'd10', 'd16', 'chandraKundali'];
  const shodashvargas: VargaCode[] = [
    'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8',
    'd9', 'd10', 'd11', 'd12', 'd13', 'd14', 'd15', 'd16'
  ];
  const higherVargas: VargaCode[] = ['d20', 'd24', 'd27', 'd30', 'd40', 'd45', 'd60'];

  const displayedVargas =
    vargaGroup === 'core'
      ? coreVargas
      : vargaGroup === 'shodashvarga'
      ? shodashvargas
      : vargaGroup === 'higher'
      ? higherVargas
      : [...shodashvargas, ...higherVargas, 'chandraKundali' as VargaCode];

  return (
    <div className="space-y-6">
      {/* Top Banner with Birth Info & Panchanga */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Person & Birth Summary */}
        <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif font-bold text-lg text-amber-950 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                {birthDetails.name}
              </h3>
              <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                Lagna: {planets.Ascendant.sign}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Date of Birth:</span>
                <span className="font-bold text-slate-900">{birthDetails.dateOfBirth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Time of Birth:</span>
                <span className="font-bold text-slate-900">{birthDetails.timeOfBirth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Place of Birth:</span>
                <span className="font-bold text-slate-900">{birthDetails.placeOfBirth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Coordinates:</span>
                <span className="font-mono text-amber-900 font-semibold">
                  {birthDetails.latitude.toFixed(2)}°N, {birthDetails.longitude.toFixed(2)}°E (UTC{birthDetails.timezone >= 0 ? `+${birthDetails.timezone}` : birthDetails.timezone})
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-amber-100">
                <span className="text-slate-500 font-medium">Ayanamsha:</span>
                <span className="font-bold text-amber-950">{kundali.ayanamshaName} ({kundali.ayanamsha.toFixed(4)}°)</span>
              </div>
            </div>
          </div>

          {onEditBirthDetails && (
            <div className="pt-3 mt-3 border-t border-amber-100 flex justify-end">
              <button
                type="button"
                onClick={onEditBirthDetails}
                className="text-xs text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 transition-colors"
              >
                <span>Edit Birth Details ↗</span>
              </button>
            </div>
          )}
        </div>

        {/* Janma Rashi & Nakshatra */}
        <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-serif font-bold text-amber-950 text-base flex items-center gap-2">
              <Moon className="w-5 h-5 text-blue-600" />
              Chandra (Janma Rashi)
            </h3>
            <span className="text-xs text-blue-800 font-mono font-semibold">
              House {planets.Moon.house}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-amber-50/70 p-3 rounded-xl border border-amber-200">
            <div>
              <span className="text-slate-600 block text-[11px] font-semibold">Moon Sign</span>
              <span className="text-sm font-bold text-slate-900">{planets.Moon.sign}</span>
              <span className="text-amber-900 text-[11px] block font-serif font-medium">({planets.Moon.sanskritSign})</span>
            </div>
            <div>
              <span className="text-slate-600 block text-[11px] font-semibold">Nakshatra</span>
              <span className="text-sm font-bold text-slate-900">{planets.Moon.nakshatra}</span>
              <span className="text-amber-900 text-[11px] block font-medium">Pada {planets.Moon.pada} (Lord: {planets.Moon.nakshatraLord})</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-amber-100">
            <span>Sun Sign: <strong className="text-slate-900 font-bold">{planets.Sun.sign}</strong> ({planets.Sun.degrees}°)</span>
            <span>Lagna Lord: <strong className="text-amber-900 font-bold">{planets.Ascendant.nakshatraLord}</strong></span>
          </div>
        </div>

        {/* Birth Panchanga & Vimsopaka Quick Badge */}
        <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-serif font-bold text-amber-950 text-base flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-700" />
                Janma Panchanga
              </h3>
              <span className="text-xs text-amber-800 font-serif font-semibold">5 Elements</span>
            </div>

            <div className="space-y-1 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Tithi:</span>
                <span className="font-bold text-slate-900">{panchanga.tithi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Vara:</span>
                <span className="font-bold text-slate-900">{panchanga.vara}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Yoga:</span>
                <span className="font-bold text-slate-900">{panchanga.yoga}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Karana:</span>
                <span className="font-bold text-slate-900">{panchanga.karana}</span>
              </div>
            </div>
          </div>

          <div className="pt-2.5 mt-2 border-t border-amber-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">Shodashvarga Strength:</span>
            <button
              type="button"
              onClick={() => setShowVimsopakaModal(!showVimsopakaModal)}
              className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 bg-amber-100/70 hover:bg-amber-200/80 px-2 py-0.5 rounded-md transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-amber-700" />
              <span>Vimsopaka Bala (20-Pt)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Kundali Visual Chart & Comprehensive Shodashvarga Controls */}
      <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-amber-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl font-bold text-amber-950">
                {activeChartTitle}
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
                {selectedVarga.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentVargaDef?.significance || 'Classical Sidereal Nirayana Parashari Calculations'}
            </p>
          </div>

          {/* Chart Format Switcher */}
          <div className="bg-amber-50/70 p-1 rounded-lg border border-amber-200 flex items-center">
            <button
              type="button"
              onClick={() => setChartFormat('north')}
              className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
                chartFormat === 'north'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-700 hover:text-amber-950 hover:bg-white'
              }`}
            >
              North Indian Diamond
            </button>
            <button
              type="button"
              onClick={() => setChartFormat('south')}
              className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
                chartFormat === 'south'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-700 hover:text-amber-950 hover:bg-white'
              }`}
            >
              South Indian Square
            </button>
          </div>
        </div>

        {/* Shodashvarga Group Selector (D1 to D16 & Higher) */}
        <div className="mb-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Layers className="w-4 h-4 text-amber-700" />
              <span>Select Divisional Chart (वर्ग कुण्डली):</span>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setVargaGroup('core')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  vargaGroup === 'core'
                    ? 'bg-white text-amber-950 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Core (D1, D9, D10, D16)
              </button>
              <button
                type="button"
                onClick={() => setVargaGroup('shodashvarga')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  vargaGroup === 'shodashvarga'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Shodashvarga (D1 to D16)
              </button>
              <button
                type="button"
                onClick={() => setVargaGroup('higher')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  vargaGroup === 'higher'
                    ? 'bg-white text-amber-950 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Higher (D20–D60)
              </button>
              <button
                type="button"
                onClick={() => setVargaGroup('all')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  vargaGroup === 'all'
                    ? 'bg-white text-amber-950 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All 23
              </button>
            </div>
          </div>

          {/* Varga Pills Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
            {displayedVargas.map((code) => {
              const def = SHODASHVARGA_DEFINITIONS.find((v) => v.code === code);
              const isCur = selectedVarga === code;
              const label =
                code === 'chandraKundali'
                  ? 'Chandra'
                  : def
                  ? `D-${def.dNumber} ${def.name.replace(' Chart', '')}`
                  : code.toUpperCase();

              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setSelectedVarga(code)}
                  title={def?.significance || 'Divisional Chart'}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shadow-2xs ${
                    isCur
                      ? 'bg-amber-600 text-white ring-2 ring-amber-400/50 shadow-xs'
                      : 'bg-amber-50/80 hover:bg-amber-100 text-slate-700 border border-amber-200/80'
                  }`}
                >
                  <span>{label}</span>
                  {def?.parasharaWeight ? (
                    <span className={`text-[10px] px-1 rounded ${isCur ? 'bg-amber-700 text-amber-100' : 'bg-amber-200/80 text-amber-900 font-mono'}`}>
                      {def.parasharaWeight}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* The Graphic Chart Display */}
        <div className="flex justify-center py-4 bg-amber-50/10 rounded-xl border border-amber-100">
          {chartFormat === 'north' ? (
            <NorthIndianChart
              chartTitle={activeChartTitle}
              lagnaSignIndex={activeLagnaIdx}
              planets={planets}
              outerPlanets={kundali.outerPlanets}
              planetPlacements={activePlacements}
            />
          ) : (
            <SouthIndianChart
              chartTitle={activeChartTitle}
              lagnaSignIndex={activeLagnaIdx}
              planets={planets}
              outerPlanets={kundali.outerPlanets}
              planetPlacements={activePlacements}
            />
          )}
        </div>

        {/* Detailed Varga Explanation Banner */}
        {currentVargaDef && (
          <div className="mt-5 bg-amber-50/80 p-4 rounded-xl border border-amber-200 text-xs text-slate-700 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/80 pb-2">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0" />
                <strong className="text-amber-950 font-bold text-sm">
                  {currentVargaDef.sanskritName} — {currentVargaDef.name}
                </strong>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-mono font-bold">
                  Arc: {currentVargaDef.divisionArc}
                </span>
                <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-medium">
                  Vimsopaka Weight: {currentVargaDef.parasharaWeight || 0.5} / 20
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
              <div>
                <strong className="text-slate-800 block text-[11px] font-semibold">Significance:</strong>
                <p className="text-slate-600">{currentVargaDef.significance}</p>
                <p className="text-slate-500 mt-1 text-[11px]">{currentVargaDef.description}</p>
              </div>
              <div>
                <strong className="text-slate-800 block text-[11px] font-semibold">Classical BPHS Rule:</strong>
                <p className="text-slate-600 font-serif">{currentVargaDef.classicalRule}</p>
                {currentVargaDef.deities && (
                  <p className="text-amber-900 text-[11px] mt-1">
                    <strong>Ruling Deities:</strong> {currentVargaDef.deities}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Vimsopaka Bala 20-Point Table Card */}
      {vimsopakaScores && (
        <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-amber-100">
            <div>
              <h3 className="font-serif text-lg font-bold text-amber-950 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-700" />
                <span>Parashari Vimsopaka Bala (षोडशवर्ग विंशोपक बल)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Mathematical strength of planets evaluated out of 20 points across all 16 Shodashvarga charts according to Maharishi Parashara
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
              Max Score: 20.0
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(vimsopakaScores).map(([planetKey, scoreObj]: [string, any]) => {
              const isTop = scoreObj.score >= 15;
              const isStrong = scoreObj.score >= 10 && scoreObj.score < 15;
              return (
                <div
                  key={planetKey}
                  className="bg-amber-50/50 border border-amber-200 rounded-xl p-3 flex items-center justify-between shadow-2xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{planetKey}</div>
                    <div className="text-[11px] text-slate-500">{scoreObj.grade}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-bold font-mono text-amber-950">
                      {scoreObj.score} <span className="text-xs font-normal text-slate-500">/ 20</span>
                    </div>
                    <div className="w-20 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full rounded-full ${
                          isTop ? 'bg-emerald-500' : isStrong ? 'bg-amber-500' : 'bg-slate-400'
                        }`}
                        style={{ width: `${scoreObj.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Graha Spashta Planetary Positions Table */}
      <PlanetaryTable planets={planets} outerPlanets={kundali.outerPlanets} />
    </div>
  );
};
